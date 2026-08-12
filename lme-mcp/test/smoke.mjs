// DoD smoke test — executed in-process over a real MCP client (mock embedder, no API key).
// Headline: session A → memory_add → process dies → session B (new process) → memory_search → recall.
// Also exercises the full 4-tool set: memory_state (sees it) and memory_forget (removes it).
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// Run the built server when it exists (the shipped npm package, where `tsx` is a devDependency and
// therefore absent), and fall back to the TypeScript source for local development.
const built = join(root, 'dist', 'server.js');
const launch = existsSync(built)
  ? { command: process.execPath, args: [built] }
  : { command: 'npx', args: ['tsx', 'src/server.ts'] };
const SNAPSHOT = '/tmp/lme-smoke/brain.json';
rmSync('/tmp/lme-smoke', { recursive: true, force: true });

const FACT = 'The founder prefers TypeScript over JavaScript for new projects';
const fail = (m) => { console.error('❌ FAIL:', m); process.exit(1); };
const textOf = (r) => (r.content ?? []).map((c) => c.text).join('\n');

function spawnSession() {
  const transport = new StdioClientTransport({
    ...launch, cwd: root,
    env: { ...process.env, LME_SNAPSHOT: SNAPSHOT, LME_EMBED: 'mock' },
  });
  return { transport, client: new Client({ name: 'smoke', version: '0.0.0' }) };
}

// ---- SESSION A: add, confirm via state, then kill the process ----
const a = spawnSession();
await a.client.connect(a.transport);
const tools = (await a.client.listTools()).tools.map((t) => t.name);
console.log('session A · tools:', tools);
for (const t of ['memory_add', 'memory_search', 'memory_state', 'memory_forget'])
  if (!tools.includes(t)) fail(`tool ${t} not registered`);
await a.client.callTool({ name: 'memory_add', arguments: { content: FACT } });
const stateA = textOf(await a.client.callTool({ name: 'memory_state', arguments: {} }));
console.log('session A · memory_state →', stateA.split('\n')[0]);
if (!stateA.toLowerCase().includes('typescript')) fail('memory_state did not show the added fact');
await a.client.close();               // <-- process A dies here
console.log('session A · process killed\n');

// ---- SESSION B: fresh process, same snapshot, recall → then forget → confirm gone ----
const b = spawnSession();
await b.client.connect(b.transport);
const recalled = textOf(await b.client.callTool({ name: 'memory_search', arguments: { query: 'what language does the founder like to use?' } }));
console.log('session B · memory_search →\n' + recalled);
if (!recalled.toLowerCase().includes('typescript')) fail('recall did not return the fact added in session A');

const forgot = textOf(await b.client.callTool({ name: 'memory_forget', arguments: { query: 'typescript' } }));
console.log('session B · memory_forget →', forgot.split('\n')[0]);
const afterForget = textOf(await b.client.callTool({ name: 'memory_search', arguments: { query: 'what language does the founder like to use?' } }));
if (afterForget.toLowerCase().includes('typescript')) fail('memory_forget did not remove the fact');
await b.client.close();

console.log('\n✅ PASS · A→kill→B recall through MCP→engine→disk · state sees it · forget removes it');

// Regression test — an unusable embedder must FAIL LOUDLY, never silently.
// The vendored provider's embedOnce() returns null on any HTTP/network failure (fine for the
// browser app's ambient path, fatal here): a null vector persists a memory that MMR can never
// retrieve, while memory_add still reports "🧠 remembered". smoke.mjs runs LME_EMBED=mock, whose
// embedder cannot fail, so it never covers this path.
// Real mode is forced offline by pointing LME_BASE_URL at the discard port (connection refused).
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readFileSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// Prefer the built server (present in the shipped package, where `tsx` is absent); fall back to source.
const built = join(root, 'dist', 'server.js');
const launch = existsSync(built)
  ? { command: process.execPath, args: [built] }
  : { command: 'npx', args: ['tsx', 'src/server.ts'] };

const SNAPSHOT = '/tmp/lme-embedfail/brain.json';
rmSync('/tmp/lme-embedfail', { recursive: true, force: true });

const FACT = 'This must never be stored without a usable embedding';
const fail = (m) => { console.error('❌ FAIL:', m); process.exit(1); };
const textOf = (r) => (r.content ?? []).map((c) => c.text).join('\n');

const transport = new StdioClientTransport({
  ...launch, cwd: root,
  env: {
    ...process.env,
    LME_SNAPSHOT: SNAPSHOT,
    LME_EMBED: 'real',                       // not 'mock' → take the provider path
    LME_API_KEY: 'bogus-key-shaped-like-a-real-one',
    LME_BASE_URL: 'http://127.0.0.1:9/v1',   // discard port → fetch rejects → embedOnce returns null
  },
});
const client = new Client({ name: 'embed-failure', version: '0.0.0' });
await client.connect(transport);

// 1) memory_add must report an error rather than claim success.
const added = await client.callTool({ name: 'memory_add', arguments: { content: FACT } });
console.log('memory_add →', added.isError ? 'isError ✅' : 'SUCCESS ❌', '·', textOf(added).split('\n')[0]);
if (!added.isError) fail('memory_add reported success while the embedder was unusable');

// 2) nothing may reach disk with a null/empty embedding.
if (existsSync(SNAPSHOT)) {
  const snap = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
  const bad = (snap.episodic ?? []).filter((e) => !Array.isArray(e.embedding) || e.embedding.length === 0);
  console.log(`snapshot → episodic=${(snap.episodic ?? []).length} unretrievable=${bad.length}`);
  if (bad.length) fail(`persisted ${bad.length} memory/memories with no embedding — unretrievable forever`);
}

// 3) memory_search must not silently answer "no memories" when it could not embed the query.
const searched = await client.callTool({ name: 'memory_search', arguments: { query: 'anything' } });
console.log('memory_search →', searched.isError ? 'isError ✅' : 'SUCCESS ❌', '·', textOf(searched).split('\n')[0]);
if (!searched.isError) fail('memory_search answered normally while the embedder was unusable');

await client.close();
console.log('\n✅ PASS · an unusable embedder fails loudly and writes nothing unretrievable');

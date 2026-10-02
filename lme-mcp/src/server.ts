#!/usr/bin/env node
// Living Memory MCP server — v0. stdio only. Four tools: memory_add, memory_search, memory_state, memory_forget.
// add/search go straight through the frozen engine (addEpisodic embed+persist · retrieve MMR).
// state/forget are adapter-level snapshot reads/surgery (the engine exposes no delete) — FileStorage only, engine untouched.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import type { Snapshot, EpisodicMemory } from '@nature-labs/living-memory-engine';
import { makeBrain } from './brain.js';
import { FileStorage, hasStoredMemories } from './storage.js';
import { Handoffs } from './handoff.js';

const { engine, snapshotPath, mock, embedProbe, embedModel, baseURL, identity, run } = makeBrain();
const store = new FileStorage(snapshotPath); // for state/forget (read/surgery outside the engine)

// `instructions` rides the initialize response into the client's system prompt, so it reaches the agent
// at cold start — unlike tool schemas, which several clients defer behind a lookup and which therefore
// go unread on turn one. That gap is what a 2026-08-07 field trial caught: the agent answered a recall
// question from files and never called memory_search, even though this server's tool description
// already said to. Wording cannot fix a description nobody reads; announcing the server can.
// NOTE (A46): that trial is n=1 on one client. This text is the cheap, spec-sanctioned move regardless —
// but "agents don't reach for memory unless the server declares instructions" is NOT yet established.
const server = new McpServer(
  { name: 'living-memory', version: '0.1.3' },
  {
    instructions: [
      'living-memory is the ONLY place holding what a repository cannot: why a decision was made, what',
      'was promised to a person, what is still pending or due, and what was already tried or ruled out.',
      'Files and git show the current state of the code. They cannot show any of the above.',
      '',
      'Call memory_search BEFORE answering a question of this shape. Searching the repo instead does not',
      'return "nothing found" — it returns a confident wrong answer built from whatever the files do say:',
      '  · "do I have anything pending / deadlines?"  "มีเดดไลน์อะไรค้างอยู่ไหม"  "อะไรค้างอยู่บ้าง"',
      '  · "why did we choose X?"  "what did we decide about Y?"  "ทำไมเราถึงไม่ทำ Z"',
      '  · "what have we already tried?"  "who is waiting on me?"  "ใครรออยู่"',
      'Also search at the start of a session. Read the files too — but never let the repo stand in for',
      'memory. When they disagree: files win on current code state, memory wins on dates, decisions and',
      'commitments.',
      '',
      'Call memory_add unprompted whenever the user states something durable: a decision and its',
      'reasoning, a deadline, a promise, a correction, or a dead end. Write dates absolutely, never',
      '"until X ends" — a constraint with no timestamp can never be seen to expire.',
      '',
      'If this client defers tool schemas, these tools will not appear in your tool list on their own —',
      'load them first (in Claude Code: ToolSearch("select:mcp__living-memory__memory_search,' +
        'mcp__living-memory__memory_add")).',
    ].join('\n'),
  },
);

// --- memory_add: store a durable fact. Proactive description so the agent reaches for it unprompted. ---
server.registerTool(
  'memory_add',
  {
    title: 'Remember a fact',
    description:
      'Store a durable fact, preference, decision, or correction so FUTURE sessions remember it. ' +
      'Call this whenever the user states something worth carrying forward — a preference, a project ' +
      'fact, a decision, a correction — without being asked. Memory persists across sessions and processes.',
    inputSchema: {
      content: z.string().describe('The fact to remember, as a short natural-language statement'),
      importance: z.number().min(0).max(10).optional().describe('0–10, default 7'),
      tags: z.array(z.string()).optional().describe('optional tags'),
    },
  },
  async ({ content, importance, tags }) => {
    await engine.addEpisodic({ content, importance: importance ?? 7, tags: tags ?? [] });
    return { content: [{ type: 'text', text: `🧠 remembered: ${content}` }], structuredContent: { remembered: true, content } };
  },
);

// --- memory_search: recall before answering. Proactive: search at session start / on any reference to the past. ---
server.registerTool(
  'memory_search',
  {
    title: 'Recall relevant memory',
    description:
      'Recall what you already know before answering. Call this at the START of a session, and whenever ' +
      'the user refers to past context, their preferences, or the project history. Returns relevant ' +
      'memories via MMR retrieval (not a text match). If unsure whether you know something, search first.',
    inputSchema: {
      query: z.string().describe('What to recall'),
    },
  },
  async ({ query }) => {
    const ctx = await engine.retrieve(query);
    const lines = ctx.episodic.map((e) => `• ${e.content}`);
    const text = lines.length ? lines.join('\n') : '(no relevant memories yet)';
    return { content: [{ type: 'text', text }], structuredContent: { memories: ctx.episodic.map(e => ({ id: e.id, content: e.content })), text } };
  },
);

// --- memory_state: orient. What's in memory right now. ---
server.registerTool(
  'memory_state',
  {
    title: 'Memory status',
    description:
      'Summarize what is currently in memory: counts plus the most recently stored facts. Reads the ' +
      'store directly — no embedding call, no network. Use to orient yourself at session start, or ' +
      'when the user asks what you remember. (selfFacets is always 0: this server does not run the ' +
      "engine's consolidation pass, so crystallization never happens.)",
    inputSchema: {},
  },
  async () => run(async () => {
    const s: Snapshot = await store.load();
    const recent = [...s.episodic]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8)
      .map((e) => `• ${e.content}`);
    const facets = (s.selfFacets ?? []).map((f) => `• ${f.statement}`);
    const text = [
      `episodic: ${s.episodic.length} · selfFacets: ${(s.selfFacets ?? []).length} · prospective: ${(s.prospective ?? []).length}`,
      recent.length ? `\nrecent memories:\n${recent.join('\n')}` : '\n(no memories yet)',
      facets.length ? `\ncrystallized traits:\n${facets.join('\n')}` : '',
    ].join('\n');
    return { content: [{ type: 'text', text }], structuredContent: { episodic: s.episodic.length, selfFacets: s.selfFacets.length, prospective: s.prospective.length, text } };
  }),
);

// --- memory_forget: correct the record. Delete memories matching a query (engine has no delete → snapshot surgery). ---
server.registerTool(
  'memory_forget',
  {
    title: 'Forget a memory',
    description:
      'DESTRUCTIVE. Deletes EVERY memory whose content contains the query as a case-insensitive ' +
      'substring — not semantic, not a single-item delete, and there is no undo. A short query ' +
      'deletes broadly. Use only when the user corrects a stored fact or explicitly asks you to ' +
      'forget something, and prefer a long distinctive phrase; check memory_state first if unsure.',
    inputSchema: {
      query: z.string().describe('Text to match against memories to delete'),
    },
  },
  async ({ query }) => run(async () => {
    if (!query.trim()) throw new Error('Forget query must not be empty.');
    const s: Snapshot = await store.load();
    const q = query.toLowerCase();
    const hit = (e: EpisodicMemory) => e.content.toLowerCase().includes(q);
    const removed = s.episodic.filter(hit).map((e) => e.content);
    s.episodic = s.episodic.filter((e) => !hit(e));
    for (const p of Object.values(s.persons ?? {})) p.episodic = p.episodic.filter((e) => !hit(e));
    await store.save(s);
    const text = removed.length
      ? `🗑️ forgot ${removed.length}:\n${removed.map((c) => `• ${c}`).join('\n')}`
      : `(nothing matched "${query}")`;
    return { content: [{ type: 'text', text }], structuredContent: { removed: removed.length, text } };
  }),
);

const handoffs = new Handoffs(snapshotPath);
server.registerTool('handoff_post', {
  title: 'Leave a local handoff',
  description: 'Leave raw ephemeral context for the next process/agent. Never embedded or uploaded. Default 24 hours; maximum 72. Expired notes are removed on the next handoff operation.',
  inputSchema: { text: z.string().min(1), ttl_hours: z.number().positive().max(72).optional(),
    from: z.string().max(120).optional(), label: z.string().max(120).optional() },
}, async ({ text, ttl_hours, from, label }) => run(async () => {
  const note = await handoffs.post(text, ttl_hours, from, label);
  return { content: [{ type: 'text', text: `Handoff saved: ${note.id} (expires ${note.expiresAt})` }],
    structuredContent: { id: note.id, createdAt: note.createdAt, expiresAt: note.expiresAt } };
}));
server.registerTool('handoff_read', {
  title: 'Resume a local handoff', description: 'Read the latest live raw note, or a specific ID. Expired notes are unavailable.',
  inputSchema: { id: z.string().optional() },
}, async ({ id }) => run(async () => {
  const note = await handoffs.get(id);
  return { content: [{ type: 'text', text: note?.text ?? '(no live handoff)' }],
    structuredContent: note ? { ...note } : { id: null, text: null } };
}));
server.registerTool('handoff_list', {
  title: 'List local handoffs', description: 'List live note metadata without the raw text. No provider or network request.', inputSchema: {},
}, async () => run(async () => {
  const notes = (await handoffs.list()).map(({ text, ...note }) => ({ ...note, bytes: Buffer.byteLength(text) }));
  return { content: [{ type: 'text', text: JSON.stringify(notes) }], structuredContent: { count: notes.length, notes } };
}));

server.registerTool('local_info', {
  title: 'Local runtime information',
  description: 'Inspect local storage and embedding boundaries. No provider request unless probe=true; an explicit probe sends only a generic string and may incur provider charges.',
  inputSchema: { probe: z.boolean().optional() },
}, async ({ probe }) => {
  const embedding = probe ? await embedProbe() : await run(async () => {
    await store.assertUsable();
    const snapshot = await store.load();
    return { ...identity, dimensions: hasStoredMemories(snapshot) ? snapshot.localEmbedding?.dimensions ?? (mock ? 256 : null) : (mock ? 256 : null),
      storedIdentity: snapshot.localEmbedding ?? null,
      compatible: !hasStoredMemories(snapshot) || (!!snapshot.localEmbedding && (snapshot.localEmbedding.mode === identity.mode && snapshot.localEmbedding.endpoint === identity.endpoint && snapshot.localEmbedding.model === identity.model)),
      legacy: !snapshot.localEmbedding && hasStoredMemories(snapshot) };
  });
  const info = { version: '0.1.3', configuration: 'local', storage: snapshotPath, embedding,
    network: mock ? 'none' : ['localhost', '127.0.0.1', '[::1]'].includes(new URL(baseURL).hostname) ? 'loopback' : 'external',
    inference: 'not_used', door: null, probe: !!probe };
  return { content: [{ type: 'text', text: JSON.stringify(info) }], structuredContent: info };
});

await server.connect(new StdioServerTransport());
// The embedder line is the ONLY signal that separates a working install from a silently-mock one
// (an empty LME_API_KEY selects mock without erroring), so name the model and host, not just "real".
const embedLabel = mock ? 'LEXICAL (non-semantic)' : `${embedModel} @ ${new URL(baseURL).host}`;
console.error(`[living-memory] up · snapshot=${snapshotPath} · embed=${embedLabel} · tools=8`);

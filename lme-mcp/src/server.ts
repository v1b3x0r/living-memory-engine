#!/usr/bin/env node
// Living Memory MCP server — v0. stdio only. Four tools: memory_add, memory_search, memory_state, memory_forget.
// add/search go straight through the frozen engine (addEpisodic embed+persist · retrieve MMR).
// state/forget are adapter-level snapshot reads/surgery (the engine exposes no delete) — FileStorage only, engine untouched.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import type { Snapshot, EpisodicMemory } from '@nature-labs/living-memory-engine';
import { makeBrain } from './brain.js';
import { FileStorage } from './storage.js';

const { engine, snapshotPath, mock, embedProbe, embedModel, baseURL } = makeBrain();
const store = new FileStorage(snapshotPath); // for state/forget (read/surgery outside the engine)

// `instructions` rides the initialize response into the client's system prompt, so it reaches the agent
// at cold start — unlike tool schemas, which several clients defer behind a lookup and which therefore
// go unread on turn one. That gap is what a 2026-08-07 field trial caught: the agent answered a recall
// question from files and never called memory_search, even though this server's tool description
// already said to. Wording cannot fix a description nobody reads; announcing the server can.
// NOTE (A46): that trial is n=1 on one client. This text is the cheap, spec-sanctioned move regardless —
// but "agents don't reach for memory unless the server declares instructions" is NOT yet established.
const server = new McpServer(
  { name: 'living-memory', version: '0.1.1' },
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
    return { content: [{ type: 'text', text: `🧠 remembered: ${content}` }] };
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
    return { content: [{ type: 'text', text }] };
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
  async () => {
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
    return { content: [{ type: 'text', text }] };
  },
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
  async ({ query }) => {
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
    return { content: [{ type: 'text', text }] };
  },
);

await server.connect(new StdioServerTransport());
// The embedder line is the ONLY signal that separates a working install from a silently-mock one
// (an empty LME_API_KEY selects mock without erroring), so name the model and host, not just "real".
const embedLabel = mock ? 'MOCK' : `${embedModel} @ ${new URL(baseURL).host}`;
console.error(`[living-memory] up · snapshot=${snapshotPath} · embed=${embedLabel} · tools=4`);

// Probe the embedder once so an unusable key surfaces here, in the client's log, rather than on the
// user's first memory_add. Deliberately AFTER connect and un-awaited: the handshake must not wait on
// a network round-trip (a slow provider would otherwise look like a startup timeout).
if (!mock)
  embedProbe().then(
    () => console.error('[living-memory] embed check: ok'),
    (e) => console.error(`[living-memory] ⚠️  EMBED UNUSABLE — memory_add/search will fail: ${e.message}`),
  );

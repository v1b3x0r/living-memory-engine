<p align="center">
  <img src="https://raw.githubusercontent.com/v1b3x0r/living-memory-engine/main/docs/assets/lme-banner.jpg" width="720" alt="LME — Memory that follows your agents. Remember. Understand. Grow." />
</p>

# @nature-labs/living-memory-engine

[![npm version](https://img.shields.io/npm/v/%40nature-labs%2Fliving-memory-engine)](https://www.npmjs.com/package/@nature-labs/living-memory-engine)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3178C6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache--2.0-green)](https://www.apache.org/licenses/LICENSE-2.0)

A TypeScript memory engine for agents that remember like a mind, not a log.

Use it when you want a conversation that never ends — and never overflows. Each turn the model sees a small working context composed from memory, not the whole transcript replayed.

**Zero runtime dependencies.** Pure ESM, ports & adapters, no IO inside the engine. You bring storage, an LLM, and an embedder; the engine brings the memory model.

---

## Why

Most chat memory is one of two cheap tricks: replay the entire history until the context window overflows, or bolt on naive RAG that retrieves by similarity alone and never forgets. Neither models how memory actually works.

Forgetting is a feature. A mind decays what's stale, reinforces what's used, merges duplicates, and crystallizes durable traits out of repetition. That's what this engine does:

- **Ebbinghaus decay** — memories lose strength over time unless recalled
- **Consolidation** — near-duplicates merge; weak memories get pruned
- **Crystallization** — repeated patterns graduate into durable self-facets ("who you are")
- **MMR retrieval** — top-K semantic search with diversity, not just similarity
- **Prospective memory** — the agent holds intents ("waiting to hear how the interview went") and resolves them
- **Person attribution** — who *said* it vs. who it's *about*, tracked separately

---

## A real usage snapshot

From a live session of [LME Chat](https://chat.viibe.to), a reference client running this engine in the browser:

```
Whole conversation        ~267,859 tokens · 482 messages
Fed to the model (turn)   ~2,353 tokens
```

That turn's context was composed from engine state — Memories (418), Persons (54), Interactions (486), Self (12), Planner (24), plus a short tail of recent turns. An observed example from one session, not a guaranteed ratio — the point is that context size is bounded by your retrieval config, not by conversation length.

---

## Install

```bash
npm install @nature-labs/living-memory-engine
```

ESM only. Node >= 20, or any modern bundler/browser — the engine itself uses no Node APIs.

---

## Quick start

The engine is a state machine you drive. One turn: ingest → retrieve → inject → *your LLM call* → ingest → tick.

```ts
import {
  MemoryEngine, SeededRandom, randomK, formatInjection,
} from '@nature-labs/living-memory-engine';

const engine = new MemoryEngine({
  storage,                        // load()/save() one JSON snapshot — file, IndexedDB, anything
  chat,                           // your LLM: stream / extract / describeImage / summarizePattern
  embed,                          // text -> number[] — any embedding model
  clock: { now: () => Date.now() },
  random: new SeededRandom(1337), // deterministic if you want it to be
  policy: randomK(3, 7),          // when repetition crystallizes into a trait
  systemPrompt: '',               // identity can start empty — it emerges
});

await engine.ingestUser('my sister got the job at the hospital!');
const ctx = await engine.retrieve('my sister got the job at the hospital!');
const inject = formatInjection(ctx);  // [Who you are] / [Relevant memories] / [You are anticipating]

const reply = await yourLLM(inject, ctx.tail);  // the engine never sees your HTTP layer

await engine.ingestModel(reply);
await engine.tick();  // decay · extract · embed · merge · prune · crystallize
```

For OpenAI-compatible endpoints (OpenAI, Ollama, LM Studio, OpenRouter, DashScope…) there are ready-made ports:

```ts
import { makeChatPort, makeEmbedPort } from '@nature-labs/living-memory-engine/provider';

const cfg = { baseURL: 'http://localhost:11434/v1', apiKey: '', model: 'gemma4:e2b' };
const chat = makeChatPort(cfg);
const embed = makeEmbedPort({ ...cfg, model: 'embeddinggemma' });
```

---

## Mental model

```text
you ── talk ──▶  retrieve: MMR top-K memories + self-facets + pending intents + tail  ──▶  LLM
                        ▲                                                                  │
                        │                                                             reply
              decay · reinforce · merge · prune · crystallize  ◀── tick ◀─────────────────┘
```

`tick()` is where memory lives. After each exchange the engine extracts new episodic memories, embeds them, decays old ones, reinforces what was recalled, merges near-duplicates, prunes what faded — and when a pattern repeats enough, crystallizes it into a self-facet that shapes every future turn.

The LLM never receives the whole history. Identity is not written in the system prompt; it accumulates.

---

## API pointers

- `new MemoryEngine(deps)` — deps are four ports + clock/random/policy. No IO inside.
- `engine.ingestUser(text, image?, speaker?)` / `engine.ingestModel(text)` — record the exchange.
- `engine.retrieve(query)` — compose the working context (`selfTier`, `episodic`, `prospective`, `tail`).
- `formatInjection(ctx)` — render it as the system-side context block.
- `engine.tick()` — run the memory lifecycle.
- Primitives are exported if you want to build your own loop: `decay`, `reinforce`, `merge`, `prune`, `detectPatterns`, `cosineSimilarity`, `mmrSearch`, `placeMemory`, `resolvePerson`.

| Port | Shape | Typical adapter |
|---|---|---|
| `StoragePort` | `load()/save()` one JSON-serializable snapshot | a file, IndexedDB, SQLite row |
| `ChatPort` | `stream`, `extract`, `describeImage`, `summarizePattern` | any LLM (see `./provider`) |
| `EmbedPort` | `embed(text) → number[] \| null` | any embedding model; `null` = backfill later |
| `Clock` / `Random` | `now()` / seeded RNG | injectable ⇒ every behavior is deterministic under test |

The whole engine is ~40 kB unpacked, 95 deterministic tests — fake clock, seeded RNG, in-memory storage. No network, no flakes.

---

## Engine vs. MCP

This package is the substrate. [`@nature-labs/lme-mcp`](https://www.npmjs.com/package/@nature-labs/lme-mcp) wraps it as an MCP server so coding agents get persistent memory across sessions. Same engine, different boundary:

- **Engine (this package)** — memory *inside one mind*: composes each turn's working context
- **MCP** — memory *between minds*: a shared store your agents visit over a protocol

Building your own agent, character, or chat surface → you want the engine.
Just want your coding agent to remember things → you want the MCP.

---

## Status

Experimental, evolving fast, not vaporware: this exact code powers [LME Chat](https://chat.viibe.to) and the published MCP server. Semver starts at 0.1.0 — expect additive changes; snapshots are forward-compatible by design (new fields are optional).

Source: [github.com/v1b3x0r/living-memory-engine](https://github.com/v1b3x0r/living-memory-engine) (`engine/`)

---

apache-2.0 license. built in chiang mai.

*"forgetting is a feature."*

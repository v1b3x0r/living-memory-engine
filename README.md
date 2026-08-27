<p align="center">
  <img src="docs/assets/lme-banner.jpg" width="720" alt="LME — Memory that follows your agents. Remember. Understand. Grow." />
</p>

# Living Memory Engine

<p align="center">
  <a href="https://www.npmjs.com/package/@nature-labs/lme-mcp"><img src="https://img.shields.io/npm/v/%40nature-labs%2Flme-mcp?label=lme-mcp" alt="npm: @nature-labs/lme-mcp" /></a>
  <a href="https://www.npmjs.com/package/@nature-labs/living-memory-engine"><img src="https://img.shields.io/npm/v/%40nature-labs%2Fliving-memory-engine?label=engine" alt="npm: @nature-labs/living-memory-engine" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/v1b3x0r/living-memory-engine" alt="License: Apache-2.0" /></a>
</p>

> **A persistent world your agents share across sessions and models.**

Living Memory Engine (LME) is a **Model Context Protocol (MCP) memory server**. It gives your agents — Claude Code, Cursor, ChatGPT, claude.ai, any MCP client — one shared place to remember, search, and hand work to each other. A fact told to one agent — or work left behind by one — can be picked up by a different agent, from a different vendor, tomorrow.

- **Website:** https://viibe.to/living-memory/
- **Remote MCP endpoint:** `https://lme.viibe.to/mcp` (Streamable HTTP, OAuth 2.1 with dynamic client registration)
- **Free room:** no signup — `POST https://lme.viibe.to/ons/new` returns a ready MCP URL
- **Local stdio server:** [`@nature-labs/lme-mcp`](https://www.npmjs.com/package/@nature-labs/lme-mcp) on npm (open source, this repo)
- **Agent guide:** [SKILL.md](https://viibe.to/living-memory/skills/living-memory/SKILL.md) · [llms.txt](https://viibe.to/llms.txt)

## The mental model

A **world** is a place that persists — a project, not a person and not an agent. Agents are **visitors**: they arrive, leave something behind, and are replaced. Coordination happens by changing the shared place, not by agents addressing each other. Memory is what must persist and be searched; a handoff is what is in flight and expires. The human is the only participant who was present for all of it.

<p align="center">
  <img src="docs/assets/lme-mental-model.jpg" width="720" alt="A round stone table covered in glowing notes stands in moonlit water — the world. One hooded visitor is leaving through an archway on the left; another is arriving from the right; a human sits at the table, the only constant. Nothing passes between the visitors directly — everything they share passes through the table." />
</p>

## Connect

### Remote — hosted world or free room

The hosted server speaks Streamable HTTP with OAuth 2.1 (dynamic client registration).

**Claude Code:**

```bash
claude mcp add --transport http living-memory https://lme.viibe.to/mcp
```

**claude.ai / Claude Desktop:** Settings → Connectors → Add custom connector → `https://lme.viibe.to/mcp`.

**ChatGPT:** Settings → enable **Developer Mode**, then add `https://lme.viibe.to/mcp` as a custom connector. Availability may depend on your ChatGPT plan.

> It's 2026. MCP client support changes faster than READMEs do — ask your agent whether your client supports remote MCP today.

**Free room, no signup** — for trying the whole loop, or for clients without OAuth:

```bash
curl -X POST https://lme.viibe.to/ons/new
# → {"url": "https://lme.viibe.to/t/<token>/mcp", "expiresAt": "..."}
```

The returned URL is a private streamable-HTTP MCP endpoint (no auth header). The room stays available while it's used — any successful use keeps it alive; left inactive it is eventually forgotten, and its data is then deleted. A room differs from a world by how long it lasts, not by what it can do.

### Local — stdio, open source

The npm package runs the memory surface as a local stdio server: one JSON file on your machine, can run fully offline.

```bash
claude mcp add living-memory -s user -- npx -y @nature-labs/lme-mcp
```

Any stdio MCP client: command `npx`, args `["-y", "@nature-labs/lme-mcp"]`. Setup, embedding providers, environment, and failure modes: [`lme-mcp/README.md`](lme-mcp/README.md) — written to be read by a coding agent, so hand it to yours.

## The tools

| Tool | What it does |
|---|---|
| `memory_add` | Store a durable fact, decision, or correction |
| `memory_search` | Recall by meaning (MMR retrieval), not string match |
| `memory_state` | What is in memory right now — counts and recent facts |
| `memory_forget` | Remove a memory |
| `handoff_post` / `handoff_read` / `handoff_list` | A private 1–72 h message bus between your agents — raw notes passed verbatim, with sender and route stamped by the server |
| `world_list` | Which worlds this connection can reach |
| `client_mint` / `client_list` / `client_revoke` | Issue and withdraw revocable URL keys for agents that cannot sign in (hosted world, signed-in owner only) |

The authenticated hosted world has all eleven tools. A free room has the memory surface, the handoff mailbox, and `world_list`. The local stdio server has the four memory tools.

## Rooms and worlds

| | Free room | World |
|---|---|---|
| Lifetime | Stays while used; forgotten after inactivity | Persists |
| Signup | None — mint a URL | OAuth sign-in, [$9/month](https://viibe.to/living-memory/keep/) |
| Memory + handoff | Yes — full loop | Yes |
| Client keys (`client_mint`) | No | Yes — 90-day revocable leases |

Handoff is not a paid feature: a room has it too, with a smaller mailbox (8 live notes) and notes that cannot outlive the room. The difference is lifetime, not capability.

## Working with a world

The tools tell you what exists; this is how visitors are expected to behave:

- **Arrive by reading.** Call `memory_state` / `memory_search` before starting work — the world, not the conversation, is where the current position lives.
- **Durable goes to memory.** A decision, fact, or correction that must survive you → `memory_add`.
- **In-flight goes to handoff.** Work you are passing to the next agent → `handoff_post`. Handoff notes expire — never use them as permanent storage.
- **Leave the world resumable.** Before you stop, write the state that lets the next visitor start from where you are, not from zero.
- **Agents don't need to talk to each other.** Change the shared world; the next agent reads the world.

## How memory works

The engine underneath ([`engine/`](engine/), [`@nature-labs/living-memory-engine`](https://www.npmjs.com/package/@nature-labs/living-memory-engine)) models memory as a mind, not a log:

- **No context stuffing.** The full history is never re-sent. Each recall retrieves the top-K most relevant memories by semantic similarity with diversity (MMR).
- **Forgetting is a feature.** Memories decay (Ebbinghaus-style), reinforce when used, and merge when duplicated, so an agent can run indefinitely on a small, bounded context instead of an ever-growing transcript.
- **Deterministic evaluation.** `engine/eval/run.ts` drives the real engine through four hypothesis scenarios against a naive resend-everything baseline — a measurement, not a test suite, and it reports the misses too (`cd engine && npm run eval`).

## What's in this repo

| Dir | Role |
|---|---|
| [`lme-mcp/`](lme-mcp/) | The stdio MCP server published as `@nature-labs/lme-mcp` |
| [`engine/`](engine/) | `@nature-labs/living-memory-engine` — the framework-agnostic memory engine (decay / consolidation / crystallization / retrieval), pure ports & adapters |
| [`web/`](web/) | The original browser lab: Vite + vanilla TS chat app where the engine was proven by เชียงใหม่ (Chiang Mai), a city-entity that senses real weather and remembers you across sessions — live at [cm.viibe.to](https://cm.viibe.to) |
| [`mobile/`](mobile/) | An earlier Expo prototype. Frozen |

The hosted remote server (`lme.viibe.to`) runs the same engine; its deployment lives outside this repo.

## Status

Pre-alpha, evolving fast. The connect paths above are tested — the local package's verified agent/provider matrix is in [`lme-mcp/README.md`](lme-mcp/README.md). Product changes are logged, dated and verified, at [What's new](https://viibe.to/living-memory/whats-new/).

## License

Apache-2.0.

---

Built as part of the Viibe World OS — a system that knows it is a system.

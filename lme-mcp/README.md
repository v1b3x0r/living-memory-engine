# @nature-labs/lme-mcp

An stdio MCP server that gives a coding agent a memory store that survives across sessions and
processes. Facts are embedded and retrieved by semantic similarity (MMR), not string matching.

**Status: 0.1 pre-alpha.** The install path below is tested. The API may change.

This document is written to be read by a coding agent. It states what the artifact does, what it does
not do, and how it fails. No claims are made that are not verified against the shipped code.

---

## Will this work for me?

**Agents.** This is a local stdio server. It plugs into agents that launch MCP servers as a
subprocess.

| | |
|---|---|
| ✅ **Claude Code** | verified — installed, connected, tools called |
| ✅ **Hermes** | verified — the agent installed and configured it unassisted |
| ✅ **Codex** | verified — `codex mcp add`, tools called, real results returned |
| ◻️ Cursor · Cline · Windsurf | standard stdio config below; we have not tested these |
| ❌ Claude web / Desktop / mobile | these take **remote** MCP connectors over HTTP, not local stdio |

**Embeddings.** Any OpenAI-compatible `/v1/embeddings` endpoint. No chat/LLM model is needed.

| | | |
|---|---|---|
| ✅ **Qwen Cloud** (default) | 1024-dim | needs an API key |
| ✅ **llama.cpp** | 768-dim tested | fully offline; ignores the model name, so no extra config |
| ✅ **Ollama** | 768-dim tested | fully offline; set `LME_EMBED_MODEL=embeddinggemma` |
| ✅ **offline mock** | 256-dim | no key, **not semantic** — for the smoke test only |
| ✅ **OpenRouter** | 2048-dim tested | 31 embedding models, some free; set `LME_EMBED_MODEL` |
| ◻️ OpenAI · LM Studio · gateways | — | expected to work via `LME_EMBED_MODEL`; untested |

✅ = verified end-to-end on this version (written in one process, recalled in another).
◻️ = should work by construction, but nobody has run it.

**One store per provider.** Providers return different vector lengths, and a length mismatch scores
similarity `0` instead of raising — so pointing an existing store at a new provider silently makes
every memory in it unretrievable. Give each provider its own `LME_SNAPSHOT` path.

---

## For humans — give this to your coding agent

```
Install @nature-labs/lme-mcp for me. Read its package README first (it is written for you),
then: install it, run its bundled smoke test to confirm it works, configure it as an MCP
server for this machine, verify the server starts and reports a real embedder on its
startup line (anything other than embed=MOCK), and show me the memory tools that became
available. Ask me before changing any existing configuration beyond what the install
requires.
```

That is the whole human interface. Everything below is reference.

---

## FACTS

```
Package:                @nature-labs/lme-mcp
Version:                0.1.1
Status:                 pre-alpha
License:                Apache-2.0
Runtime:                Node >= 20.12.0          (uses process.loadEnvFile)
Transport:              stdio only               (no HTTP, no SSE)
Server name:            living-memory
Tools:                  memory_add, memory_search, memory_state, memory_forget
Storage:                one JSON file = one brain
Storage path:           $LME_SNAPSHOT, default ~/.living-memory/brain.json
Write strategy:         copy current -> .bak, write .tmp, rename over target
Read fallback:          target -> .bak -> empty snapshot
LLM / chat model:       NOT required and never called by any tool
Embedding model:        $LME_EMBED_MODEL, default text-embedding-v4
Embedding dimensions:   whatever the provider returns (1024 on the default)
Embedding provider:     any OpenAI-compatible /v1/embeddings endpoint
Default base URL:       https://dashscope-intl.aliyuncs.com/compatible-mode/v1
                        (Qwen Cloud; the endpoint is branded "DashScope")
Verified providers:     Qwen Cloud (default) · llama.cpp · Ollama · OpenRouter
Network required:       only for embedding calls, only when a key is present
Offline mode:           yes - deterministic 256-dim hash embedder, NOT semantic
Consolidation:          NOT RUN - see NOT IMPLEMENTED
Concurrency control:    none - last write wins
Telemetry:              none
```

### Environment variables

```
LME_API_KEY     API key. Absent or empty -> mock embedder. For a local server that
                needs no auth, set any non-empty placeholder to leave mock mode.
LME_SNAPSHOT    Path to the brain file. Parent directory is created if missing.
LME_BASE_URL    OpenAI-compatible base URL. Default above.
LME_EMBED_MODEL Embedding model name sent to that endpoint. Default text-embedding-v4.
LME_EMBED       "mock" forces the offline embedder regardless of key.
```

Read at startup from, in order: `<package>/.env`, then `~/.living-memory/.env`. **A variable already
present in the environment is never overwritten by either file.**

---

## INSTALL

### 1. Key

The key is a **Qwen Cloud** API key. The endpoint is branded *DashScope*, which is the same account —
if you have a Qwen Cloud login, you already have the key.

Store it in a file, not in the MCP registration. MCP clients write `--env` values into their config
in plaintext.

```bash
mkdir -p ~/.living-memory
printf 'LME_API_KEY=%s\n' "YOUR_QWEN_CLOUD_KEY" > ~/.living-memory/.env
chmod 600 ~/.living-memory/.env
```

#### Or run fully local, with no key and no network

Any OpenAI-compatible `/v1/embeddings` endpoint works. Both of these were verified end-to-end on this
version — written in one process, recalled in another:

```bash
# llama.cpp   — llama-server -m <embedding-model>.gguf --embeddings --port 8099
LME_BASE_URL=http://127.0.0.1:8099/v1
LME_API_KEY=local              # any non-empty placeholder: an empty key selects the mock embedder
# no LME_EMBED_MODEL needed — llama.cpp ignores the model name and uses the loaded model

# Ollama      — ollama pull embeddinggemma
LME_BASE_URL=http://127.0.0.1:11434/v1
LME_API_KEY=local
LME_EMBED_MODEL=embeddinggemma # required: Ollama validates the model name
```

Or a different hosted provider — OpenRouter was verified the same way:

```bash
LME_BASE_URL=https://openrouter.ai/api/v1
LME_API_KEY=sk-or-...
LME_EMBED_MODEL=nvidia/nemotron-3-embed-1b:free   # list: /api/v1/embeddings/models
```

Confirm the startup line names the model you expect. Give each provider its own `LME_SNAPSHOT`.

### 2. Register

**Claude Code**

```bash
claude mcp add living-memory -s user \
  --env LME_SNAPSHOT=$HOME/.living-memory/brain.json \
  -- npx -y @nature-labs/lme-mcp
```

**Other MCP clients** (Cursor, Codex, Cline, Windsurf) — client config JSON:

```json
{
  "mcpServers": {
    "living-memory": {
      "command": "npx",
      "args": ["-y", "@nature-labs/lme-mcp"],
      "env": { "LME_SNAPSHOT": "/absolute/path/to/.living-memory/brain.json" }
    }
  }
}
```

If registering a local file path instead of `npx`, the path **must be absolute**. Clients store the
command and arguments verbatim — a relative path is kept relative and is later resolved against the
*client's* working directory, not yours. `claude mcp add` also defaults to `-s local`, which scopes
the entry to the directory you ran it in; use `-s user` for a machine-wide server. A path that does
not resolve shows as `✘ Failed to connect`, reported to the model as `MCP error -32000`, which says
only that the process exited. Verify what was stored: `claude mcp get living-memory`.

MCP servers are loaded at client start. Reconnect (`/mcp`) or start a new session before use.

### 3. Verify

```bash
npm install @nature-labs/lme-mcp
node node_modules/@nature-labs/lme-mcp/test/smoke.mjs
```

Expected final line:

```
✅ PASS · A→kill→B recall through MCP→engine→disk · state sees it · forget removes it
```

This writes a memory in one process, kills it, and recalls the memory from a second process. It uses
the mock embedder, so it needs no key and no network.

On startup the server writes one line to stderr, naming the model and host it will embed with:

```
[living-memory] up · snapshot=<path> · embed=text-embedding-v4 @ dashscope-intl.aliyuncs.com · tools=4
```

`embed=MOCK` means no usable key was found and memories will be stored with non-semantic vectors.
This line is the only signal that separates a working install from a silently-mock one — check it.
With a key present the server also logs `embed check: ok` or `⚠️ EMBED UNUSABLE`.

---

## TOOLS

### `memory_add`
```
content     string             required   the fact, as a natural-language statement
importance  number 0-10        optional   default 7
tags        string[]           optional   default []
```
Embeds `content`, appends to the store, writes to disk. Returns `🧠 remembered: <content>`.
Returns an error and writes nothing if embedding fails.

### `memory_search`
```
query       string             required
```
Embeds the query and runs MMR retrieval over stored memories. Returns matching memory contents, one
per line, or `(no relevant memories yet)`. Returns an error if embedding fails.

### `memory_state`
```
(no parameters)
```
Returns counts (episodic, selfFacets, prospective) and up to 8 most recently created memories.
Reads the file directly; does not embed and does not call the network.

### `memory_forget`
```
query       string             required
```
Destructive. See DESTRUCTIVE OPERATIONS.

---

## BEHAVIOR

- Every `memory_add` performs one embedding call and one full-file write.
- Every `memory_search` performs one embedding call and one full-file read.
- Memories are stored with the embedding vector inline; the file grows with every memory.
- Retrieval is semantic. A query sharing no words with a memory can still match it.
- Nothing is written to the store at startup or shutdown.
- Memory strength and recall timestamps are recorded but **never acted upon**, because the
  consolidation pass is not run.

---

## NOT IMPLEMENTED

Stated as absences, not as roadmap.

```
Memory decay / reinforce / merge / prune
    Implemented in the underlying engine. NOT executed by this server. This server calls only
    addEpisodic and retrieve; it never runs the consolidation pass. Stored memories do not
    weaken, merge, or get pruned. The store is append-only except via memory_forget.

Crystallization (selfFacets)
    Not executed, for the same reason. selfFacets remains [] permanently.

Contradiction resolution
    Not implemented. If you store a fact and later store its opposite, both remain and both can
    be returned by the same search. Nothing detects, flags, or orders them.

Supersede / update
    Not implemented. There is no way to edit or replace a memory. Correcting a fact means
    memory_forget followed by memory_add, which destroys the record that the fact was ever
    otherwise.

Background continuity
    Not implemented. The server is a child process of the MCP client. It exists only while the
    client runs and does nothing between tool calls.

Cross-machine sync
    Not implemented. The store is a local file. It is shared across sessions and across agents
    on one machine. It does not leave that machine.

Chat / generation
    Not implemented and not needed. No tool calls a chat model. Only /v1/embeddings is used,
    so a provider that serves no embedding models cannot back this server on its own — check
    that yours exposes /v1/embeddings before pointing LME_BASE_URL at it.

Concurrency control
    Not implemented. No locking. Two clients writing one brain file will lose writes.

Auth / multi-tenancy / quotas
    Not implemented. Anything with read access to the file has full access to the memories.

Input validation
    Not implemented. memory_add stores the string it is given, including any markup.

Unprompted use
    Not a feature and not claimed. The server declares MCP `instructions`, which is delivered
    into the client's system prompt at session start. Whether an agent then chooses to call
    these tools when it does not already know an answer has not been measured.
```

---

## SILENT FAILURE MODES

These fail without an error. They are the reason this section exists.

**Empty `LME_API_KEY` silently selects the mock embedder.**
An empty value set in the MCP config *beats* the `.env` file, because a variable already in the
environment is never overwritten. The result is a working server storing non-semantic vectors.
Detection: the startup line reads `embed=MOCK` instead of `embed=dashscope`.

**Changing the embedding model or dimensions makes every existing memory unretrievable.**
Similarity between vectors of different lengths returns `0` rather than raising. Old memories stay
in the file, keep being counted by `memory_state`, and can never be returned by `memory_search`
again. There is no dimension guard and no migration. Detection: `memory_state` counts memories that
no query can reach.

**Mock and real vectors are not interchangeable.**
Mock is 256-dim, real is 1024-dim. A store built without a key cannot be searched once a key is
added, per the previous point. Start with the key configured, or discard the store.

**A store written by another Living Memory application may not be searchable here.**
Other deployments pin different dimensions for the same model name. Same provider and same model
name do not guarantee the same vector length.

---

## DESTRUCTIVE OPERATIONS

**`memory_forget(query)`**

- Lowercases `query` and the stored content, then deletes **every memory whose content contains
  that substring.**
- Applies to the main store and to all per-person stores.
- Not semantic. Not a single-item delete. There is no id-based delete.
- No preview, no count returned before deleting, no confirmation step, no undo.
- Returns the list of deleted contents after they are gone.
- A short query deletes broadly. `memory_forget("the")` deletes nearly everything.

Before a broad forget, copy `~/.living-memory/brain.json`. The `.bak` file beside it holds only the
state before the most recent write and is overwritten by the next one.

---

## LICENSE

Apache-2.0. See `LICENSE` and `NOTICE`.

Bundles `@nature-labs/living-memory-engine` (Apache-2.0) as prebuilt JavaScript. Source:
https://github.com/v1b3x0r/living-memory-engine

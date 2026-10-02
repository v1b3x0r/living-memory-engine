# @nature-labs/living-memory-mcp

**0.1.3 release candidate — local source; publication pending.**

Local memory for people and agents, over stdio MCP. Remember a fact in one
process and recall it in another. Canonical memory lives in a private JSON file
on your device. Embedding computation is configured separately.

The previous name, `@nature-labs/lme-mcp`, remains as a compatibility entry point
at version 0.1.3. Both names run one implementation. The version returned by the
MCP handshake matches the package version.

## Start with the CLI

CLI 0.1.0-rc.5 provides Local, Room and World from `lm`. With Node >=20.12 and
npm installed, the release commands are:

```sh
lm setup local
lm config keys
lm create my-memory --local --provider openrouter
printf '%s' 'เชียงใหม่ is my workshop base' | lm remember local:my-memory
printf '%s' 'เชียงใหม่' | lm recall local:my-memory
lm doctor local:my-memory
lm inspect local:my-memory --json
lm mcp local:my-memory
```

Interactive CLI creation offers OpenRouter first and fetches a live embedding
model picker. `lm config keys` stores hidden input in private LM_HOME/lm.config;
environment variables override that file. For agents, list models with
`lm models --provider openrouter --json`, then supply an explicit --model ID.
For **lexical/hash retrieval, not semantic AI**, use --lexical. That mode supports
Unicode text without an embedding API or network. To use on-device semantic
retrieval, create a separate Local with an explicit provider/model:

```sh
# Pull your chosen embedding model in Ollama before this step.
lm create semantic-notes --local --provider ollama --model embeddinggemma
lm doctor local:semantic-notes --probe
```

Managed CLI Locals ignore global legacy LME configuration. API keys are read
from a named environment variable or private lm.config; they are not stored in
per-Local configuration or printed:

```sh
lm create hosted-embedding --local --provider openrouter \
  --model YOUR_EMBEDDING_MODEL --key-env OPENROUTER_API_KEY
lm doctor local:hosted-embedding --probe
```

Set that variable privately in the environment of the CLI/agent process.
Inspect shows that text is sent to the provider even though storage is Local.
An explicit probe sends a generic diagnostic string and may incur provider
charges. Ordinary diagnostics make no embedding request. Remember/recall do
not require or call a chat model.

## Direct agent configuration

After publication, new registrations can pin the canonical package:

```json
{
  "mcpServers": {
    "living-memory": {
      "command": "npx",
      "args": ["-y", "@nature-labs/living-memory-mcp@0.1.3"],
      "env": { "LME_SNAPSHOT": "/absolute/private/path/brain.json", "LME_EMBED": "lexical" }
    }
  }
}
```

Alternatively, `lm mcp local:<name>` emits the exact local client configuration
for the managed store. It starts `lm serve local:<name>` and includes an absolute
CLI path and LM_HOME, but no API keys. Reconnect the client after registering.

## Tools

| Tool | Capability |
| --- | --- |
| memory_add | Embed and persist a fact; refuses invalid/incompatible embeddings |
| memory_search | Retrieve relevant facts and persist recall metadata |
| memory_state | Counts and recent facts; no embedding request |
| memory_forget | Explicit destructive substring deletion; empty queries refused |
| handoff_post | Raw ephemeral note, default 24 hours and maximum 72 |
| handoff_read | Latest live note or a specific ID, verbatim |
| handoff_list | Live note metadata without text |
| local_info | Storage, embedding identity and network boundary; optional probe |

Handoffs are separate private files, never embedded or uploaded. Expired notes
are unavailable and removed on the next handoff operation. A remember is durable
storage; a handoff is temporary continuation context. Tools provide both readable
text and structured results.

## Environment (direct MCP)

| Variable | Meaning |
| --- | --- |
| LME_SNAPSHOT | Absolute store path; default ~/.living-memory/brain.json |
| LME_EMBED | lexical/mock for offline hash mode; real for semantic mode |
| LME_API_KEY | Provider key; local servers may use a nonempty placeholder |
| LME_BASE_URL | OpenAI-compatible base URL; legacy default is DashScope intl |
| LME_EMBED_MODEL | Embedding model; legacy DashScope default text-embedding-v4 |
| LME_CONFIG_ISOLATED | 1 disables package and ~/.living-memory/.env loading |
| LME_ADOPT_LEGACY | 1 explicitly acknowledges a confirmed legacy embedding identity |

For compatibility, an unset key selects lexical mode unless LME_EMBED=real.
A failed semantic request never falls back to lexical retrieval. Existing env
values win over package .env and ~/.living-memory/.env. Keys never belong in
public registration examples. CLI-created semantic Locals require an explicit
model. Ollama/LM Studio/OpenRouter/generic providers share the OpenAI-compatible
embedding contract; model availability is provider-specific.

## Storage and upgrades

Each store is bound to mode, endpoint, model and observed dimensions. Equal
vector lengths alone do not mean models are interchangeable. An identity or
vector mismatch fails before writing: use the original configuration or create
another Local. No automatic migration or re-embedding exists.

Pre-0.1.3 files have unverified provenance. First inspect state and back up the
original file. Only after confirming the exact original provider/model may you
set LME_ADOPT_LEGACY=1 for an adoption operation. Dimension checks still apply;
a mixed/invalid store cannot be adopted. Remove the variable afterward. The
normal backup is rotated by later writes; keep your separate original backup.
Legacy hash stores used an ASCII tokenizer; this release's Unicode hash mode is
a different identity. Re-create selected content in a new lexical Local rather
than claiming old hash vectors have the new identity.

Directory/file permissions must be 0700/0600. Existing unsafe permissions and
corrupt primary files fail visibly; they are never replaced with empty memory.
Backup restoration is explicit. All operations share a per-store lock, including
search (which writes recall metadata). Same-process callers queue; another
process receives a busy error without retry. After a crash, examine
`brain.json.lock/owner.json`, confirm no process is using the store, then remove
that lock explicitly. A live lock is never automatically stolen. Stale .tmp
files also require inspection before recovery.

No HTTP server, hosted Door, tunnel, automatic upload, chat, consolidation pass
or full-store transfer is provided. Local storage persists until you remove it;
Room and World remain separate hosted configurations.

## Verification

```sh
npm ci
npm test
```

Tests use disposable stores, explicit lexical mode and loopback embedding
fixtures. They cover cross-process persistence, concurrent operations, identity
and dimension failures, permissions/corruption, Thai text and handoff expiry.
They do not certify live semantic model availability or provider quality.

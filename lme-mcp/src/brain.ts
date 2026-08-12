// brain.ts — minimal Living Memory wiring for the MCP spike.
// Mirrors pathum/src/server/engine.ts (createBrain) but stripped to the thinnest seam:
// one FileStorage brain + an embed port. The engine itself is the frozen vendored tarball, untouched.
//
// Embeddings drive real MMR retrieval. Two modes:
//   • real  — LME_API_KEY set → DashScope text-embedding-v4. We send no `dimensions`, so vectors
//             come back at v4's default 1024 — matching pathum, but NOT interchangeable with
//             cm/web (pins 768 in web/src/lib/qwenproxy.ts) or lme-chat (pins per provider).
//             Snapshots can't be moved between them: cosine similarity needs equal dimensions.
//   • mock  — no key (or LME_EMBED=mock) → deterministic local hash embedder, for offline testing.
//             In mock mode retrieveMinSimilarity is relaxed to 0 (fake vectors aren't semantic),
//             so the retrieval path (mmrSearch) still runs end-to-end without a provider.
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import {
  MemoryEngine, SeededRandom, randomK,
  type ChatPort, type EmbedPort, type EngineConfig, type SelfFacet,
} from '@nature-labs/living-memory-engine';
import { makeChatPort, makeEmbedPort } from '@nature-labs/living-memory-engine/provider';
import { FileStorage } from './storage.js';

const DASHSCOPE = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';

function defaultSnapshotPath(): string {
  return process.env.LME_SNAPSHOT ?? join(homedir(), '.living-memory', 'brain.json');
}

// Keys belong on disk, not inline in the MCP registration — `claude mcp add --env` writes them into
// ~/.claude.json in plaintext, and re-registering means retyping the secret. Node's loader never
// overwrites an entry already in process.env, so anything passed explicitly still wins and these
// files only fill gaps; the first file to define a var beats later ones.
//   1. <package>/.env         — dev convenience for `npm start` (gitignored)
//   2. ~/.living-memory/.env  — machine config beside the snapshot; outside any repo, so it cannot
//                               be committed by accident. The recommended home for a real key.
function loadDotEnvFiles(): void {
  const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  for (const p of [join(pkgRoot, '.env'), join(homedir(), '.living-memory', '.env')])
    if (existsSync(p)) process.loadEnvFile(p);
}

// Deterministic offline embedder: FNV-1a hash each token into a fixed-dim bag-of-words, L2-normalize.
// Not semantic — proves the wiring (persist → embed → mmrSearch) without any API key.
function mockEmbedPort(dim = 256): EmbedPort {
  return {
    async embed(text: string): Promise<number[]> {
      const v = new Array<number>(dim).fill(0);
      for (const tok of text.toLowerCase().match(/[a-z0-9]+/g) ?? []) {
        let h = 2166136261;
        for (let i = 0; i < tok.length; i++) { h ^= tok.charCodeAt(i); h = Math.imul(h, 16777619); }
        v[(h >>> 0) % dim] += 1;
      }
      const n = Math.hypot(...v) || 1;
      return v.map(x => x / n);
    },
  };
}

// The vendored provider's embedOnce() returns null on ANY http/network failure instead of throwing
// (deliberate asymmetry over there: chatStream throws, embed stays quiet so a failed ambient embed
// can't break a chat turn in the browser app). Here that policy is wrong: EmbedPort.embed is typed
// `Promise<number[] | null>` and the engine writes the result straight into `embedding`, so a bad
// key persists a memory MMR can never retrieve while memory_add still answers "🧠 remembered".
// The engine is frozen, so tighten the contract at our own port boundary.
function strictEmbedPort(port: EmbedPort, baseURL: string): EmbedPort {
  return {
    async embed(text: string): Promise<number[]> {
      const v = await port.embed(text);
      if (!Array.isArray(v) || v.length === 0)
        throw new Error(
          `embed failed via ${baseURL} (no vector returned) — check LME_API_KEY / LME_BASE_URL, ` +
          `or set LME_EMBED=mock to run offline.`,
        );
      return v;
    },
  };
}

// add/search never call chat; a stub keeps the engine constructable without an LLM.
const stubChat: ChatPort = {
  async *stream() { throw new Error('chat not wired in spike (memory_add / memory_search only)'); },
  async describeImage() { throw new Error('no image support in spike'); },
  async extract() { return { episodic: [], prospective: [] }; },
  async summarizePattern() { return { statement: '', kind: 'voice' as SelfFacet['kind'] }; },
};

export interface BrainOpts { snapshotPath?: string; apiKey?: string; baseURL?: string; mock?: boolean; embedModel?: string; }

export function makeBrain(opts: BrainOpts = {}) {
  loadDotEnvFiles(); // before any process.env read below
  const snapshotPath = opts.snapshotPath ?? defaultSnapshotPath();
  const apiKey = opts.apiKey ?? process.env.LME_API_KEY;
  const mock = opts.mock ?? (process.env.LME_EMBED === 'mock' || !apiKey);
  const baseURL = opts.baseURL ?? process.env.LME_BASE_URL ?? DASHSCOPE;
  // Providers disagree about the model name for the same capability (DashScope `text-embedding-v4`,
  // Ollama `embeddinggemma`, OpenAI `text-embedding-3-small`), and some — llama.cpp — ignore the
  // field entirely and embed with whatever is loaded. Repointing LME_BASE_URL alone is therefore not
  // enough for the providers that validate the name, so the name is configurable too.
  const embedModel = opts.embedModel ?? process.env.LME_EMBED_MODEL ?? 'text-embedding-v4';

  mkdirSync(dirname(snapshotPath), { recursive: true });

  const embed: EmbedPort = mock
    ? mockEmbedPort()
    : strictEmbedPort(makeEmbedPort({ baseURL, apiKey: apiKey!, model: embedModel }, fetch), baseURL);
  const chat: ChatPort = mock
    ? stubChat
    : makeChatPort({ baseURL, apiKey: apiKey!, model: 'qwen3.7-plus' }, fetch);

  const config: Partial<EngineConfig> = mock ? { retrieveMinSimilarity: 0 } : {};

  const engine = new MemoryEngine({
    storage: new FileStorage(snapshotPath),
    embed, chat,
    clock: { now: () => Date.now() },
    random: new SeededRandom(1337),
    policy: randomK(3, 7),
    config,
  });

  // One throwaway embed, so callers can verify the provider is usable without touching the snapshot.
  const embedProbe = () => embed.embed('probe').then(() => undefined);

  return { engine, snapshotPath, mock, embedProbe, embedModel, baseURL };
}

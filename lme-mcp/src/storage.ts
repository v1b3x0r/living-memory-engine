import { readFile, writeFile, rename, copyFile, lstat } from 'node:fs/promises';
import type { Snapshot, StoragePort } from '@nature-labs/living-memory-engine';

export interface EmbeddingIdentity {
  mode: 'lexical' | 'semantic';
  endpoint: string | null;
  model: string;
  dimensions: number | null;
}
export type LocalSnapshot = Snapshot & { localEmbedding?: EmbeddingIdentity };
export const EMPTY_SNAPSHOT: Snapshot = {
  messages: [], episodic: [], selfFacets: [], prospective: [], lastTick: 0,
};

async function readPrivate(path: string): Promise<LocalSnapshot | null> {
  let info;
  try { info = await lstat(path); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null; throw e; }
  if (!info.isFile() || info.nlink !== 1 || (info.mode & 0o077) !== 0)
    throw new Error('Local snapshot must be a private regular file (0600).');
  let s: LocalSnapshot;
  try { s = JSON.parse(await readFile(path, 'utf8')); }
  catch { throw new Error('Local snapshot is corrupt. Restore a verified backup explicitly; it was not replaced.'); }
  if (!s || !['messages', 'episodic', 'selfFacets', 'prospective'].every(k => Array.isArray((s as any)[k])))
    throw new Error('Invalid local snapshot structure. Restore explicitly; it was not replaced.');
  return s;
}

export class FileStorage implements StoragePort {
  constructor(private filePath: string, private identity?: EmbeddingIdentity) {}

  async load(): Promise<LocalSnapshot> {
    const s = await readPrivate(this.filePath);
    if (s) return s;
    if (await readPrivate(this.filePath + '.bak'))
      throw new Error('Primary snapshot missing; backup exists. Restore it explicitly before continuing.');
    return structuredClone(EMPTY_SNAPSHOT);
  }

  async assertUsable(): Promise<void> {
    try { await lstat(this.filePath + '.tmp'); throw new Error('Local temporary file exists; inspect it before explicit recovery.'); }
    catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
    try {
      const info = await lstat(this.filePath + '.bak');
      if (!info.isFile() || info.nlink !== 1 || (info.mode & 0o077)) throw new Error('Unsafe local backup file.');
    } catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
  }

  async assertEmbedding(): Promise<void> {
    if (!this.identity) return;
    await this.assertUsable();
    const s = await this.load();
    const saved = s.localEmbedding;
    if (!saved && (s.episodic.length || s.selfFacets.length || s.prospective.length || Object.values(s.persons ?? {}).some(p => p.episodic.length))) {
      if (this.identity.model === 'unicode-fnv1a-256-v1')
        throw new Error('Legacy hash embeddings have a different tokenizer identity. Re-create selected content in a new lexical Local; no automatic re-embedding.');
      if (process.env.LME_ADOPT_LEGACY !== '1')
        throw new Error('Legacy embedding identity is unknown. Read state first; use LME_ADOPT_LEGACY=1 only after confirming the original provider/model. No automatic re-embedding.');
      // Episodic vectors and pending intent clues are required for retrieval.
      // Self-facet embeddings are optional in the engine's legacy contract.
      const vectors = [
        ...s.episodic.map(m => m.embedding),
        ...Object.values(s.persons ?? {}).flatMap(p => p.episodic.map(m => m.embedding)),
        ...s.prospective.filter(p => p.status === 'pending').map(p => p.clueEmbedding),
        ...s.selfFacets.map(f => f.embedding).filter(v => v != null),
        ...s.prospective.filter(p => p.status !== 'pending').map(p => p.clueEmbedding).filter(v => v != null),
      ];
      if (vectors.some(v => !Array.isArray(v) || !v.length || v.some((n: unknown) => typeof n !== 'number' || !Number.isFinite(n))))
        throw new Error('Legacy store contains invalid embeddings; repair explicitly before adoption.');
      const dims = new Set<number>(vectors.map(v => v!.length));
      if (dims.size > 1) throw new Error('Legacy store contains mixed dimensions; adoption refused.');
      this.identity.dimensions = dims.size ? [...dims][0] : null;
    }
    if (saved) {
      if (saved.mode !== this.identity.mode || saved.endpoint !== this.identity.endpoint || saved.model !== this.identity.model)
        throw new Error('Embedding configuration differs from this store. Use its original configuration or create another Local; no automatic re-embedding.');
      if (saved.dimensions !== null && (!Number.isInteger(saved.dimensions) || saved.dimensions < 1))
        throw new Error('Invalid stored embedding identity. Repair explicitly.');
      this.identity.dimensions = saved.dimensions;
    }
  }

  checkVector(v: unknown): number[] {
    if (!Array.isArray(v) || !v.length || v.some(n => typeof n !== 'number' || !Number.isFinite(n)))
      throw new Error('Embedding provider returned an invalid vector. Nothing was stored.');
    if (this.identity?.mode === 'semantic' && !v.some(n => n !== 0))
      throw new Error('Embedding provider returned an unusable zero vector. Nothing was stored.');
    if (this.identity?.dimensions != null && this.identity.dimensions !== v.length)
      throw new Error('Embedding dimensions changed. Use the original model or create another Local; nothing was stored.');
    if (this.identity) this.identity.dimensions = v.length;
    return v;
  }

  async save(s: Snapshot): Promise<void> {
    const tmp = this.filePath + '.tmp';
    const previous = await readPrivate(this.filePath);
    // All callers must own withStoreLock. Refuse planted symlinks and stale tmp files.
    try { await lstat(tmp); throw new Error('Local temporary file exists; inspect it before explicit recovery.'); }
    catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
    try {
      const info = await lstat(this.filePath + '.bak');
      if (!info.isFile() || info.nlink !== 1 || (info.mode & 0o077)) throw new Error('Unsafe local backup file.');
    } catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; }
    if (previous) await copyFile(this.filePath, this.filePath + '.bak');
    const value: LocalSnapshot = { ...s };
    if (this.identity) value.localEmbedding = { ...this.identity };
    await writeFile(tmp, JSON.stringify(value), { encoding: 'utf8', mode: 0o600, flag: 'wx' });
    await rename(tmp, this.filePath);
  }
}

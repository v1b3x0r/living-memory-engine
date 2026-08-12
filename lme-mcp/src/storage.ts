// FileStorage — reused verbatim from pathum/src/server/storage.ts (the thinnest Node StoragePort:
// one JSON file = one brain, atomic write + .bak fallback). The engine is untouched.
import { readFile, writeFile, rename, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { Snapshot, StoragePort } from '@nature-labs/living-memory-engine';

export const EMPTY_SNAPSHOT: Snapshot = {
  messages: [], episodic: [], selfFacets: [], prospective: [], lastTick: 0,
};

export class FileStorage implements StoragePort {
  constructor(private filePath: string) {}

  async load(): Promise<Snapshot> {
    for (const p of [this.filePath, this.filePath + '.bak']) {
      if (!existsSync(p)) continue;
      try { return JSON.parse(await readFile(p, 'utf8')) as Snapshot; }
      catch (e) { console.error(`[storage] unreadable ${p}:`, e); } // corrupt → try .bak; log loudly
    }
    return structuredClone(EMPTY_SNAPSHOT);
  }

  async save(s: Snapshot): Promise<void> {
    const tmp = this.filePath + '.tmp';
    if (existsSync(this.filePath)) await copyFile(this.filePath, this.filePath + '.bak');
    await writeFile(tmp, JSON.stringify(s), 'utf8');
    await rename(tmp, this.filePath); // atomic on same fs
  }
}

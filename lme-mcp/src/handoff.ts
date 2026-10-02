import { randomUUID } from 'node:crypto';
import { readFile, writeFile, lstat, rename } from 'node:fs/promises';

export interface Handoff {
  id: string; text: string; from: string | null; label: string | null;
  createdAt: string; expiresAt: string;
}

// Calls are protected by the snapshot operation lock. Notes never enter the engine.
export class Handoffs {
  constructor(private snapshot: string, private now = () => Date.now()) {}
  private get path() { return this.snapshot + '.handoffs.json'; }

  private async read(): Promise<Handoff[]> {
    try {
      const info = await lstat(this.path);
      if (!info.isFile() || (info.mode & 0o077) || info.size > 8 << 20)
        throw new Error('Handoffs must be a private regular file under 8 MiB.');
    } catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return []; throw e; }
    let notes: Handoff[];
    try { notes = JSON.parse(await readFile(this.path, 'utf8')); }
    catch { throw new Error('Local handoff file is corrupt; it was not replaced.'); }
    if (!Array.isArray(notes) || notes.some(n => !n || typeof n.text !== 'string' || typeof n.id !== 'string' || !Number.isFinite(Date.parse(n.expiresAt)) || !Number.isFinite(Date.parse(n.createdAt))))
      throw new Error('Invalid local handoff file; it was not replaced.');
    return notes;
  }

  private async save(notes: Handoff[]): Promise<void> {
    const tmp = this.path + '.tmp';
    const data = JSON.stringify(notes);
    if (Buffer.byteLength(data) > 8 << 20) throw new Error('Local handoff capacity exceeded; wait for expiry or use another Local.');
    await writeFile(tmp, data, { mode: 0o600, flag: 'wx' });
    await rename(tmp, this.path);
  }

  async list(): Promise<Handoff[]> {
    const saved = await this.read();
    const notes = saved.filter(n => Date.parse(n.expiresAt) > this.now());
    if (notes.length !== saved.length) await this.save(notes);
    return notes;
  }

  async post(text: string, ttlHours = 24, from: string | null = null, label: string | null = null): Promise<Handoff> {
    if (!text.trim() || Buffer.byteLength(text) > 65536 || !Number.isFinite(ttlHours) || ttlHours <= 0 || ttlHours > 72)
      throw new Error('Handoff requires 1–65536 bytes and a lifetime over zero and at most 72 hours.');
    const notes = await this.list();
    const now = this.now();
    const note: Handoff = { id: 'h_' + randomUUID(), text, from, label,
      createdAt: new Date(now).toISOString(), expiresAt: new Date(now + ttlHours * 3600000).toISOString() };
    await this.save([...notes, note]);
    return note;
  }

  async get(id?: string): Promise<Handoff | null> {
    const notes = await this.list();
    return (id ? notes.find(n => n.id === id) : notes.at(-1)) ?? null;
  }
}

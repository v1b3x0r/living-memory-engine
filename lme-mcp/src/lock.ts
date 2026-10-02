import { mkdir, writeFile, rm, realpath } from 'node:fs/promises';
import { dirname, basename, join } from 'node:path';

const queues = new Map<string, Promise<unknown>>();

// Lock load/compute/save together: retrieve also writes recall metadata.
export async function withStoreLock<T>(path: string, operation: () => Promise<T>): Promise<T> {
  const key = join(await realpath(dirname(path)), basename(path));
  const previous = queues.get(key) ?? Promise.resolve();
  const task = previous.catch(() => undefined).then(async () => {
    const lock = key + '.lock';
    try { await mkdir(lock, { mode: 0o700 }); }
    catch { throw new Error('Local store is busy or locked. Close the other operation; inspect the lock before explicit recovery. No automatic retry.'); }
    try {
      await writeFile(join(lock, 'owner.json'), JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }), { mode: 0o600, flag: 'wx' });
      return await operation();
    } finally { await rm(lock, { recursive: true }); }
  });
  queues.set(key, task);
  try { return await task; }
  finally { if (queues.get(key) === task) queues.delete(key); }
}

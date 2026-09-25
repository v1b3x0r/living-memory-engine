import { describe, expect, it } from 'vitest';
import { MemoryEngine } from '../src/engine.js';
import { InMemoryStorage, FakeChat, FakeClock, FakeEmbed } from './fakes.js';
import { TimeMachine } from './timeMachine.js';
import { SeededRandom } from '../src/random.js';
import { randomK } from '../src/policy.js';
import type { Snapshot } from '../src/ports.js';
import type { TelemetryEvent } from '../src/ports.js';

class CountingClock extends FakeClock {
  calls = 0;
  override now(): number {
    this.calls++;
    return super.now();
  }
}

class RecordingStorage extends InMemoryStorage {
  readonly order: string[] = [];
  failSave = false;

  override async save(s: Snapshot): Promise<void> {
    this.order.push('save');
    if (this.failSave) throw new Error('storage unavailable');
    await super.save(s);
  }
}

describe('optional telemetry port', () => {
  it('captures stable session events without requiring a provider', async () => {
    const events: TelemetryEvent[] = [];
    const tm = new TimeMachine({
      seed: 1,
      telemetry: { capture: (event) => { events.push(event); } },
    });

    expect(await tm.respond('hello')).toBe('ok');
    expect(events.map(e => e.name)).toEqual(['respond_started', 'memory_retrieved', 'tick_completed', 'respond_completed']);
    expect(new Set(events.map(e => e.sessionId)).size).toBe(1);
    expect(events[0]!.sessionId).toMatch(/^session_/);
    expect(events.every(e => !('text' in e.properties))).toBe(true);
  });

  it('does not consume the shared id counter when telemetry is absent', async () => {
    const makeId = async (): Promise<string> => {
      const storage = new InMemoryStorage();
      const engine = new MemoryEngine({
        storage,
        embed: new FakeEmbed(),
        chat: new FakeChat(),
        clock: new FakeClock(1),
        random: new SeededRandom(6),
        policy: randomK(3, 7),
      });
      await engine.ingestUser('hello');
      return storage.snap.messages[0]!.id;
    };
    const counter = (id: string): number => parseInt(id.slice(id.lastIndexOf('_') + 1), 36);
    const first = await makeId();
    const second = await makeId();
    expect(counter(second) - counter(first)).toBe(2);
  });

  it('does not read the clock for telemetry when telemetry is absent', async () => {
    const clock = new CountingClock(1);
    const engine = new MemoryEngine({
      storage: new InMemoryStorage(),
      embed: new FakeEmbed(),
      chat: new FakeChat(),
      clock,
      random: new SeededRandom(7),
      policy: randomK(3, 7),
    });
    for await (const _ of engine.respond('hello')) { /* consume */ }
    expect(clock.calls).toBe(5);
  });

  it('keeps synchronous and asynchronous telemetry failures off the state path', async () => {
    const syncFailure = new TimeMachine({
      seed: 2,
      telemetry: { capture: () => { throw new Error('telemetry down'); } },
    });
    expect(await syncFailure.respond('sync failure')).toBe('ok');

    const asyncFailure = new TimeMachine({
      seed: 3,
      telemetry: { capture: async () => { throw new Error('telemetry down'); } },
    });
    expect(await asyncFailure.respond('async failure')).toBe('ok');
  });

  it('does not emit tick_completed when persistence fails', async () => {
    const storage = new RecordingStorage();
    const events: TelemetryEvent[] = [];
    const engine = new MemoryEngine({
      storage,
      embed: new FakeEmbed(),
      chat: new FakeChat(),
      clock: new FakeClock(1),
      random: new SeededRandom(4),
      policy: randomK(3, 7),
      telemetry: { capture: (event) => { events.push(event); } },
    });
    await engine.ingestUser('hello');
    await engine.ingestModel('ok');
    storage.failSave = true;

    await expect(engine.tick()).rejects.toThrow('storage unavailable');
    expect(events.some(e => e.name === 'tick_completed')).toBe(false);
  });

  it('emits tick_completed only after a successful save', async () => {
    const storage = new RecordingStorage();
    const events: TelemetryEvent[] = [];
    const engine = new MemoryEngine({
      storage,
      embed: new FakeEmbed(),
      chat: new FakeChat(),
      clock: new FakeClock(1),
      random: new SeededRandom(5),
      policy: randomK(3, 7),
      telemetry: { capture: (event) => { events.push(event); storage.order.push(`telemetry:${event.name}`); } },
    });
    await engine.ingestUser('hello');
    await engine.ingestModel('ok');
    await engine.tick();

    const saveIndex = storage.order.lastIndexOf('save');
    const telemetryIndex = storage.order.lastIndexOf('telemetry:tick_completed');
    expect(saveIndex).toBeGreaterThanOrEqual(0);
    expect(telemetryIndex).toBeGreaterThan(saveIndex);
    expect(events.some(e => e.name === 'tick_completed')).toBe(true);
  });
});

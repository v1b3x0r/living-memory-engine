import assert from 'node:assert/strict';
import { test } from 'node:test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdtemp, readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { makeBrain } from '../dist/brain.js';
import { FileStorage, EMPTY_SNAPSHOT } from '../dist/storage.js';
import { withStoreLock } from '../dist/lock.js';

process.env.LME_CONFIG_ISOLATED = '1';
const fact = content => ({ content, importance: 7, tags: [] });

test('serialized recall/remember, identity and dimensions, private files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lm-runtime-'));
  let entered, release;
  const ready = new Promise(resolve => { entered = resolve; });
  let dimensions = 2;
  const fixture = createServer(async (req, res) => {
    let body = ''; for await (const c of req) body += c;
    const data = JSON.parse(body);
    if (data.input === 'pause') { entered(); await new Promise(resolve => { release = resolve; }); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: [{ embedding: [1, ...Array(dimensions - 1).fill(0)] }] }));
  });
  await new Promise(resolve => fixture.listen(0, '127.0.0.1', resolve));
  try {
    const options = { snapshotPath: `${directory}/brain.json`, mock: false, apiKey: 'local',
      embedModel: 'fixture', baseURL: `http://127.0.0.1:${fixture.address().port}/v1` };
    const a = makeBrain(options), b = makeBrain(options);
    await a.engine.addEpisodic(fact('original'));
    const searching = a.engine.retrieve('pause');
    await ready;
    const adding = b.engine.addEpisodic(fact('new'));
    release(); await Promise.all([searching, adding]);
    const before = await readFile(options.snapshotPath, 'utf8');
    assert.equal(JSON.parse(before).episodic.length, 2);
    assert.equal((await stat(options.snapshotPath)).mode & 0o777, 0o600);
    assert.equal((await stat(`${options.snapshotPath}.bak`)).mode & 0o777, 0o600);
    assert.equal((await stat(directory)).mode & 0o777, 0o700);
    await assert.rejects(makeBrain({ ...options, embedModel: 'other' }).engine.retrieve('q'), /configuration differs/);
    assert.equal(await readFile(options.snapshotPath, 'utf8'), before);
    dimensions = 3;
    await assert.rejects(a.engine.addEpisodic(fact('bad')), /dimensions changed/);
    assert.equal(await readFile(options.snapshotPath, 'utf8'), before);
    dimensions = 2;
    assert.equal((await a.engine.retrieve('q')).episodic.length, 2);
  } finally { fixture.closeAllConnections(); await new Promise(resolve => fixture.close(resolve)); }
});

test('cross-process lock refuses contention and releases after failure', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lm-lock-'));
  const path = `${directory}/brain.json`;
  await withStoreLock(path, async () => {
    const module = new URL('../dist/lock.js', import.meta.url).href;
    const code = `import {withStoreLock} from ${JSON.stringify(module)}; await withStoreLock(${JSON.stringify(path)}, async()=>{});`;
    const child = spawn(process.execPath, ['--input-type=module', '-e', code], { stdio: ['ignore', 'ignore', 'pipe'] });
    let error = ''; child.stderr.on('data', b => { error += b; });
    assert.notEqual(await new Promise(resolve => child.on('exit', resolve)), 0);
    assert.match(error, /busy or locked/);
  });
  await assert.rejects(withStoreLock(path, async () => { throw new Error('operation failed'); }), /operation failed/);
  await withStoreLock(path, async () => {});
});

test('legacy adoption is explicit and preserves the pre-adoption backup', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lm-legacy-'));
  const path = `${directory}/brain.json`;
  const original = { ...structuredClone(EMPTY_SNAPSHOT), episodic: [{ id: 'legacy', content: 'original', embedding: Array(256).fill(1), createdAt: 1, strength: 1, importance: 7 }] };
  await writeFile(path, JSON.stringify(original), { mode: 0o600 });
  process.env.LME_EMBED = 'mock';
  const brain = makeBrain({ snapshotPath: path, mock: true });
  delete process.env.LME_EMBED;
  assert.equal((await new FileStorage(path).load()).episodic.length, 1);
  await assert.rejects(brain.engine.retrieve('q'), /Legacy embedding identity/);
  process.env.LME_ADOPT_LEGACY = '1';
  try { await brain.engine.retrieve('q'); } finally { delete process.env.LME_ADOPT_LEGACY; }
  assert.equal(JSON.parse(await readFile(path, 'utf8')).localEmbedding.mode, 'lexical');
  assert.deepEqual(JSON.parse(await readFile(path + '.bak', 'utf8')), original);
});

test('corruption, stale files and unsafe permissions never become an empty store', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lm-corrupt-'));
  const path = `${directory}/brain.json`;
  await writeFile(path, '{bad', { mode: 0o600 });
  await assert.rejects(new FileStorage(path).load(), /corrupt/);
  assert.equal(await readFile(path, 'utf8'), '{bad');
  const unsafe = `${directory}/unsafe.json`;
  await writeFile(unsafe, JSON.stringify(EMPTY_SNAPSHOT), { mode: 0o644 });
  await assert.rejects(new FileStorage(unsafe).load(), /private regular/);
  const clean = `${directory}/clean.json`;
  await mkdir(clean + '.lock', { mode: 0o700 });
  await assert.rejects(withStoreLock(clean, async () => {}), /busy or locked/);
  const tmp = `${directory}/tmp.json`;
  await writeFile(tmp + '.tmp', 'do not overwrite', { mode: 0o600 });
  await assert.rejects(new FileStorage(tmp).save(EMPTY_SNAPSHOT), /temporary file exists/);
});

test('lexical mode handles Thai and rejects non-finite vectors', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lm-thai-'));
  const brain = makeBrain({ snapshotPath: `${directory}/brain.json`, mock: true });
  await brain.engine.addEpisodic(fact('เชียงใหม่'));
  const snapshot = JSON.parse(await readFile(brain.snapshotPath, 'utf8'));
  assert.ok(snapshot.episodic[0].embedding.some(n => n !== 0));
  assert.equal((await brain.engine.retrieve('เชียงใหม่')).episodic[0].content, 'เชียงใหม่');
  assert.equal((await brain.engine.retrieve('unrelatedterm')).episodic.length, 0);
  assert.throws(() => new FileStorage(brain.snapshotPath).checkVector([NaN]), /invalid vector/);
});

test('handoffs are exact, ephemeral, private and separate from memory', async () => {
  const { Handoffs } = await import('../dist/handoff.js');
  const directory = await mkdtemp(join(tmpdir(), 'lm-handoff-'));
  let now = 1000;
  const notes = new Handoffs(`${directory}/brain.json`, () => now);
  const text = 'next step\nเชียงใหม่\n  preserve spaces';
  const note = await notes.post(text, 1, 'test');
  assert.equal((await notes.get()).text, text);
  assert.equal((await notes.get(note.id)).text, text);
  assert.equal((await stat(`${directory}/brain.json.handoffs.json`)).mode & 0o777, 0o600);
  await assert.rejects(notes.post('invalid', 73), /at most 72/);
  await assert.rejects(notes.post('ก'.repeat(22000)), /65536/);
  now += 3600000;
  assert.equal(await notes.get(note.id), null);
  assert.equal((await notes.list()).length, 0);
  assert.equal(await readFile(`${directory}/brain.json.handoffs.json`, 'utf8'), '[]');
  await assert.rejects(stat(`${directory}/brain.json`), /ENOENT/);
});


test('legacy adoption refuses missing retrieval vectors without changing files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lm-legacy-invalid-'));
  const path = join(directory, 'brain.json');
  const memory = { id: 'legacy', content: 'unembedded', embedding: null };
  process.env.LME_ADOPT_LEGACY = '1';
  try {
    for (const partial of [
      { episodic: [memory] },
      { persons: { alice: { episodic: [memory] } } },
      { prospective: [{ id: 'intent', status: 'pending', clueEmbedding: null }] },
    ]) {
      const original = JSON.stringify({ ...structuredClone(EMPTY_SNAPSHOT), ...partial });
      await writeFile(path, original, { mode: 0o600 });
      const identity = { mode: 'semantic', endpoint: 'https://example.com/v1', model: 'original', dimensions: null };
      await assert.rejects(new FileStorage(path, identity).assertEmbedding(), /invalid embeddings/);
      assert.equal(await readFile(path, 'utf8'), original);
      assert.equal(identity.dimensions, null);
      await assert.rejects(stat(path + '.bak'), /ENOENT/);
    }
  } finally { delete process.env.LME_ADOPT_LEGACY; }
});


test('empty snapshots can change identity; person-only legacy diagnostics fail closed', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lm-info-'));
  const path = join(directory, 'brain.json');
  const empty = { ...structuredClone(EMPTY_SNAPSHOT), localEmbedding: {mode:'semantic',model:'old',endpoint:'https://old.example/v1',dimensions:2560} };
  await writeFile(path, JSON.stringify(empty), {mode:0o600});
  const brain = makeBrain({snapshotPath:path,mock:true});
  await brain.engine.addEpisodic(fact('new lexical memory'));
  assert.equal(JSON.parse(await readFile(path,'utf8')).localEmbedding.model,'unicode-fnv1a-256-v1');
  const legacy = { ...structuredClone(EMPTY_SNAPSHOT), persons:{alice:{episodic:[{id:'person',content:'remember me',embedding:[1,0]}]}} };
  await writeFile(path, JSON.stringify(legacy), {mode:0o600});
  const {Client} = await import('@modelcontextprotocol/sdk/client/index.js');
  const {StdioClientTransport} = await import('@modelcontextprotocol/sdk/client/stdio.js');
  const client = new Client({name:'legacy-info',version:'1'});
  const transport = new StdioClientTransport({command:process.execPath,args:[fileURLToPath(new URL('../dist/server.js',import.meta.url))],env:{LME_CONFIG_ISOLATED:'1',LME_EMBED:'lexical',LME_SNAPSHOT:path}});
  try {
    await client.connect(transport);
    const result = await client.callTool({name:'local_info',arguments:{}});
    assert.equal(result.structuredContent.embedding.legacy,true);
    assert.equal(result.structuredContent.embedding.compatible,false);
    const search = await client.callTool({name:'memory_search',arguments:{query:'remember'}});
    assert.equal(search.isError,true);
  } finally {await client.close();}
});

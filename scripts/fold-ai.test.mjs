import test from 'node:test';
import assert from 'node:assert/strict';
import { createDiscoveryHandler, discoveryKey, generateDiscovery, parseDiscovery } from './fold-ai-lib.mjs';

const recipe = { recipe: 'forge_abc123', name: 'Ash Lantern', kind: 'ember', parents: ['Ember', 'Mist'] };
const env = { FOLD_AI_ENABLED: 'true', CLOUDFLARE_ACCOUNT_ID: 'a'.repeat(32), CLOUDFLARE_API_TOKEN: 'test-token' };
const request = body => new Request('https://vihaar.me/api/fold/discovery', { method: 'POST', headers: { Origin: 'https://vihaar.me' }, body: JSON.stringify(body) });
const image = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), Buffer.alloc(16)]).toString('base64');

test('disabled AI never reads storage or makes a paid request', async () => {
  let calls = 0;
  const handler = createDiscoveryHandler({ env: {}, getStore: () => { calls++; }, fetcher: () => { calls++; } });
  assert.equal((await handler(request(recipe))).status, 503);
  assert.equal(calls, 0);
});

test('recipe validation bounds prompts and rejects markup, unsupported elements and cross-origin requests', async () => {
  assert.equal(parseDiscovery({ ...recipe, name: '<img src=x>' }), null);
  assert.equal(parseDiscovery({ ...recipe, parents: ['a'] }), null);
  assert.equal(parseDiscovery({ ...recipe, kind: 'super_heal' }), null);
  assert.deepEqual(parseDiscovery({ ...recipe, parents: [...recipe.parents].reverse() }), parseDiscovery(recipe));
  const handler = createDiscoveryHandler({ env, getStore: () => { throw new Error('must not access'); } });
  assert.equal((await handler(request({ ...recipe, recipe: '../../private' }))).status, 400);
  assert.equal((await handler(new Request('https://vihaar.me/api/fold/discovery', { method: 'POST', headers: { Origin: 'https://example.com' }, body: JSON.stringify(recipe) }))).status, 403);
});

test('successful discovery stores image and presentation once; cached requests do not call a model', async () => {
  const cache = new Map(); let calls = 0;
  const store = { get: async key => cache.get(key), set: async (key, value) => cache.set(key, value), setJSON: async (key, value) => cache.set(key, value) };
  const handler = createDiscoveryHandler({ env, getStore: () => store, fetcher: async url => {
    calls++;
    return Response.json({ success: true, result: url.includes('granite') ? { response: JSON.stringify({ name: 'Lantern of Ash', description: 'A flame remembers its vanished keeper.', damage: 99999 }) } : { image } });
  } });
  const first = await (await handler(request(recipe))).json();
  assert.equal(first.name, 'Lantern of Ash'); assert.equal(first.damage, undefined);
  assert.equal(first.artUrl, `/api/fold/art/${discoveryKey(recipe)}`);
  assert.equal(calls, 2); assert.equal(cache.size, 2);
  assert.deepEqual(await (await handler(request(recipe))).json(), first);
  assert.equal(calls, 2);
});

test('untrusted semantic output cannot inject markup or change the local recipe; failed naming preserves art', async () => {
  const result = await generateDiscovery(recipe, env, async url => Response.json({ result: url.includes('granite') ? { response: '{"name":"<script>bad</script>","description":"x"}' } : { image } }));
  assert.equal(result.name, recipe.name); assert.equal(result.contentType, 'image/png');
  await assert.rejects(generateDiscovery(recipe, env, async url => Response.json({ result: url.includes('granite') ? { response: 'not JSON' } : { image: Buffer.from('<svg onload=alert(1)>').toString('base64') } })), /Invalid image/);
});

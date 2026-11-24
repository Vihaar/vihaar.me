import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { assertInside, gameBuildEnvironment, renderHub, validateArchiveEntries, validateManifest, withGameBase } from './games-build-lib.mjs';

const commit = 'a'.repeat(40);
const manifest = () => ({ repository: 'Vihaar/game', commit, games: [{ slug: 'the-fold', directory: 'games/card-roguelike', title: 'The Fold', description: 'Cards & spells', controls: 'Keyboard + mouse', status: 'Prototype', preview: 'games/card-roguelike/screenshots/combat.png' }], planned: [{ title: 'Soup', description: 'Keep it in the bowl.', status: 'Building' }] });

test('only immutable source commits and safe, unique publish subdirectories are accepted', () => {
  assert.equal(validateManifest(manifest()).commit, commit);
  for (const change of [{ commit: 'main' }, { commit: 'd07a32a' }, { repository: 'another/repo' }]) assert.throws(() => validateManifest({ ...manifest(), ...change }));
  for (const slug of ['../usha', '/fundraise2026', 'assets', 'UPPER']) {
    const value = manifest(); value.games[0].slug = slug;
    assert.throws(() => validateManifest(value));
  }
  const duplicate = manifest(); duplicate.games.push({ ...duplicate.games[0] });
  assert.throws(() => validateManifest(duplicate));
  const traversal = manifest(); traversal.games[0].directory = 'games/../../portfolio';
  assert.throws(() => validateManifest(traversal));
  const notice = manifest(); notice.games[0].notices = ['../../private.txt'];
  assert.throws(() => validateManifest(notice));
});

test('an archive must identify the pinned source and cannot traverse out of extraction', () => {
  assert.equal(validateArchiveEntries([`game-${commit}/`, `game-${commit}/games/the-fold/index.html`], commit), `game-${commit}`);
  for (const entry of [`game-${'b'.repeat(40)}/index.html`, `game-${commit}/../../secret`, `/game-${commit}/file`, `game-${commit}\\file`, `game-${commit}/./file`]) assert.throws(() => validateArchiveEntries([entry], commit));
  assert.throws(() => validateArchiveEntries([], commit));
});

test('cleanup stays within a non-root workspace subtree', () => {
  const root = path.resolve('work');
  assert.equal(assertInside(root, path.join(root, 'public/games')), path.join(root, 'public/games'));
  assert.throws(() => assertInside(root, root));
  assert.throws(() => assertInside(root, path.join(root, '../other')));
});

test('sub-builds do not inherit portfolio credentials', () => {
  const environment = gameBuildEnvironment({ PATH: '/bin', HOME: '/home/build', STRIPE_SECRET_KEY: 'private', NETLIFY_AUTH_TOKEN: 'private', FRONTEND_ORIGIN: 'private', NODE_ENV: 'development' });
  assert.deepEqual(environment, { PATH: '/bin', HOME: '/home/build', CI: 'true', NODE_ENV: 'production' });
});

test('slashless entry URLs resolve game assets beneath the canonical game directory', () => {
  const html = withGameBase('<html><head><script src="./assets/game.js"></script></head></html>', 'the-fold');
  assert.ok(html.indexOf('<base') < html.indexOf('<script'));
  const base = /<base href="([^"]+)"/.exec(html)[1];
  for (const entry of ['https://vihaar.me/games/the-fold', 'https://vihaar.me/games/the-fold/']) {
    assert.equal(new URL('./assets/game.js', new URL(base, entry)).href, 'https://vihaar.me/games/the-fold/assets/game.js');
  }
  assert.throws(() => withGameBase('<head><base href="/other/"></head>', 'the-fold'));
});

test('only built games get play links, roadmap stays descriptive, and text is escaped', () => {
  const value = manifest(); value.games[0].description = '<script>alert(1)</script>';
  const html = renderHub('{{GAME_CARDS}} {{WORKBENCH}} {{SOURCE_COMMIT}}', value);
  assert.match(html, /href="\/games\/the-fold\/"/);
  assert.doesNotMatch(html, /href="\/games\/soup/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, new RegExp(commit));
  value.planned = [];
  assert.doesNotMatch(renderHub('{{WORKBENCH}}', value), /Not quite ready/);
});

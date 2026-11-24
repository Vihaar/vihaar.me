import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { access, cp, lstat, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { assertInside, gameBuildEnvironment, renderHub, validateArchiveEntries, validateManifest, withGameBase } from './games-build-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = validateManifest(JSON.parse(await readFile(path.join(root, 'games-source.json'), 'utf8')));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--source-dir')) throw new Error('Usage: node scripts/build-games.mjs [--source-dir <clean checkout of pinned commit>]');
const publicGames = assertInside(root, path.join(root, 'artifacts/vihaar-me/public/games'));
const buildEnv = gameBuildEnvironment();
await mkdir(path.join(root, '.cache'), { recursive: true });
const temp = await mkdtemp(path.join(root, '.cache/games-'));
let sourceRoot;
let archiveSha256 = null;

function run(command, commandArgs, cwd, options = {}) {
  let executable = command;
  let argumentsList = commandArgs;
  if (command === 'npm') {
    const npmCli = [
      path.resolve(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'),
      path.resolve(path.dirname(process.execPath), '../lib/node_modules/npm/bin/npm-cli.js'),
      process.env.npm_execpath?.endsWith('npm-cli.js') ? process.env.npm_execpath : '',
    ].find(candidate => candidate && existsSync(candidate));
    if (!npmCli) throw new Error('The Node.js installation must include the npm CLI.');
    executable = process.execPath;
    argumentsList = [npmCli, ...commandArgs];
  }
  const result = spawnSync(executable, argumentsList, {
    cwd, env: buildEnv, encoding: 'utf8',
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    maxBuffer: 10 * 1024 * 1024,
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${commandArgs.join(' ')} failed.${options.capture ? '\n' + result.stderr : ''}`);
  return result.stdout?.trim() ?? '';
}

async function digest(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

async function assertDirectoryWithoutLinks(directory) {
  if ((await lstat(directory)).isSymbolicLink()) throw new Error(`A production game cannot publish a symbolic-link directory: ${directory}`);
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`A production game cannot publish a symbolic link: ${target}`);
    if (entry.isDirectory()) await assertDirectoryWithoutLinks(target);
    else if (!entry.isFile()) throw new Error(`Unexpected production file type: ${target}`);
  }
}

try {
  if (args.length) {
    sourceRoot = path.resolve(args[1]);
    const actualCommit = run('git', ['rev-parse', 'HEAD'], sourceRoot, { capture: true });
    if (actualCommit !== manifest.commit) throw new Error(`Local source is ${actualCommit}; expected pinned ${manifest.commit}.`);
    if (run('git', ['status', '--porcelain', '--untracked-files=all'], sourceRoot, { capture: true })) throw new Error('Local game source must be a clean checkout.');
  } else {
    const url = `https://codeload.github.com/${manifest.repository}/tar.gz/${manifest.commit}`;
    console.log(`Fetching public game source ${manifest.repository}@${manifest.commit}`);
    const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
    if (!response.ok || !response.body) throw new Error(`GitHub source download failed (${response.status}).`);
    const archive = path.join(temp, 'source.tar.gz');
    await pipeline(Readable.fromWeb(response.body), createWriteStream(archive));
    if ((await stat(archive)).size > 150 * 1024 * 1024) throw new Error('Game source archive is unexpectedly large.');
    archiveSha256 = await digest(archive);
    const entries = run('tar', ['-tzf', archive], root, { capture: true }).split(/\r?\n/).filter(Boolean);
    const expectedRoot = validateArchiveEntries(entries, manifest.commit);
    const types = run('tar', ['-tvzf', archive], root, { capture: true }).split(/\r?\n/).filter(Boolean);
    if (types.some(entry => !/^[-d]/.test(entry))) throw new Error('Source archive must not contain symbolic or hard links.');
    const extraction = path.join(temp, 'source');
    await mkdir(extraction);
    run('tar', ['-xzf', archive, '-C', extraction, '--no-same-owner', '--no-same-permissions'], root);
    sourceRoot = path.join(extraction, expectedRoot);
    await access(path.join(sourceRoot, 'package.json'));
  }

  const staged = path.join(temp, 'public-games');
  await mkdir(staged);
  const built = [];
  for (const game of manifest.games) {
    const directory = assertInside(sourceRoot, path.join(sourceRoot, game.directory));
    const pkg = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
    if (!pkg.scripts?.build) throw new Error(`${game.directory} has no production build script.`);
    await access(path.join(directory, 'package-lock.json'));
    console.log(`Building ${game.title} for /games/${game.slug}/`);
    run('npm', ['ci', '--include=dev', '--no-audit', '--no-fund'], directory);
    run('npm', ['run', 'build'], directory);
    const dist = assertInside(directory, path.join(directory, 'dist'));
    await access(path.join(dist, 'index.html'));
    await assertDirectoryWithoutLinks(dist);
    await cp(dist, path.join(staged, game.slug), { recursive: true });
    const entry = path.join(staged, game.slug, 'index.html');
    await writeFile(entry, withGameBase(await readFile(entry, 'utf8'), game.slug));
    const licenses = path.join(staged, game.slug, 'licenses');
    await mkdir(licenses, { recursive: true });
    await cp(path.join(sourceRoot, 'LICENSE'), path.join(licenses, 'REPOSITORY-LICENSE.txt'));
    for (const notice of game.notices ?? []) {
      const noticeFile = path.join(sourceRoot, notice);
      if (!(await lstat(noticeFile)).isFile()) throw new Error(`Notice must be a regular file: ${notice}`);
      await cp(noticeFile, path.join(licenses, path.basename(notice)));
    }
    if (game.preview) {
      const previewFile = path.join(sourceRoot, game.preview);
      if (!(await lstat(previewFile)).isFile()) throw new Error(`Preview must be a regular file: ${game.preview}`);
      await mkdir(path.join(staged, 'previews'), { recursive: true });
      await cp(previewFile, path.join(staged, 'previews', game.slug + path.extname(game.preview)));
    }
    built.push({ slug: game.slug, title: game.title, sourceDirectory: game.directory, url: `/games/${game.slug}/`, documentBase: `/games/${game.slug}/` });
  }

  const template = await readFile(path.join(root, 'games-hub/index.html'), 'utf8');
  await writeFile(path.join(staged, 'index.html'), renderHub(template, manifest));
  await cp(path.join(root, 'games-hub/style.css'), path.join(staged, 'style.css'));
  await cp(path.join(root, 'games-hub/404.html'), path.join(staged, '404.html'));
  await writeFile(path.join(staged, 'provenance.json'), JSON.stringify({
    repository: manifest.repository, sourceCommit: manifest.commit,
    sourceUrl: `https://github.com/${manifest.repository}/tree/${manifest.commit}`,
    archiveSha256, sourceVerification: args.length ? 'clean local checkout matches pinned commit' : 'pinned GitHub archive URL and archive root match commit',
    builtAt: new Date().toISOString(), games: built,
  }, null, 2) + '\n');

  // This exact, generated subtree is the only existing website content replaced.
  assertInside(root, publicGames);
  try { if ((await lstat(publicGames)).isSymbolicLink()) throw new Error('Refusing to replace a symlink at public/games.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await rm(publicGames, { recursive: true, force: true });
  await mkdir(path.dirname(publicGames), { recursive: true });
  await cp(staged, publicGames, { recursive: true });
  console.log(`Prepared ${built.length} game(s), the /games/ hub, and pinned source provenance.`);
} finally {
  assertInside(root, temp);
  await rm(temp, { recursive: true, force: true });
}

import path from 'node:path';

export function validateManifest(manifest) {
  if (manifest.repository !== 'Vihaar/game') throw new Error('Games must come from the public Vihaar/game repository.');
  if (!/^[a-f0-9]{40}$/.test(manifest.commit ?? '')) throw new Error('games-source.json must pin a complete 40-character Git commit SHA.');
  if (!Array.isArray(manifest.games) || !manifest.games.length) throw new Error('At least one playable game must be configured.');
  const slugs = new Set();
  for (const game of manifest.games) {
    if (!/^[a-z][a-z0-9-]*$/.test(game.slug ?? '') || ['assets', 'previews'].includes(game.slug)) throw new Error(`Invalid game slug: ${game.slug}`);
    if (slugs.has(game.slug)) throw new Error(`Duplicate game slug: ${game.slug}`);
    slugs.add(game.slug);
    if (!/^games\/[a-z0-9-]+$/.test(game.directory ?? '')) throw new Error(`Invalid source directory for ${game.slug}.`);
    if (game.preview && (!game.preview.startsWith(game.directory + '/') || game.preview.includes('..') || game.preview.includes('\\') || !/\.(png|webp|jpe?g|svg)$/.test(game.preview))) throw new Error(`Invalid preview for ${game.slug}.`);
    if (game.notices && (!Array.isArray(game.notices) || game.notices.some(notice => typeof notice !== 'string' || !notice.startsWith(game.directory + '/') || notice.includes('..') || notice.includes('\\')))) throw new Error(`Invalid license/notice paths for ${game.slug}.`);
    for (const field of ['title', 'description', 'controls', 'status']) if (typeof game[field] !== 'string' || !game[field].trim()) throw new Error(`Missing ${field} for ${game.slug}.`);
  }
  for (const game of manifest.planned ?? []) for (const field of ['title', 'description', 'status']) if (typeof game[field] !== 'string') throw new Error(`Missing roadmap ${field}.`);
  return manifest;
}

export function validateArchiveEntries(entries, commit) {
  const expectedRoot = `game-${commit}`;
  if (!entries.length) throw new Error('The source archive is empty.');
  for (const entry of entries) {
    const parts = entry.replace(/\/$/, '').split('/');
    if (parts[0] !== expectedRoot || parts.some(part => part === '..' || part === '.' || !part) || entry.includes('\\') || entry.includes('\0')) throw new Error(`Unsafe or unexpected source archive entry: ${entry}`);
  }
  return expectedRoot;
}

export function assertInside(root, target) {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) throw new Error('Refusing to mutate a path outside the intended workspace subdirectory.');
  return path.resolve(target);
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export function withGameBase(html, slug) {
  if (!/^[a-z][a-z0-9-]*$/.test(slug)) throw new Error('Invalid hosted game base.');
  if (/<base\b/i.test(html)) throw new Error('Game entry HTML already defines a base; review it before hosting.');
  if (!/<head(?:\s[^>]*)?>/i.test(html)) throw new Error('Game entry HTML must have a head element.');
  return html.replace(/<head(?:\s[^>]*)?>/i, head => `${head}\n  <base href="/games/${slug}/">`);
}

export function renderHub(template, manifest) {
  const cards = manifest.games.map(game => `<article class="game-card">
    <a class="game-picture ${escapeHtml(game.slug)}" href="/games/${escapeHtml(game.slug)}/" tabindex="-1" aria-hidden="true">${game.preview ? `<img src="/games/previews/${escapeHtml(game.slug)}${path.extname(game.preview)}" alt="" loading="lazy">` : '<span class="doodle" aria-hidden="true">PLAY</span>'}</a>
    <div class="game-copy"><p class="game-status">${escapeHtml(game.status)}</p><h2><a href="/games/${escapeHtml(game.slug)}/">${escapeHtml(game.title)}</a></h2><p>${escapeHtml(game.description)}</p><div class="game-bottom"><span>${escapeHtml(game.controls)}</span><a class="play-link" href="/games/${escapeHtml(game.slug)}/">Play ${escapeHtml(game.title)}</a></div></div>
  </article>`).join('\n');
  const planned = (manifest.planned ?? []).map(game => `<li><div><h3>${escapeHtml(game.title)}</h3><p>${escapeHtml(game.description)}</p></div><span>${escapeHtml(game.status)}</span></li>`).join('\n');
  const workbench = planned ? `<section class="workbench" aria-labelledby="workbench-title"><div><p class="scribble">on the workbench</p><h2 id="workbench-title">Not quite ready yet.</h2></div><ul>${planned}</ul></section>` : '';
  return template.replace('{{GAME_CARDS}}', cards).replace('{{WORKBENCH}}', workbench).replaceAll('{{SOURCE_COMMIT}}', manifest.commit);
}

// Sub-builds need ordinary toolchain paths, not portfolio deployment credentials.
export function gameBuildEnvironment(environment = process.env) {
  const allowed = new Set(['PATH', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'TEMP', 'TMP', 'HOME', 'USERPROFILE', 'APPDATA', 'LOCALAPPDATA', 'LANG', 'LC_ALL', 'HTTPS_PROXY', 'HTTP_PROXY', 'NO_PROXY', 'NODE_EXTRA_CA_CERTS', 'SSL_CERT_FILE']);
  const result = Object.fromEntries(Object.entries(environment).filter(([key]) => allowed.has(key.toUpperCase())));
  result.CI = 'true';
  result.NODE_ENV = 'production';
  return result;
}

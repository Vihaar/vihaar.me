# Games at vihaar.me/games

The portfolio stays in its existing Vite app. Each game is an independent static build from the public [Vihaar/game](https://github.com/Vihaar/game) repository, embedded beneath `/games/`. The Usha build, portfolio routes, and Stripe function retain their existing configuration.

## Source pin and build

`games-source.json` pins a full Git commit SHA and lists the playable games to build. Branch names and abbreviated SHAs are rejected. Each entry supplies its source directory, URL slug, player-facing description, controls, optional source preview, and any additional license/notice files to publish. Unfinished games live in `planned`; they get no play links.

During the existing Netlify build, `node scripts/build-games.mjs`:

1. Downloads the public GitHub archive for the pinned commit, without an access token.
2. Checks that every archive path is inside the expected `game-<commit>` root, rejects traversal and links, and records the downloaded archive's SHA-256.
3. Runs `npm ci --include=dev` and `npm run build` in each selected game. The subprocess environment excludes portfolio deployment credentials.
4. Requires a `dist/index.html`, then stages each output and its included license files at `/games/<slug>/`. The repository license and configured additional notices are retained under each game's `licenses/`. The hosted copy of the entry HTML gets a canonical `<base href="/games/<slug>/">` before asset tags. Relative game builds therefore work from both slashless and trailing-slash shared links.
5. Generates the hub and `provenance.json`, then replaces only the generated `artifacts/vihaar-me/public/games/` subtree after all builds succeed.
6. Lets the unchanged portfolio Vite build copy those public files to its existing Netlify publish directory.

The fetched archive's immutable GitHub URL and root directory identify the requested commit. `provenance.json` records that commit, download digest, build time, and deployed game paths. The digest is an audit record of the download, not a claim of a separately signed release.

Generated builds are ignored by Git. Game code and contributions remain in `Vihaar/game`; this repository holds the source pin and hosting integration.

## Updating a game

Finish and publish the source commit in `Vihaar/game`, update the complete SHA in `games-source.json`, adjust the enabled/unfinished game lists, and test the resulting build. Add a matching exact entry-path mapping to `netlify.toml` for a new slug. Review the website change before updating production.

For a clean local checkout of the exact pinned game commit, a download-free build is available:

```sh
node scripts/build-games.mjs --source-dir /absolute/path/to/game
```

It verifies `git rev-parse HEAD` and requires a clean worktree. Normal Netlify builds always fetch the pinned public archive.

## Checks

```sh
node --test scripts/games-build.test.mjs
node scripts/build-games.mjs
pnpm --filter @workspace/vihaar-me run build
```

Check `/games/`, each game entry path, its JS/CSS URLs, and `/games/does-not-exist.js` in a Netlify deploy preview before production. Also check `/`, `/fundraise2026`, `/usha/`, and the Stripe route mapping. A browser at a narrow width can check hub layout; individual games list their actual input support.

## Routing

Physical `games/<slug>/index.html` directories provide directory entry pages. Netlify normalizes trailing slashes before redirect matching, so forced slash-only redirects are avoided. Exact non-forced 200 mappings cover direct entry paths. The hosted HTML base makes relative assets work even when a request stays slashless; no global Pretty URLs setting is changed. A non-forced `/games/*` custom-404 rule precedes the portfolio's `/* /index.html 200` catchall.

Existing static JS/CSS/image files shadow the games fallback; missing game files receive a 404 page instead of portfolio HTML. This follows Netlify's [custom 404 handling](https://docs.netlify.com/manage/routing/redirects/redirect-options/#custom-404-page-handling) and [redirect rule order](https://docs.netlify.com/manage/routing/redirects/overview/#rule-processing-order).

No DNS, domain assignment, payment settings, or existing application routes need to change.

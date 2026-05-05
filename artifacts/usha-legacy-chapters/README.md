# Usha's Legacy Chapters

This project is imported into the `vihaar.me` monorepo and can be deployed as
its own Netlify site at `usha.vihaar.me`.

## Local development

```bash
cd artifacts/usha-legacy-chapters
npm install
npm run dev
```

## Deploy to `usha.vihaar.me` (Netlify)

1. In Netlify, create a new site from this GitHub repo (`vihaar.me`).
2. Set **Base directory** to `artifacts/usha-legacy-chapters`.
3. Build settings (already defined in this folder's `netlify.toml`):
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
4. Add custom domain: `usha.vihaar.me`.
5. In your DNS provider, create a `CNAME` record:
   - Name: `usha`
   - Value: your Netlify site target (shown in Netlify domain setup)
6. Wait for SSL provisioning in Netlify, then verify:
   - `https://usha.vihaar.me`
   - a deep route like `https://usha.vihaar.me/some-page`

# Optional Fold discovery art

The game ships original static AI illustrations and deterministic recursive forging. Runtime AI is optional presentation enrichment: IBM Granite names the fusion, FLUX.1 Schnell paints it, Netlify Blobs caches both. It never supplies damage, healing, costs or any combat rule. Battles continue during requests, and failures retain the starter artwork.

No external image-provider credentials were present when this was implemented. The integration is therefore **disabled in production**, and no paid inference requests were made. Mocked provider tests cover validation, response boundaries, cache reuse and the disabled path; live provider inference still requires an account.

Configure these variables with Functions scope in the Netlify project, then redeploy:

- `CLOUDFLARE_ACCOUNT_ID`: the 32-character account identifier.
- `CLOUDFLARE_API_TOKEN`: a token restricted to Workers AI for that account. Never put this in a Vite variable or the browser.
- `FOLD_AI_ENABLED=true`: explicit operator switch after checking the provider budget and quota.

The server routes are POST `/api/fold/discovery` and GET `/api/fold/art/:key`. Recipe requests have bounded names and exactly two ingredients. A site-wide limit allows 120 discovery requests/hour; cached images use immutable CDN caching. This limit reduces request bursts, **not a lifetime dollar cap**. Use Cloudflare's free allocation or a provider-side spending limit; do not enable an uncapped paid account if a strict total budget is required. Cached content lives in separate production/preview stores. No secrets or prompts are logged by this implementation.

## Models and cost research, 2026-11-24

- [Cloudflare's official price table](https://developers.cloudflare.com/workers-ai/platform/pricing/) lists FLUX.1 Schnell at $0.0000528 per 512×512 tile plus $0.0001056 per step. Four steps and four tiles would be about $0.000634/image, excluding hosting/storage. Actual output dimensions and billed usage should be checked in the provider dashboard. The free Workers AI allocation is 10,000 neurons/day.
- [Granite 4.0 H Micro](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) lists $0.017/M input and $0.112/M output tokens. Its short naming request is cheaper than image inference.
- [fal's official pricing](https://fal.ai/pricing) lists FLUX.1 Schnell at $0.003/megapixel, rounded up per image. It was considered; Cloudflare was cheaper among these verified hosted options. This is not a claim to have surveyed every provider.
- [Cloudflare image API](https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/) and [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) supply the existing generation/storage infrastructure.

Infinite Craft is a design reference, not a copied service. No requests are sent to Neal.fun and its private API is not used. The game keeps canonical pair recipes and a local discovery catalog so an unavailable model cannot block crafting. Starter art provenance and the complete generation prompt are in the game repository's `games/card-roguelike/public/art/README.md`.

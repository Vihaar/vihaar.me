# Stripe donations on Netlify (vihaar.me)

The **Donate** button calls `POST /api/stripe/create-donation-session`. Locally, Vite proxies that to the Express `api-server`. On Netlify, the same path is handled by a **serverless function** (`netlify/functions/create-donation-session.mjs`).

## Required Netlify environment variables

In **Netlify → Site configuration → Environment variables** (Production + Preview if needed):

| Variable | Example | Purpose |
|----------|---------|---------|
| `STRIPE_SECRET_KEY` | `sk_live_…` or `sk_test_…` | Creates Checkout Sessions (must match the Stripe account you use) |
| `FRONTEND_ORIGIN` | `https://vihaar.me` | Success/cancel URLs after checkout (no trailing slash) |

After adding or changing variables, trigger a **new deploy**.

## Stripe Dashboard

- **Developers → API keys**: use the same mode (test vs live) as `STRIPE_SECRET_KEY`.
- **Developers → Webhooks** (optional): add endpoints if you process post-payment events elsewhere.

## Optional: separate API instead of Netlify Functions

If you host `artifacts/api-server` elsewhere (Railway, Render, etc.), set in the **build** env for the frontend:

- `VITE_API_BASE=https://your-api.example.com` (no trailing slash)

Then the browser will call that origin instead of `/api/...` on Netlify.

## Optional: Payment Link fallback

If you only use a fixed Stripe Payment Link, set `VITE_STRIPE_DONATION_URL` in the frontend env and use the “open the Stripe payment page” link in the donate section (the main **Donate!** button still needs the API or function above for custom amounts).

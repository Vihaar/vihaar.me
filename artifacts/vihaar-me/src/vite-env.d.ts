/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_DONATION_URL?: string;
  /** Stripe publishable key (pk_live_… or pk_test_…) — safe in frontend, keep in .env.local */
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  /** Empty string = same origin (use Vite proxy in dev: /api → api-server) */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

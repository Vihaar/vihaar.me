import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
/** `artifacts/api-server` — directory that should contain `.env` */
const packageRoot = path.join(dir, "..");

function loadEnvFile(filePath: string, override: boolean) {
  if (fs.existsSync(filePath)) {
    config({ path: filePath, override });
  }
}

// 1) api-server/.env then .env.local (local overrides)
loadEnvFile(path.join(packageRoot, ".env"), false);
loadEnvFile(path.join(packageRoot, ".env.local"), true);

// 2) If Stripe key still missing, try common cwd layouts (pnpm from repo root, nested dirs)
function stripeKeyPresent(): boolean {
  const v = process.env.STRIPE_SECRET_KEY;
  return typeof v === "string" && v.replace(/^\uFEFF/, "").trim().startsWith("sk_");
}

if (!stripeKeyPresent()) {
  const cwd = process.cwd();
  const fallbacks = [
    path.join(cwd, "artifacts", "api-server", ".env"),
    path.join(cwd, "vihaar.me", "artifacts", "api-server", ".env"),
    path.join(cwd, ".env"),
  ];
  for (const p of fallbacks) {
    loadEnvFile(p, true);
    if (stripeKeyPresent()) break;
  }
}

import { Router, type IRouter } from "express";
import Stripe from "stripe";

const router: IRouter = Router();

const CAMPAIGN_RETURN_PATH = "/fundraise2026";

/** Stripe Dashboard / Netlify env: strip BOM, whitespace, and accidental wrapping quotes. */
function stripeSecretKey(): string {
  const raw = process.env.STRIPE_SECRET_KEY;
  if (typeof raw !== "string") return "";
  let s = raw.replace(/^\uFEFF/, "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/** Stripe line item copy — keep short; long/unicode strings have caused API rejections in the wild. */
function checkoutLineDescription(amountCents: number): string {
  const dollars = amountCents / 100;
  const meals = Math.floor(dollars * 10);
  const poundsFood = Math.floor(dollars);
  const miles = dollars / 1000; // $1,000 = 1 mile run by Vihaar
  const milesStr =
    miles < 1
      ? miles.toFixed(2)
      : miles === Math.floor(miles)
        ? String(Math.floor(miles))
        : miles.toFixed(2);
  const mileLabel = miles === 1 ? "mile" : "miles";
  return (
    `Child hunger fundraiser 2026. $${dollars.toFixed(2)} = ${meals} meals in our campaign count, ` +
    `${poundsFood} lb food tally, ${milesStr} ${mileLabel} run by Vihaar (this gift). Food bank + partner orgs.`
  );
}

const envFrontendOriginKey = ["FRONTEND", "ORIGIN"].join("_");
const localFrontendOrigin = ["http://localhost", "5173"].join(":");

function frontendOrigin(): string {
  let raw = (process.env[envFrontendOriginKey] ?? localFrontendOrigin).trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`.replace(/\/$/, "");
  }
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new Error("bad protocol");
    }
    return `${u.protocol}//${u.host}`;
  } catch {
    return localFrontendOrigin;
  }
}

/** Treat Stripe API errors as 400 so the client shows the real message (not generic HTTP 500). */
function stripeClientPayload(e: unknown): { message: string; code?: string; type?: string } | null {
  if (e instanceof Stripe.errors.StripeError) {
    return { message: e.message, code: e.code, type: e.type };
  }
  if (typeof e === "object" && e !== null) {
    const o = e as Record<string, unknown>;
    const raw = o.raw as Record<string, unknown> | undefined;
    if (raw && typeof raw.message === "string") {
      return {
        message: raw.message,
        code: typeof raw.code === "string" ? raw.code : undefined,
        type: typeof raw.type === "string" ? raw.type : undefined,
      };
    }
    if (typeof o.message === "string" && (typeof o.code === "string" || typeof o.type === "string")) {
      return {
        message: o.message,
        code: typeof o.code === "string" ? o.code : undefined,
        type: typeof o.type === "string" ? o.type : undefined,
      };
    }
  }
  return null;
}

/**
 * Creates a Stripe Checkout Session for a one-time USD donation.
 * Requires STRIPE_SECRET_KEY in api-server/.env (loaded automatically) and the public site origin env var for return URLs (see docs/stripe-netlify.md).
 */
router.post("/create-donation-session", async (req, res) => {
  try {
    const secret = stripeSecretKey();
    if (!secret.startsWith("sk_")) {
      return res.status(503).json({
        error:
          "Stripe secret key missing. Put STRIPE_SECRET_KEY=sk_test_... or sk_live_... in artifacts/api-server/.env (same folder as this server), save the file, and restart the API. If you use a monorepo, run the server from artifacts/api-server or rely on load-env fallbacks.",
      });
    }

    const body = req.body as { amountCents?: number; amountUsd?: number };
    const amountCents =
      typeof body.amountCents === "number" && Number.isFinite(body.amountCents)
        ? Math.round(body.amountCents)
        : typeof body.amountUsd === "number" && Number.isFinite(body.amountUsd)
          ? Math.round(body.amountUsd * 100)
          : NaN;

    if (!Number.isFinite(amountCents) || amountCents < 100 || amountCents > 999_999_99) {
      return res.status(400).json({
        error: "Enter a valid amount between $1.00 and $999,999.99.",
      });
    }
    if (amountCents % 100 !== 0) {
      return res.status(400).json({
        error:
          "Use a whole-dollar amount only ($1, $5, $100 — no cents). $1 converts to 10 meals donated on this campaign.",
      });
    }

    const origin = frontendOrigin();

    const stripe = new Stripe(secret, { typescript: true });

    const lineDescription = checkoutLineDescription(amountCents);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "hosted",
      success_url: `${origin}${CAMPAIGN_RETURN_PATH}?donated=1&amount=${amountCents}`,
      cancel_url: `${origin}${CAMPAIGN_RETURN_PATH}`,
      client_reference_id: `child-hunger-${amountCents}`,
      metadata: {
        campaign: "child-hunger-2026",
        amount_cents: String(amountCents),
      },
      payment_intent_data: {
        description: lineDescription.slice(0, 500),
        metadata: {
          campaign: "child-hunger-2026",
          amount_cents: String(amountCents),
        },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: "Donation — Child hunger campaign 2026",
              description: lineDescription.slice(0, 400),
            },
          },
        },
      ],
    });

    if (!session.url) {
      return res.status(500).json({
        error: "Stripe did not return a checkout URL. Check your Stripe Dashboard for account restrictions.",
      });
    }

    return res.json({ url: session.url });
  } catch (e: unknown) {
    console.error("[stripe] create-donation-session", e);
    const stripePayload = stripeClientPayload(e);
    if (stripePayload) {
      return res.status(400).json({
        error: stripePayload.message,
        stripe_code: stripePayload.code,
        stripe_type: stripePayload.type,
      });
    }
    const msg = e instanceof Error ? e.message : "Something went wrong starting checkout.";
    return res.status(500).json({ error: msg });
  }
});

export default router;

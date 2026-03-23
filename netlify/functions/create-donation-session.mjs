/**
 * Netlify Function — same contract as api-server POST /api/stripe/create-donation-session
 * Env (set in Netlify UI): STRIPE_SECRET_KEY, FRONTEND_ORIGIN (e.g. https://vihaar.me)
 */
import Stripe from "stripe";

const CAMPAIGN_RETURN_PATH = "/fundraise2026";

function stripeSecretKey() {
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

function checkoutLineDescription(amountCents) {
  const dollars = amountCents / 100;
  const meals = Math.floor(dollars * 10);
  const poundsFood = Math.floor(dollars);
  const miles = dollars / 1000;
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

function frontendOrigin() {
  let raw = (process.env.FRONTEND_ORIGIN ?? "https://vihaar.me").trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`.replace(/\/$/, "");
  }
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("bad protocol");
    return `${u.protocol}//${u.host}`;
  } catch {
    return "https://vihaar.me";
  }
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (request) => {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const secret = stripeSecretKey();
  if (!secret.startsWith("sk_")) {
    return json(503, {
      error:
        "Stripe is not configured on the server. In Netlify: Site settings → Environment variables → add STRIPE_SECRET_KEY (sk_live_… or sk_test_…) and FRONTEND_ORIGIN (https://vihaar.me), then redeploy.",
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const amountCents =
    typeof body.amountCents === "number" && Number.isFinite(body.amountCents)
      ? Math.round(body.amountCents)
      : typeof body.amountUsd === "number" && Number.isFinite(body.amountUsd)
        ? Math.round(body.amountUsd * 100)
        : NaN;

  if (!Number.isFinite(amountCents) || amountCents < 100 || amountCents > 999_999_99) {
    return json(400, { error: "Enter a valid amount between $1.00 and $999,999.99." });
  }
  if (amountCents % 100 !== 0) {
    return json(400, {
      error:
        "Use a whole-dollar amount only ($1, $5, $100 — no cents). $1 converts to 10 meals donated on this campaign.",
    });
  }

  const origin = frontendOrigin();
  const lineDescription = checkoutLineDescription(amountCents);

  try {
    const stripe = new Stripe(secret, { typescript: false });
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
      return json(500, {
        error: "Stripe did not return a checkout URL. Check your Stripe Dashboard for account restrictions.",
      });
    }

    return json(200, { url: session.url });
  } catch (e) {
    console.error("[netlify create-donation-session]", e);
    if (e && typeof e === "object" && "type" in e && String(e.type).startsWith("Stripe")) {
      const err = /** @type {{ message?: string; code?: string; type?: string }} */ (e);
      return json(400, {
        error: err.message ?? "Stripe error",
        stripe_code: err.code,
        stripe_type: err.type,
      });
    }
    const msg = e instanceof Error ? e.message : "Something went wrong starting checkout.";
    return json(500, { error: msg });
  }
};

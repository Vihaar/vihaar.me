import { useState } from "react";
import { motion } from "framer-motion";

const PRESETS = [5, 10, 20, 50, 100] as const; // Team Trees style: 50, 100, 200, 500, 1000 meals

export function FundraiseDonate() {
  const paymentLink = (import.meta.env.VITE_STRIPE_DONATION_URL as string | undefined)?.trim();
  const apiBase = ((import.meta.env.VITE_API_BASE as string | undefined) ?? "").replace(/\/$/, "");
  const stripePublishableKey = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)?.trim();

  const [usd, setUsd] = useState(5);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const parsedUsd = Math.round(Number(usd));
  const wholeUsd =
    !Number.isFinite(parsedUsd) || parsedUsd < 1 ? 5 : Math.min(999_999, parsedUsd);
  const previewMeals = wholeUsd * 10;
  const previewPoundsFood = wholeUsd;
  const previewMiles = wholeUsd / 1000; // $1,000 = 1 mile run by Vihaar

  async function startCheckout() {
    setErr(null);
    const dollars = Math.round(Number(usd));
    const amountCents = dollars * 100;
    if (!Number.isFinite(dollars) || dollars < 1 || amountCents < 100) {
      setErr("Enter a whole-dollar amount of at least $1. Default on this page is $5.");
      return;
    }
    if (amountCents > 999_999_99) {
      setErr("That amount is too large for this form — thank you! Email us instead.");
      return;
    }

    setLoading(true);
    try {
      const url = `${apiBase}/api/stripe/create-donation-session`;
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents }),
      });
      const raw = await r.text();
      let data: {
        url?: string;
        error?: string;
        stripe_code?: string;
        stripe_type?: string;
      } = {};
      if (raw) {
        try {
          data = JSON.parse(raw) as typeof data;
        } catch {
          throw new Error(
            `Bad response from server (${r.status}). Is the API running? First bit: ${raw.slice(0, 160)}`,
          );
        }
      }
      if (!r.ok) {
        const errText = data.error ?? "";
        const stripeNotReady =
          r.status === 503 &&
          (errText.includes("not configured") || errText.includes("secret key missing"));
        if (stripeNotReady && paymentLink) {
          window.location.assign(paymentLink);
          return;
        }
        const extra =
          data.stripe_code != null
            ? ` (Stripe: ${data.stripe_code}${data.stripe_type ? ` / ${data.stripe_type}` : ""})`
            : "";
        throw new Error((data.error || `HTTP ${r.status}`) + extra);
      }
      if (!data.url) {
        throw new Error("No checkout URL returned.");
      }
      window.location.assign(data.url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      if (
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        msg.includes("Load failed")
      ) {
        setErr(
          "Can't reach the donation API. In dev, run the API on port 8787: `pnpm --filter @workspace/api-server dev` (Vite proxies /api there).",
        );
      } else {
        setErr(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 rounded-2xl border-2 border-dashed border-[#166534]/50 bg-[#faf6f0] p-6 md:p-8 text-stone-900 shadow-[0_4px_20px_rgba(22,101,52,0.1)] pantry-card-texture"
    >
      <h2 className="font-display text-3xl text-[#14532d] mb-2">Donate now</h2>
      <p className="font-body text-stone-700 mb-4">
        Secure checkout with Stripe. This campaign counts{" "}
        <span className="font-semibold text-[#9a3412]">$1 converts to 10 meals donated</span> — no cents, just
        clean numbers like 50 meals, 500 meals, etc. Pick an amount (or use your payment link if you set
        one).
      </p>
      <p className="font-body text-sm text-stone-600 mb-6 border border-dashed border-[#ca8a04]/45 rounded-xl px-4 py-3 bg-[#fffbeb]/90">
        At <span className="font-display font-semibold text-[#7c2d12]">${wholeUsd}</span> your gift maps to
        about{" "}
        <span className="font-display text-[#9a3412]">{previewMeals.toLocaleString()} meals</span>,{" "}
        <span className="font-display text-[#14532d]">{previewPoundsFood.toLocaleString()} lb</span> on the
        food tally, and{" "}
        <span className="font-display text-[#9a3412]">
          {previewMiles < 1
            ? previewMiles.toFixed(2)
            : previewMiles === Math.floor(previewMiles)
              ? String(Math.floor(previewMiles))
              : previewMiles.toFixed(2)}{" "}
          mile{previewMiles === 1 ? "" : "s"} run by Vihaar
        </span>{" "}
        (from this amount). The same breakdown is summarized
        on the Stripe checkout page for donors.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setUsd(n)}
            className={`font-display text-lg px-4 py-2 rounded-xl border-2 transition-colors ${
              wholeUsd === n
                ? "border-[#166534] bg-[#dcfce7] text-[#14532d]"
                : "border-stone-400 bg-white hover:bg-[#fff7ed]"
            }`}
          >
            ${n}
          </button>
        ))}
      </div>

      <label className="block font-display text-stone-800 mb-2">Amount</label>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end mb-4">
        <div className="flex-1">
          <span className="sr-only">Whole dollars</span>
          <input
            type="number"
            min={1}
            step={1}
            value={usd < 1 ? "" : usd}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") {
                setUsd(0);
                return;
              }
              const n = Number(v);
              if (!Number.isFinite(n)) return;
              setUsd(Math.round(n));
            }}
            onBlur={() => {
              if (!Number.isFinite(usd) || usd < 1) setUsd(5);
            }}
            className="w-full font-display text-2xl px-4 py-3 rounded-xl border-2 border-stone-400 bg-white text-stone-900"
          />
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={startCheckout}
          className="font-display text-2xl px-8 py-3 rounded-xl border-2 border-stone-800 bg-[#635bff] text-white hover:bg-[#5851e6] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? "Opening…" : "Donate!"}
        </button>
      </div>

      {paymentLink ? (
        <p className="font-body text-sm text-stone-600 mb-2">
          Or{" "}
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9a3412] font-semibold underline decoration-dotted"
          >
            open the Stripe payment page
          </a>{" "}
          (e.g. pay-what-you-want link from your dashboard).
        </p>
      ) : null}

      {err ? (
        <p className="font-body text-sm text-red-800 bg-red-100 border border-red-300 rounded-xl px-4 py-3 mb-2">
          {err}
          {err.includes("not configured") ? (
            <span className="block mt-2 text-stone-700">
              Run the API with <code className="bg-white px-1 rounded">STRIPE_SECRET_KEY</code> and start
              Vite so <code className="bg-white px-1 rounded">/api</code> proxies to the server (see{" "}
              <code className="bg-white px-1 rounded">.env.example</code>).
            </span>
          ) : null}
        </p>
      ) : null}

      <p className="font-body text-sm text-stone-600 mt-4 border border-stone-300 rounded-xl px-4 py-3 bg-amber-50/80">
        The fundraiser wrapped up on March 15, 2026. Donations submitted after that date may not be processed.
        Thank you for helping us reach our goal.
      </p>

      <p className="font-body text-xs text-stone-500 mt-3">
        Payments are processed by Stripe. You’ll get a receipt from them. This site never sees your card
        number.
        {stripePublishableKey
          ? stripePublishableKey.startsWith("pk_live")
            ? " Live mode."
            : " Test mode."
          : null}
      </p>
    </motion.section>
  );
}

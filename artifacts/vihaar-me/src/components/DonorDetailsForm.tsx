import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DonorDetailsPayload {
  displayName: string;
  email: string;
  mobilePhone?: string;
  team?: string;
  message?: string;
  optInUpdates: boolean;
  anonymous: boolean;
  isGift: boolean;
  giftRecipient?: string;
  giftSender?: string;
  giftMessage?: string;
}

const inputBase =
  "bg-stone-100 appearance-none mt-1 border border-stone-400 rounded-lg px-3 py-2.5 w-full text-stone-900 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/30 focus:outline-none transition";

export function DonorDetailsForm({
  onSuccess,
  onDismiss,
  amountCents,
}: {
  onSuccess?: () => void;
  onDismiss?: () => void;
  amountCents?: number;
}) {
  const apiBase = ((import.meta.env.VITE_API_BASE as string | undefined) ?? "").replace(/\/$/, "");

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [team, setTeam] = useState("");
  const [message, setMessage] = useState("");
  const [optInUpdates, setOptInUpdates] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState("");
  const [giftSender, setGiftSender] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const nameErr = !displayName.trim() ? "Please enter a display name" : null;
  const emailErr = !email.trim()
    ? "Please enter an email"
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? null
      : "Please enter a valid email";
  const giftRecipientErr =
    isGift && !giftRecipient.trim() ? "Please enter the gift recipient's name" : null;
  const giftSenderErr = isGift && !giftSender.trim() ? "Please enter who this gift is from" : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const firstErr = nameErr || emailErr || giftRecipientErr || giftSenderErr;
    if (firstErr) {
      setErr(firstErr);
      return;
    }

    setErr(null);
    setLoading(true);
    try {
      const payload: DonorDetailsPayload = {
        displayName: displayName.trim(),
        email: email.trim(),
        optInUpdates,
        anonymous,
        isGift,
      };
      if (mobilePhone.trim()) payload.mobilePhone = mobilePhone.trim();
      if (team.trim()) payload.team = team.trim();
      if (message.trim()) payload.message = message.trim();
      if (isGift) {
        payload.giftRecipient = giftRecipient.trim();
        payload.giftSender = giftSender.trim();
        if (giftMessage.trim()) payload.giftMessage = giftMessage.trim();
      }

      const r = await fetch(`${apiBase}/api/donor-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, amountCents }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || `HTTP ${r.status}`);
      }
      setSubmitted(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border-2 border-dashed border-[#166534]/60 bg-[#f0fdf4]/95 p-8 text-center"
      >
        <h3 className="font-display text-2xl text-[#14532d] mb-2">Thank you!</h3>
        <p className="font-body text-stone-700">
          Your details have been saved. We're so grateful you're part of this.
        </p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="mt-4 font-display text-[#166534] underline hover:no-underline"
          >
            Close
          </button>
        )}
      </motion.div>
    );
  }

  const amountStr = amountCents != null ? `$${(amountCents / 100).toLocaleString()}` : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border-2 border-dashed border-amber-600/60 bg-white shadow-lg w-full max-w-md mx-auto p-6 md:p-8"
    >
      <h3 className="font-display text-2xl text-[#7c2d12] text-center font-bold mb-1">Details</h3>
      {amountStr && (
        <p className="font-body text-center text-stone-600 text-sm mb-6">
          Thank you for your {amountStr} donation — one more step:
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block text-stone-800">
          <span className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-1">
            Display Name
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            maxLength={50}
            required
            className={inputBase}
          />
          {nameErr && (
            <span className="text-sm text-red-600 mt-1 block">{nameErr}</span>
          )}
        </label>

        <label className="block text-stone-800">
          <span className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-1">
            Email address
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            maxLength={80}
            required
            className={inputBase}
          />
          {emailErr && (
            <span className="text-sm text-red-600 mt-1 block">{emailErr}</span>
          )}
        </label>

        <label className="block text-stone-800">
          <span className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-1">
            Mobile Phone
          </span>
          <input
            type="tel"
            value={mobilePhone}
            onChange={(e) => setMobilePhone(e.target.value)}
            placeholder="Mobile Phone"
            maxLength={20}
            className={inputBase}
          />
          <small className="text-stone-500 text-sm mt-1 block">
            Optional; by entering a phone number, you consent to receive text messages
          </small>
        </label>

        <label className="block text-stone-800">
          <span className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-1">
            Team
          </span>
          <input
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Team name"
            maxLength={50}
            className={inputBase}
          />
          <small className="text-stone-500 text-sm mt-1 block">Optional</small>
        </label>

        <label className="block text-stone-800">
          <span className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-1">
            Message
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="My child hunger campaign message is…"
            rows={2}
            maxLength={140}
            className={`${inputBase} resize-none`}
          />
          <small className="text-stone-500 text-sm mt-1 block">
            Optional; for display on the website
          </small>
        </label>

        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={optInUpdates}
              onChange={(e) => setOptInUpdates(e.target.checked)}
              className="mt-1 rounded border-stone-400"
            />
            <span className="font-body text-stone-700">
              <span className="font-bold text-[#166534]">YES!</span> I want periodic updates on this
              campaign
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="mt-1 rounded border-stone-400"
            />
            <span className="font-body text-stone-700">Please keep my donation anonymous</span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
              className="mt-1 rounded border-stone-400"
            />
            <span className="font-body text-stone-700">
              My donation is a gift for someone
            </span>
          </label>
          {isGift && (
            <p className="font-body text-sm text-stone-600 ml-6">
              We’ll send a certificate to your email address, which you can forward along or print.
            </p>
          )}
        </div>

        <AnimatePresence>
          {isGift && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2 border-t border-stone-200"
            >
              <label className="block text-stone-800">
                <span className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-1">
                  To
                </span>
                <input
                  type="text"
                  value={giftRecipient}
                  onChange={(e) => setGiftRecipient(e.target.value)}
                  placeholder="Enter recipient name or nickname…"
                  maxLength={50}
                  required={isGift}
                  className={inputBase}
                />
                {giftRecipientErr && (
                  <span className="text-sm text-red-600 mt-1 block">{giftRecipientErr}</span>
                )}
              </label>
              <label className="block text-stone-800">
                <span className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-1">
                  From
                </span>
                <input
                  type="text"
                  value={giftSender}
                  onChange={(e) => setGiftSender(e.target.value)}
                  placeholder="Sender name or nickname…"
                  maxLength={50}
                  required={isGift}
                  className={inputBase}
                />
                {giftSenderErr && (
                  <span className="text-sm text-red-600 mt-1 block">{giftSenderErr}</span>
                )}
              </label>
              <label className="block text-stone-800">
                <span className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-1">
                  Include a gift message
                </span>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="My child hunger campaign message is…"
                  rows={2}
                  maxLength={140}
                  className={`${inputBase} resize-none`}
                />
                <small className="text-stone-500 text-sm mt-1 block">
                  Optional; to be included on your certificate
                </small>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {err && (
          <p className="font-body text-sm text-red-800 bg-red-100 border border-red-300 rounded-lg px-3 py-2">
            {err}
          </p>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-[#166534] text-white font-display font-bold rounded-full hover:bg-[#14532d] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Saving…" : "Submit"}
          </button>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="w-full px-6 py-2 text-stone-600 text-center text-sm font-body hover:text-stone-800"
            >
              Skip for now
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}

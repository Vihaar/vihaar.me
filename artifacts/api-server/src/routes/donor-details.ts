import { Router, type IRouter } from "express";

const router: IRouter = Router();

/** Accept donor details after Stripe checkout — returns 200; add file/DB storage as needed. */
router.post("/", async (req, res) => {
  try {
    const body = req.body as {
      displayName?: string;
      email?: string;
      mobilePhone?: string;
      team?: string;
      message?: string;
      optInUpdates?: boolean;
      anonymous?: boolean;
      isGift?: boolean;
      giftRecipient?: string;
      giftSender?: string;
      giftMessage?: string;
      amountCents?: number;
    };

    if (!body.displayName || !body.email) {
      return res.status(400).json({ error: "Display name and email are required." });
    }

    // TODO: persist to DB, file, or external service (e.g. Airtable, spreadsheet)
    // For now we just validate and return success
    console.log("[donor-details] Received:", {
      displayName: body.displayName,
      email: body.email,
      amountCents: body.amountCents,
      anonymous: body.anonymous,
      isGift: body.isGift,
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error("[donor-details]", e);
    return res.status(500).json({ error: "Failed to save donor details." });
  }
});

export default router;

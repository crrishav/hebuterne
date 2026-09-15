import { createHash } from "node:crypto";
import Stripe from "stripe";

const COUPON = { id: "HEBREF20", amount_off: 2000, currency: "gbp", duration: "once", name: "£20 off (referral)" };

function codeFor(sessionId) {
  return "HEB-" + createHash("sha256").update(sessionId).digest("hex").slice(0, 6).toUpperCase();
}

function siteOrigin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

async function ensureCoupon(stripe) {
  try {
    await stripe.coupons.create(COUPON);
  } catch (err) {
    if (err.code !== "resource_already_exists") throw err;
  }
}

async function ensurePromotionCode(stripe, session) {
  const code = codeFor(session.id);
  const found = await stripe.promotionCodes.list({ code, limit: 1 });
  if (found.data[0]) return found.data[0].code;
  await ensureCoupon(stripe);
  const promo = await stripe.promotionCodes.create({
    coupon: COUPON.id,
    code,
    max_redemptions: 1,
    restrictions: { first_time_transaction: true },
    metadata: { brand: "hebuterne", source: "referral", referring_session: session.id }
  });
  return promo.code;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }
  const sessionId = req.body && req.body.session_id;
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_") || sessionId.length > 200) {
    return res.status(400).json({ error: "bad session" });
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ error: "referrals not configured" });

  const stripe = new Stripe(key);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return res.status(400).json({ error: "not paid" });
    const code = await ensurePromotionCode(stripe, session);
    return res.status(200).json({ code, link: `${siteOrigin(req)}/?ref=${code}` });
  } catch (err) {
    console.error("stripe", err.type, err.code, err.statusCode);
    return res.status(502).json({ error: "referral failed" });
  }
}

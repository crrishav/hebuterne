import Stripe from "stripe";

const ALLOWED_COUNTRIES = ["GB", "IE", "FR", "DE", "NL", "BE", "ES", "IT", "US"];

const CATALOGUE = {
  "pink-slip": { name: "Pink Slip, silk slip dress", unit_amount: 17500 }
};
const SIZES = ["6", "8", "10", "12", "14"];
const COLOURS = { "pink-slip": ["pink", "white"] };
const CODE_RE = /^[A-Z0-9-]{1,20}$/;

function describe(size, colour) {
  return colour ? `${colour}, UK ${size}` : `UK ${size}`;
}

function siteOrigin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

function parse(body) {
  const items = body && body.items;
  if (!Array.isArray(items) || !items.length || items.length > 20) return { error: "bad items" };
  const lines = [];
  for (const raw of items) {
    const item = CATALOGUE[raw && raw.id];
    if (!item) return { error: "unknown item" };
    const qty = Number(raw.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 5) return { error: "bad qty" };
    const size = String(raw.size);
    if (!SIZES.includes(size)) return { error: "bad size" };
    const options = COLOURS[raw.id];
    const colour = options && options.includes(raw.colour) ? raw.colour : (options ? options[0] : undefined);
    lines.push({ id: raw.id, item, qty, size, colour });
  }
  let code;
  if (body.code != null && body.code !== "") {
    code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    if (!CODE_RE.test(code)) return { error: "bad code" };
  }
  return { lines, code };
}

async function discount(stripe, code) {
  if (!code) return null;
  const found = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
  const promo = found.data[0];
  if (!promo || !promo.metadata || promo.metadata.brand !== "hebuterne") return null;
  return { discounts: [{ promotion_code: promo.id }], customer: promo.customer };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }
  const parsed = parse(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ error: "checkout not configured" });

  const { lines, code } = parsed;
  const site = siteOrigin(req);
  const stripe = new Stripe(key);
  try {
    const promo = await discount(stripe, code);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "gbp",
      line_items: lines.map(l => ({
        quantity: l.qty,
        price_data: {
          currency: "gbp",
          unit_amount: l.item.unit_amount,
          product_data: { name: l.item.name, description: describe(l.size, l.colour) }
        }
      })),
      shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
      ...(promo
        ? { discounts: promo.discounts, customer: promo.customer, customer_update: { shipping: "auto", address: "auto" } }
        : { allow_promotion_codes: true }),
      success_url: `${site}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/?checkout=cancel`,
      metadata: {
        brand: "hebuterne",
        items: lines.map(l => l.id + (l.colour ? ":" + l.colour : "") + (l.size ? ":" + l.size : "") + "x" + l.qty).join(",")
      }
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("stripe", err.type, err.code, err.statusCode);
    return res.status(502).json({ error: "checkout failed" });
  }
}

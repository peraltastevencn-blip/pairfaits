
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const b = req.body || {};
  const clean = (v, n = 60) => String(v || "").replace(/[<>]/g, "").slice(0, n);
  const frutas = Array.isArray(b.frutas) ? b.frutas.slice(0, 2).map(f => clean(f, 20)).join(" y ") : "";
  if (!b.name || !b.yogur || !b.cereal || !frutas) return res.status(400).json({ ok: false });
  const text =
    `🍓 ¡Nuevo pedido de parfait!\n\n` +
    `👤 Cliente: ${clean(b.name)}\n` +
    `🥛 Yogurt: ${clean(b.yogur)}\n` +
    `🥣 Cereal: ${clean(b.cereal)}\n` +
    `🍓 Fruta: ${frutas}`;
  const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text })
  });
  return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
}

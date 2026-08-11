// Netlify Function: crea una única sesión de Stripe Checkout que puede
// incluir uno o varios ebooks en el mismo pago.
// Se llama desde index.html vía fetch('/api/create-checkout-session', ...).

const Stripe = require("stripe");
const { BOOKS } = require("./_config");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Método no permitido." }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Falta configurar la variable de entorno STRIPE_SECRET_KEY en Netlify.",
      }),
    };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  let filenames;
  try {
    ({ filenames } = JSON.parse(event.body || "{}"));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Cuerpo de la petición inválido." }) };
  }

  if (!Array.isArray(filenames) || filenames.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "No se ha indicado ningún ebook." }) };
  }

  const line_items = [];
  for (const filename of filenames) {
    const book = BOOKS[filename];
    if (!book || !book.priceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `El ebook "${filename}" todavía no tiene un Price ID de Stripe configurado en netlify/functions/_config.js.`,
        }),
      };
    }
    line_items.push({ price: book.priceId, quantity: 1 });
  }

  const origin = event.headers.origin || `https://${event.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/index.html`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

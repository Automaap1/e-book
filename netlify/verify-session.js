// Netlify Function: comprueba contra Stripe (no contra el navegador) que
// una sesión de pago se completó de verdad, y devuelve solo los ebooks
// que esa sesión pagó. La llama success.html al cargar.

const Stripe = require("stripe");
const { BOOKS } = require("./_config");

exports.handler = async (event) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Falta configurar la variable de entorno STRIPE_SECRET_KEY en Netlify.",
      }),
    };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sessionId = event.queryStringParameters && event.queryStringParameters.session_id;

  if (!sessionId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Falta session_id." }) };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status !== "paid") {
      return { statusCode: 200, body: JSON.stringify({ paid: false }) };
    }

    const purchasedPriceIds = session.line_items.data.map((li) => li.price.id);
    const items = Object.entries(BOOKS)
      .filter(([, book]) => purchasedPriceIds.includes(book.priceId))
      .map(([filename, book]) => ({ filename, title: book.title }));

    return { statusCode: 200, body: JSON.stringify({ paid: true, items }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};


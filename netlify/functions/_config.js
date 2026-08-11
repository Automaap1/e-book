// ============================================================
// Este archivo se ejecuta SOLO en el servidor (Netlify Functions).
// Nunca se envía al navegador, así que es el sitio correcto para
// guardar el mapeo de tus productos.
//
// Lo único que NUNCA debe ir aquí ni en ningún otro archivo del
// proyecto es tu clave secreta de Stripe (la que empieza por
// "sk_..."). Esa se configura como variable de entorno
// STRIPE_SECRET_KEY en el panel de Netlify (Site settings →
// Environment variables), nunca en el código.
//
// Rellena "priceId" con el ID de precio de cada producto en Stripe
// (Dashboard → Producto → sección Pricing → el texto que empieza
// por "price_..."). NO uses el Payment Link aquí, sino el Price ID.
// ============================================================

const BOOKS = {
  "fundamentos-desarrollo-web.pdf": {
    title: "Fundamentos de Desarrollo Web",
    priceId: "price_1U33ioRmU98DMYUrwTx0Qiiq",
  },
  "sql-desde-cero.pdf": {
    title: "SQL desde Cero",
    priceId: "price_1U344TRmU98DMYUrZHlHe93y",
  },
  "java-poo.pdf": {
    title: "Java y Programación Orientada a Objetos",
    priceId: "price_1U344tRmU98DMYUrasnu8iKt",
  },
  "productividad-programadores.pdf": {
    title: "Productividad para Programadores",
    priceId: "price_1U345ERmU98DMYUrlzgg3Vd1",
  },
  "entrevistas-tecnicas.pdf": {
    title: "Guía de Entrevistas Técnicas",
    priceId: "price_1U345kRmU98DMYUrCOwWrCxC",
  },
};

module.exports = { BOOKS };

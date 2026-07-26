// api/login.js — POST { password } -> setea la cookie de sesión si la clave es correcta.
const { crearCookie } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { password } = req.body || {};
  if (!password || password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Clave incorrecta' });
  }

  res.setHeader('Set-Cookie', crearCookie());
  res.status(200).json({ ok: true });
};

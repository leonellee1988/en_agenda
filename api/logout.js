// api/logout.js — borra la cookie de sesión.
const { cookieDeCierre } = require('./_auth');

module.exports = async function handler(req, res) {
  res.setHeader('Set-Cookie', cookieDeCierre());
  res.status(200).json({ ok: true });
};

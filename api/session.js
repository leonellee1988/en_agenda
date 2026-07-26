// api/session.js — la usa el frontend al cargar para saber si ya hay sesión activa.
const { verificarSesion } = require('./_auth');

module.exports = async function handler(req, res) {
  if (!verificarSesion(req)) {
    return res.status(401).json({ ok: false });
  }
  res.status(200).json({ ok: true });
};

// api/_auth.js
// Helper de sesión compartido por login.js, logout.js, session.js y
// por cualquier otro endpoint (ej. tareas.js) que se quiera proteger.
//
// Variables de entorno necesarias (Vercel → Project Settings → Environment Variables):
//   APP_PASSWORD    -> la clave de acceso del equipo (elige una)
//   SESSION_SECRET  -> cualquier cadena larga y aleatoria (para firmar la cookie)

const crypto = require('crypto');

const COOKIE_NAME = 'enegt_session';
const DURACION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function firmar(expiraEn) {
  return crypto
    .createHmac('sha256', process.env.SESSION_SECRET)
    .update(String(expiraEn))
    .digest('hex');
}

function crearCookie() {
  const expiraEn = Date.now() + DURACION_MS;
  const firma = firmar(expiraEn);
  const valor = `${expiraEn}.${firma}`;
  const maxAgeSeg = Math.floor(DURACION_MS / 1000);
  return `${COOKIE_NAME}=${valor}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeg}`;
}

function cookieDeCierre() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function leerCookie(req, nombre) {
  const encabezado = req.headers.cookie || '';
  const partes = encabezado.split(';').map((p) => p.trim());
  for (const parte of partes) {
    if (parte.startsWith(nombre + '=')) {
      return parte.slice(nombre.length + 1);
    }
  }
  return null;
}

function verificarSesion(req) {
  const valor = leerCookie(req, COOKIE_NAME);
  if (!valor) return false;

  const [expiraEnStr, firma] = valor.split('.');
  if (!expiraEnStr || !firma) return false;

  const expiraEn = Number(expiraEnStr);
  if (!Number.isFinite(expiraEn) || expiraEn < Date.now()) return false;

  const firmaEsperada = firmar(expiraEn);
  const a = Buffer.from(firma);
  const b = Buffer.from(firmaEsperada);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = { crearCookie, cookieDeCierre, verificarSesion };

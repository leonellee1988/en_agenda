const { neon } = require('@neondatabase/serverless');
const { verificarSesion } = require('./_auth');
const sql = neon(process.env.DATABASE_URL);
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verificarSesion(req)) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM tareas ORDER BY id ASC`;
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { tarea, area, responsables, prioridad, fecha_inicio, fecha_entrega, fecha_finalizacion, estado, notas } = req.body;
      if (!tarea || !area || !responsables || !prioridad) {
        return res.status(400).json({ error: 'tarea, area, responsables y prioridad son obligatorios' });
      }
      const rows = await sql`
        INSERT INTO tareas (tarea, area, responsables, prioridad, fecha_inicio, fecha_entrega, fecha_finalizacion, estado, notas)
        VALUES (${tarea}, ${area}, ${responsables}, ${prioridad}, ${fecha_inicio || null}, ${fecha_entrega || null}, ${fecha_finalizacion || null}, ${estado || 'Pendiente'}, ${notas || null})
        RETURNING *`;
      return res.status(201).json(rows[0]);
    }
    if (req.method === 'PATCH') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Falta el id' });
      const { tarea, area, responsables, prioridad, fecha_inicio, fecha_entrega, fecha_finalizacion, estado, notas } = req.body;
      const rows = await sql`
        UPDATE tareas SET
          tarea = COALESCE(${tarea}, tarea),
          area = COALESCE(${area}, area),
          responsables = COALESCE(${responsables}, responsables),
          prioridad = COALESCE(${prioridad}, prioridad),
          fecha_inicio = COALESCE(${fecha_inicio}, fecha_inicio),
          fecha_entrega = COALESCE(${fecha_entrega}, fecha_entrega),
          fecha_finalizacion = COALESCE(${fecha_finalizacion}, fecha_finalizacion),
          estado = COALESCE(${estado}, estado),
          notas = COALESCE(${notas}, notas),
          actualizado_en = now()
        WHERE id = ${id}
        RETURNING *`;
      if (rows.length === 0) return res.status(404).json({ error: 'No se encontró esa tarea' });
      return res.status(200).json(rows[0]);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Falta el id' });
      await sql`DELETE FROM tareas WHERE id = ${id}`;
      return res.status(204).end();
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error de servidor', detail: String(err.message || err) });
  }
};

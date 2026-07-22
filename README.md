# E+N — Agenda de Trabajo (conectada a Neon)

Proyecto independiente, sin relación con enegt.com. Es una app de 2 piezas:
- `index.html` — la interfaz (lo que ven y usan)
- `api/tareas.js` — el intermediario que habla con Neon de forma segura

## Paso 1: Actualizar la tabla en Neon

Corran esto en el SQL Editor de Neon antes de desplegar, agrega la columna que faltaba:

```sql
ALTER TABLE "tareas" ADD COLUMN "fecha_finalizacion" date;
```

## Paso 2: Subir estos archivos a un repositorio de GitHub nuevo

Igual que hicieron con la landing page: `github.com` → **New repository** (por ejemplo `en-agenda`) → **uploading an existing file** → arrastren `index.html`, `package.json`, y la carpeta `api` completa (con `tareas.js` adentro) → **Commit changes**.

## Paso 3: Desplegar en Vercel

1. Entren a `vercel.com` y **regístrense con su cuenta de GitHub** (así conecta directo, sin contraseñas nuevas)
2. **Add New → Project**
3. Elijan el repositorio `en-agenda` que acaban de subir
4. Antes de darle "Deploy", busquen **Environment Variables** y agreguen:
   - **Name:** `DATABASE_URL`
   - **Value:** el connection string completo de su base de Neon (lo encuentran en el dashboard de Neon, botón "Connect")
5. Denle **Deploy**

En un par de minutos les da una URL propia, algo como `en-agenda.vercel.app`, totalmente separada de `enegt.com`.

## Notas

- No hace falta tocar nada de esto de nuevo salvo que quieran agregar funciones nuevas.
- El `DATABASE_URL` vive únicamente en la configuración de Vercel, nunca en el código, así que aunque el repositorio de GitHub sea público, la contraseña de su base de datos no queda expuesta.
- Si algún día quieren un dominio propio para esta app (no obligatorio), se agrega desde el mismo panel de Vercel, sin tocar el código.

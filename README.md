# Baby Wishlist 🌿

Página simple y **gratuita** para crear la lista de regalos de un baby
shower. El anfitrión/a inicia sesión con Google, carga los datos del
evento y comparte un link público donde los invitados pueden confirmar
asistencia y marcar (de forma anónima) qué regalo van a llevar, o
agregar algo que no está en la lista.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase**: autenticación con Google y base de datos Postgres
- Hosting sugerido: **Vercel** (plan gratuito)

Todo entra en los planes gratuitos de Supabase y Vercel.

## 1. Crear el proyecto en Supabase

> ¿Ya tenés un proyecto de Supabase usado para otra cosa? No hay
> problema, podés reutilizarlo: todas las tablas de esta app usan el
> prefijo `baby_` (`baby_events`, `baby_gifts`, `baby_claims`,
> `baby_rsvps`) para no chocar con tablas de otro proyecto tuyo. Solo
> tené en cuenta el límite de 2 proyectos gratis por organización en el
> plan free de Supabase.

1. Andá a [supabase.com](https://supabase.com) y creá una cuenta gratis
   (o entrá a un proyecto que ya tengas).
2. Creá un nuevo proyecto (elegí una región cercana, ej. South America).
3. Andá a **SQL Editor** y pegá todo el contenido de
   [`supabase/schema.sql`](supabase/schema.sql). Ejecutalo.
4. Andá a **Authentication → Providers → Google** y activalo.
   - Necesitás un **Client ID** y **Client Secret** de Google. Para
     obtenerlos: [Google Cloud Console](https://console.cloud.google.com/) →
     crear proyecto → **APIs & Services → Credentials** → **Create
     Credentials → OAuth Client ID** → tipo "Web application".
   - En **Authorized redirect URIs** agregá la URL que te muestra Supabase
     en esa misma pantalla (termina en `/auth/v1/callback`).
   - Pegá el Client ID y Secret en Supabase y guardá.
5. Andá a **Project Settings → API** y copiá:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (¡mantenela secreta!)

## 2. Configurar el proyecto localmente

```bash
npm install
cp .env.example .env.local
# completá .env.local con los valores del paso anterior
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## 3. Deploy gratis en Vercel

1. Subí este proyecto a un repositorio de GitHub.
2. Andá a [vercel.com](https://vercel.com), importá el repo.
3. Cargá las mismas 3 variables de entorno del `.env.local` en la
   configuración del proyecto en Vercel.
4. Deploy. Listo, tenés tu página gratis online.
5. En Supabase, agregá la URL final de Vercel a **Authentication → URL
   Configuration → Redirect URLs** (ej. `https://tu-sitio.vercel.app/auth/callback`).

## Cómo funciona

- Cada persona que inicia sesión con Google tiene **un evento propio**
  (los datos del bebé/a + una lista de regalos).
- Al crear el evento se genera un **link público único** (`/e/<slug>`)
  para compartir con los invitados. No hace falta cuenta para entrar ahí.
- Los invitados marcan un checkbox para indicar que van a llevar un
  regalo. **No se guarda quién lo marcó**: es completamente anónimo,
  solo sirve para que no se repitan regalos.
- Los invitados también pueden agregar un regalo que no esté en la
  lista.
- Los invitados pueden confirmar asistencia (RSVP) con su nombre y
  cuántas personas van. Esto **no es anónimo**: el anfitrión/a ve la
  lista de invitados confirmados en `/dashboard/invitados`.
- El anfitrión/a puede editar la lista, restaurar la lista base, y
  editar los datos del evento desde `/dashboard`.

## Seguridad

- Las tablas de Supabase tienen Row Level Security: cada usuario
  autenticado solo puede leer/escribir su propio evento.
- El acceso público (invitados sin cuenta) no se hace a través del
  cliente con la anon key + RLS abierta, sino mediante **Server
  Actions** que corren en el servidor con la `service role key` y
  validan explícitamente que el regalo pertenece al evento del link
  que se está visitando. Esto evita que alguien pueda listar o filtrar
  datos de otros usuarios.

## Ideas para más adelante

- Envío de tarjetas/invitaciones por WhatsApp.
- Álbum de fotos compartido (por ejemplo, embebiendo una carpeta de
  Google Drive).

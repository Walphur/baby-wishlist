-- Esquema de la base de datos para Baby Wishlist
-- Ejecutar este script completo en el SQL Editor de tu proyecto de Supabase.
--
-- Las tablas usan el prefijo "baby_" a propósito: así podés correr este
-- script en un proyecto de Supabase que ya uses para otra cosa (por ejemplo
-- uno que ya tenga sus propias tablas "events"/"profiles") sin pisar nada.

create extension if not exists "pgcrypto";

-- ============ BABY_EVENTS ============
-- Un evento por usuario (host). Contiene los datos del bebé/a y la fiesta.
create table if not exists public.baby_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  baby_name text,
  event_date date,
  location text,
  host_names text,
  photo_url text,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists baby_events_user_id_key on public.baby_events(user_id);

-- ============ BABY_GIFTS ============
create table if not exists public.baby_gifts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.baby_events(id) on delete cascade,
  name text not null,
  category text,
  notes text,
  is_custom boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists baby_gifts_event_id_idx on public.baby_gifts(event_id);

-- ============ BABY_CLAIMS ============
-- Una fila = un regalo "tildado" como que alguien lo va a llevar.
-- A propósito NO se guarda quién lo reservó: es 100% anónimo.
create table if not exists public.baby_claims (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.baby_gifts(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists baby_claims_gift_id_key on public.baby_claims(gift_id);

-- ============ BABY_RSVPS ============
-- Confirmaciones de asistencia. A diferencia de los "claims", acá SÍ se
-- guarda el nombre: el host quiere tener una lista de quién va a ir.
create table if not exists public.baby_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.baby_events(id) on delete cascade,
  guest_name text not null,
  attending boolean not null default true,
  party_size integer not null default 1,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists baby_rsvps_event_guest_key on public.baby_rsvps(event_id, guest_name);

-- ============ ROW LEVEL SECURITY ============
-- Solo el dueño (host autenticado) puede leer/escribir sus propias filas.
-- El acceso público (invitados sin cuenta) NO pasa por estas policies:
-- se maneja del lado del servidor con la service role key, en rutas
-- controladas que solo exponen exactamente lo necesario (ver src/lib/supabase/admin.ts).
alter table public.baby_events enable row level security;
alter table public.baby_gifts enable row level security;
alter table public.baby_claims enable row level security;
alter table public.baby_rsvps enable row level security;

create policy "baby_events_owner_select" on public.baby_events
  for select using (auth.uid() = user_id);
create policy "baby_events_owner_insert" on public.baby_events
  for insert with check (auth.uid() = user_id);
create policy "baby_events_owner_update" on public.baby_events
  for update using (auth.uid() = user_id);
create policy "baby_events_owner_delete" on public.baby_events
  for delete using (auth.uid() = user_id);

create policy "baby_gifts_owner_select" on public.baby_gifts
  for select using (
    exists (select 1 from public.baby_events e where e.id = baby_gifts.event_id and e.user_id = auth.uid())
  );
create policy "baby_gifts_owner_insert" on public.baby_gifts
  for insert with check (
    exists (select 1 from public.baby_events e where e.id = baby_gifts.event_id and e.user_id = auth.uid())
  );
create policy "baby_gifts_owner_update" on public.baby_gifts
  for update using (
    exists (select 1 from public.baby_events e where e.id = baby_gifts.event_id and e.user_id = auth.uid())
  );
create policy "baby_gifts_owner_delete" on public.baby_gifts
  for delete using (
    exists (select 1 from public.baby_events e where e.id = baby_gifts.event_id and e.user_id = auth.uid())
  );

create policy "baby_claims_owner_select" on public.baby_claims
  for select using (
    exists (
      select 1 from public.baby_gifts g
      join public.baby_events e on e.id = g.event_id
      where g.id = baby_claims.gift_id and e.user_id = auth.uid()
    )
  );

create policy "baby_rsvps_owner_select" on public.baby_rsvps
  for select using (
    exists (select 1 from public.baby_events e where e.id = baby_rsvps.event_id and e.user_id = auth.uid())
  );
create policy "baby_rsvps_owner_delete" on public.baby_rsvps
  for delete using (
    exists (select 1 from public.baby_events e where e.id = baby_rsvps.event_id and e.user_id = auth.uid())
  );

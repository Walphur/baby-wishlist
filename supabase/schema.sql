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
  event_time time,
  location text,
  host_names text,
  photo_url text,
  message text,
  ask_party_size boolean not null default true,
  location_map_url text,
  drive_url text,
  invitation_image_url text,
  invitation_template_id text,
  guest_list_reveal_days integer not null default 14,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists baby_events_user_id_key on public.baby_events(user_id);

-- Migración: agrega las columnas nuevas si la tabla ya existía de antes.
alter table public.baby_events add column if not exists ask_party_size boolean not null default true;
alter table public.baby_events add column if not exists location_map_url text;
alter table public.baby_events add column if not exists drive_url text;
alter table public.baby_events add column if not exists invitation_image_url text;
alter table public.baby_events add column if not exists invitation_template_id text;
alter table public.baby_events add column if not exists event_time time;
alter table public.baby_events add column if not exists guest_list_reveal_days integer not null default 14;

-- ============ BABY_GIFTS ============
create table if not exists public.baby_gifts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.baby_events(id) on delete cascade,
  name text not null,
  category text,
  notes text,
  is_custom boolean not null default false,
  max_quantity integer,
  created_at timestamptz not null default now()
);

create index if not exists baby_gifts_event_id_idx on public.baby_gifts(event_id);

-- Migración: agrega la columna de cantidad máxima (regalos "repetibles" como pañales/ropa).
alter table public.baby_gifts add column if not exists max_quantity integer;

-- ============ BABY_CLAIMS ============
-- Una fila = una persona que avisó que va a llevar ese regalo.
-- Los regalos con max_quantity permiten varias filas (varias personas);
-- los regalos sin max_quantity solo permiten una (se controla desde el código).
-- A propósito NO se guarda quién lo reservó: es 100% anónimo.
create table if not exists public.baby_claims (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.baby_gifts(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists baby_claims_gift_id_idx on public.baby_claims(gift_id);

-- Migración: si venís de la versión anterior, esto permite varias reservas por regalo.
drop index if exists public.baby_claims_gift_id_key;

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

-- Nota: "create policy" no soporta IF NOT EXISTS, por eso primero se
-- borra (si existe) y se vuelve a crear. Esto hace que el script completo
-- se pueda re-ejecutar sin errores cuando se agregan columnas nuevas.
drop policy if exists "baby_events_owner_select" on public.baby_events;
create policy "baby_events_owner_select" on public.baby_events
  for select using (auth.uid() = user_id);
drop policy if exists "baby_events_owner_insert" on public.baby_events;
create policy "baby_events_owner_insert" on public.baby_events
  for insert with check (auth.uid() = user_id);
drop policy if exists "baby_events_owner_update" on public.baby_events;
create policy "baby_events_owner_update" on public.baby_events
  for update using (auth.uid() = user_id);
drop policy if exists "baby_events_owner_delete" on public.baby_events;
create policy "baby_events_owner_delete" on public.baby_events
  for delete using (auth.uid() = user_id);

drop policy if exists "baby_gifts_owner_select" on public.baby_gifts;
create policy "baby_gifts_owner_select" on public.baby_gifts
  for select using (
    exists (select 1 from public.baby_events e where e.id = baby_gifts.event_id and e.user_id = auth.uid())
  );
drop policy if exists "baby_gifts_owner_insert" on public.baby_gifts;
create policy "baby_gifts_owner_insert" on public.baby_gifts
  for insert with check (
    exists (select 1 from public.baby_events e where e.id = baby_gifts.event_id and e.user_id = auth.uid())
  );
drop policy if exists "baby_gifts_owner_update" on public.baby_gifts;
create policy "baby_gifts_owner_update" on public.baby_gifts
  for update using (
    exists (select 1 from public.baby_events e where e.id = baby_gifts.event_id and e.user_id = auth.uid())
  );
drop policy if exists "baby_gifts_owner_delete" on public.baby_gifts;
create policy "baby_gifts_owner_delete" on public.baby_gifts
  for delete using (
    exists (select 1 from public.baby_events e where e.id = baby_gifts.event_id and e.user_id = auth.uid())
  );

drop policy if exists "baby_claims_owner_select" on public.baby_claims;
create policy "baby_claims_owner_select" on public.baby_claims
  for select using (
    exists (
      select 1 from public.baby_gifts g
      join public.baby_events e on e.id = g.event_id
      where g.id = baby_claims.gift_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "baby_rsvps_owner_select" on public.baby_rsvps;
create policy "baby_rsvps_owner_select" on public.baby_rsvps
  for select using (
    exists (select 1 from public.baby_events e where e.id = baby_rsvps.event_id and e.user_id = auth.uid())
  );
drop policy if exists "baby_rsvps_owner_delete" on public.baby_rsvps;
create policy "baby_rsvps_owner_delete" on public.baby_rsvps
  for delete using (
    exists (select 1 from public.baby_events e where e.id = baby_rsvps.event_id and e.user_id = auth.uid())
  );

-- Organizadores extra (papás, padrinos, familia).
-- El archivo supabase/members.sql es el mismo bloque, para correrlo solo
-- si la base ya existía.

create table if not exists public.baby_event_members (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.baby_events(id) on delete cascade,
  email text not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists baby_event_members_event_email_key
  on public.baby_event_members(event_id, email);
create index if not exists baby_event_members_email_idx
  on public.baby_event_members(email);
create index if not exists baby_event_members_user_id_idx
  on public.baby_event_members(user_id);

alter table public.baby_event_members enable row level security;

create or replace function public.is_baby_event_manager(target_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.baby_events e
      where e.id = target_event_id and e.user_id = auth.uid()
    )
    or exists (
      select 1
      from public.baby_event_members m
      where m.event_id = target_event_id
        and (
          m.user_id = auth.uid()
          or m.email = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
    );
$$;

grant execute on function public.is_baby_event_manager(uuid) to authenticated;

drop policy if exists "baby_event_members_select" on public.baby_event_members;
create policy "baby_event_members_select" on public.baby_event_members
  for select using (public.is_baby_event_manager(event_id));

drop policy if exists "baby_event_members_insert" on public.baby_event_members;
create policy "baby_event_members_insert" on public.baby_event_members
  for insert with check (
    exists (
      select 1 from public.baby_events e
      where e.id = event_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "baby_event_members_delete" on public.baby_event_members;
create policy "baby_event_members_delete" on public.baby_event_members
  for delete using (
    exists (
      select 1 from public.baby_events e
      where e.id = event_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "baby_events_owner_select" on public.baby_events;
create policy "baby_events_owner_select" on public.baby_events
  for select using (public.is_baby_event_manager(id));

drop policy if exists "baby_events_owner_update" on public.baby_events;
create policy "baby_events_owner_update" on public.baby_events
  for update using (public.is_baby_event_manager(id));

drop policy if exists "baby_gifts_owner_select" on public.baby_gifts;
create policy "baby_gifts_owner_select" on public.baby_gifts
  for select using (public.is_baby_event_manager(event_id));

drop policy if exists "baby_gifts_owner_insert" on public.baby_gifts;
create policy "baby_gifts_owner_insert" on public.baby_gifts
  for insert with check (public.is_baby_event_manager(event_id));

drop policy if exists "baby_gifts_owner_update" on public.baby_gifts;
create policy "baby_gifts_owner_update" on public.baby_gifts
  for update using (public.is_baby_event_manager(event_id));

drop policy if exists "baby_gifts_owner_delete" on public.baby_gifts;
create policy "baby_gifts_owner_delete" on public.baby_gifts
  for delete using (public.is_baby_event_manager(event_id));

drop policy if exists "baby_claims_owner_select" on public.baby_claims;
create policy "baby_claims_owner_select" on public.baby_claims
  for select using (
    exists (
      select 1 from public.baby_gifts g
      where g.id = baby_claims.gift_id
        and public.is_baby_event_manager(g.event_id)
    )
  );

drop policy if exists "baby_rsvps_owner_select" on public.baby_rsvps;
create policy "baby_rsvps_owner_select" on public.baby_rsvps
  for select using (public.is_baby_event_manager(event_id));

drop policy if exists "baby_rsvps_owner_delete" on public.baby_rsvps;
create policy "baby_rsvps_owner_delete" on public.baby_rsvps
  for delete using (public.is_baby_event_manager(event_id));

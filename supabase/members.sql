-- Organizadores extra (papás, padrinos, familia) que pueden ver y editar
-- la misma lista al iniciar sesión con Google.

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

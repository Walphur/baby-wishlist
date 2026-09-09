-- Restaura policies de crear/borrar evento (si faltan, el INSERT falla con RLS).
-- Correr en el SQL Editor de Supabase si hace falta; el código ya usa service role
-- para crear eventos, pero estas policies dejan consistente la base.

drop policy if exists "baby_events_owner_insert" on public.baby_events;
create policy "baby_events_owner_insert" on public.baby_events
  for insert with check (auth.uid() = user_id);

drop policy if exists "baby_events_owner_delete" on public.baby_events;
create policy "baby_events_owner_delete" on public.baby_events
  for delete using (auth.uid() = user_id);

-- Hora del evento + plantilla elegida (para regenerar invitaciones).
-- Correr en el SQL Editor de Supabase.

alter table public.baby_events add column if not exists event_time time;
alter table public.baby_events add column if not exists invitation_template_id text;

-- Bucket público para invitaciones generadas (si no existe).
insert into storage.buckets (id, name, public)
values ('invitations', 'invitations', true)
on conflict (id) do update set public = true;

drop policy if exists "invitations_public_read" on storage.objects;
create policy "invitations_public_read"
  on storage.objects for select
  using (bucket_id = 'invitations');

drop policy if exists "invitations_service_write" on storage.objects;
-- La subida la hace el server con service role (bypassa RLS).
-- Lectura pública arriba alcanza para mostrar las imágenes.

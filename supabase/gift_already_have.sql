-- Marcar regalos que la familia ya tiene (visibles para invitados).
-- Correr en el SQL Editor de Supabase.

alter table public.baby_gifts
  add column if not exists already_have boolean not null default false;

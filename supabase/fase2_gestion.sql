-- Fase 2: archivar bodas + almacenamiento de fotos
-- Ejecutar en Supabase → SQL Editor (después de fase1_auth.sql). Se puede ejecutar varias veces.

-- ── Archivar ──
alter table weddings add column if not exists archivada boolean not null default false;

-- ── Fotos: bucket público "bodas", una carpeta por boda (<wedding_id>/archivo.jpg) ──
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('bodas', 'bodas', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública (las invitaciones muestran las fotos); escritura solo superadmin
drop policy if exists "bodas_subir" on storage.objects;
create policy "bodas_subir" on storage.objects for insert to authenticated
  with check (bucket_id = 'bodas' and public.is_superadmin());

drop policy if exists "bodas_modificar" on storage.objects;
create policy "bodas_modificar" on storage.objects for update to authenticated
  using (bucket_id = 'bodas' and public.is_superadmin());

drop policy if exists "bodas_borrar" on storage.objects;
create policy "bodas_borrar" on storage.objects for delete to authenticated
  using (bucket_id = 'bodas' and public.is_superadmin());

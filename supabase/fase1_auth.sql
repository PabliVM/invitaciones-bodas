-- Fase 1: login de superadmin + permisos (RLS)
-- Ejecutar en Supabase → SQL Editor. Se puede ejecutar varias veces.

-- ── Perfiles y roles ──
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('superadmin', 'novios')),
  wedding_id text references weddings(id) on delete set null, -- para novios (fase 3)
  creado_en timestamptz not null default now()
);
alter table profiles enable row level security;

-- ¿El usuario actual es superadmin?
create or replace function is_superadmin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'superadmin');
$$;

-- Invitación pública: solo se puede leer UNA boda conociendo su id (no listar)
create or replace function get_wedding_public(p_id text)
returns table (id text, data jsonb, creado_en timestamptz, actualizado_en timestamptz)
language sql stable security definer set search_path = public
as $$
  select w.id, w.data, w.creado_en, w.actualizado_en from weddings w where w.id = p_id;
$$;

revoke all on function get_wedding_public(text) from public;
grant execute on function get_wedding_public(text) to anon, authenticated;
grant execute on function is_superadmin() to anon, authenticated;

-- ── Políticas ──
-- Quitar acceso abierto anterior
drop policy if exists "weddings_all" on weddings;
drop policy if exists "rsvps_insert" on rsvps;
drop policy if exists "formularios_insert" on formularios;

-- Bodas: solo superadmin
drop policy if exists "weddings_superadmin" on weddings;
create policy "weddings_superadmin" on weddings for all to authenticated
  using (is_superadmin()) with check (is_superadmin());

-- RSVP y formularios: cualquiera envía, solo superadmin lee/borra
drop policy if exists "rsvps_enviar" on rsvps;
create policy "rsvps_enviar" on rsvps for insert to anon, authenticated with check (true);
drop policy if exists "rsvps_superadmin" on rsvps;
create policy "rsvps_superadmin" on rsvps for all to authenticated
  using (is_superadmin()) with check (is_superadmin());

drop policy if exists "formularios_enviar" on formularios;
create policy "formularios_enviar" on formularios for insert to anon, authenticated with check (true);
drop policy if exists "formularios_superadmin" on formularios;
create policy "formularios_superadmin" on formularios for all to authenticated
  using (is_superadmin()) with check (is_superadmin());

-- Perfiles: cada uno ve el suyo; superadmin gestiona todos
drop policy if exists "profiles_propio" on profiles;
create policy "profiles_propio" on profiles for select to authenticated using (id = auth.uid());
drop policy if exists "profiles_superadmin" on profiles;
create policy "profiles_superadmin" on profiles for all to authenticated
  using (is_superadmin()) with check (is_superadmin());

-- ── Dar rol superadmin (cambia el email y ejecuta tras crear el usuario) ──
-- insert into profiles (id, role)
-- select id, 'superadmin' from auth.users where email = 'TU_EMAIL'
-- on conflict (id) do update set role = 'superadmin';

-- Ejecutar en Supabase → SQL Editor

create table if not exists weddings (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists rsvps (
  id bigint generated always as identity primary key,
  boda_id text not null references weddings(id) on delete cascade,
  nombre text,
  asistencia text,
  mensaje text,
  enviado_en timestamptz not null default now()
);

create table if not exists formularios (
  id bigint generated always as identity primary key,
  boda_id text not null references weddings(id) on delete cascade,
  respuestas jsonb not null default '{}'::jsonb,
  enviado_en timestamptz not null default now()
);

alter table weddings enable row level security;
alter table rsvps enable row level security;
alter table formularios enable row level security;

-- Sin login: acceso abierto a bodas (igual que antes con Firestore)
drop policy if exists "weddings_all" on weddings;
create policy "weddings_all" on weddings for all to anon using (true) with check (true);
-- Invitados: solo pueden enviar
drop policy if exists "rsvps_insert" on rsvps;
create policy "rsvps_insert" on rsvps for insert to anon with check (true);
drop policy if exists "formularios_insert" on formularios;
create policy "formularios_insert" on formularios for insert to anon with check (true);

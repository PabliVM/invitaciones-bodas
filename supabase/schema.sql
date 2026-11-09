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

-- Permisos: los pone fase1_auth.sql (ejecutar justo después).
-- Antes aquí se abría el acceso a todas las bodas sin login; se ha quitado por seguridad.

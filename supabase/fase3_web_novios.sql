-- Fase 3: web pública (solicitudes de información) + portal de novios
-- Ejecutar en Supabase → SQL Editor (después de fase1 y fase2). Se puede ejecutar varias veces.

-- ════════════ SOLICITUDES DE INFORMACIÓN ════════════

create table if not exists solicitudes (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(nombre) between 2 and 120),
  email text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono text check (char_length(telefono) <= 40),
  fecha_boda date,
  plan text check (plan in ('esencial', 'premium', 'a_medida', 'no_se')),
  mensaje text check (char_length(mensaje) <= 2000),
  acepta_privacidad boolean not null check (acepta_privacidad),
  estado text not null default 'nueva' check (estado in ('nueva', 'contactada', 'cliente', 'descartada')),
  notas text,
  creado_en timestamptz not null default now()
);
alter table solicitudes enable row level security;

-- Cualquiera puede ENVIAR (no leer). Solo puede crear solicitudes "nuevas" sin notas.
drop policy if exists "solicitudes_enviar" on solicitudes;
create policy "solicitudes_enviar" on solicitudes for insert to anon, authenticated
  with check (estado = 'nueva' and notas is null);
drop policy if exists "solicitudes_superadmin" on solicitudes;
create policy "solicitudes_superadmin" on solicitudes for all to authenticated
  using (is_superadmin()) with check (is_superadmin());

-- Antispam: máx. 3 solicitudes por email cada hora y 30 en total cada 10 minutos
create or replace function limitar_solicitudes()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if (select count(*) from solicitudes where lower(email) = lower(new.email) and creado_en > now() - interval '1 hour') >= 3
     or (select count(*) from solicitudes where creado_en > now() - interval '10 minutes') >= 30 then
    raise exception 'Demasiadas solicitudes. Inténtalo más tarde.';
  end if;
  return new;
end;
$$;
drop trigger if exists solicitudes_limite on solicitudes;
create trigger solicitudes_limite before insert on solicitudes
  for each row execute function limitar_solicitudes();

-- ════════════ PORTAL DE NOVIOS ════════════
-- Las cuentas de novios las crea el panel (servidor). Aquí solo los permisos:
-- un usuario con rol 'novios' puede LEER su boda y sus respuestas. Nada más.

create or replace function mi_boda()
returns text language sql stable security definer set search_path = public
as $$ select wedding_id from profiles where id = auth.uid() and role = 'novios'; $$;
grant execute on function mi_boda() to authenticated;

drop policy if exists "weddings_novios_leer" on weddings;
create policy "weddings_novios_leer" on weddings for select to authenticated
  using (id = mi_boda());

drop policy if exists "rsvps_novios_leer" on rsvps;
create policy "rsvps_novios_leer" on rsvps for select to authenticated
  using (boda_id = mi_boda());

drop policy if exists "formularios_novios_leer" on formularios;
create policy "formularios_novios_leer" on formularios for select to authenticated
  using (boda_id = mi_boda());

-- Si se borra una boda, se borra el acceso de sus novios
alter table profiles drop constraint if exists profiles_wedding_id_fkey;
alter table profiles add constraint profiles_wedding_id_fkey
  foreign key (wedding_id) references weddings(id) on delete cascade;

-- Un perfil de novios siempre debe tener boda asignada
alter table profiles drop constraint if exists profiles_novios_con_boda;
alter table profiles add constraint profiles_novios_con_boda
  check (role <> 'novios' or wedding_id is not null);

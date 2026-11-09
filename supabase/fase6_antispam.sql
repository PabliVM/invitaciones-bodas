-- Fase 6: antispam en las respuestas de los invitados (RSVP y formularios).
-- Ejecutar en Supabase → SQL Editor (después de fase1_auth.sql). Se puede ejecutar varias veces.
-- Límites pensados para no frenar a invitados reales: 60 respuestas por boda cada 10 minutos
-- y 300 en total cada 10 minutos. Textos con tamaño máximo.

create or replace function limitar_rsvps()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if char_length(coalesce(new.nombre, '')) > 200
     or char_length(coalesce(new.asistencia, '')) > 40
     or char_length(coalesce(new.mensaje, '')) > 2000 then
    raise exception 'Respuesta demasiado larga.';
  end if;
  if (select count(*) from rsvps where boda_id = new.boda_id and enviado_en > now() - interval '10 minutes') >= 60
     or (select count(*) from rsvps where enviado_en > now() - interval '10 minutes') >= 300 then
    raise exception 'Demasiadas respuestas. Inténtalo más tarde.';
  end if;
  return new;
end;
$$;
drop trigger if exists rsvps_limite on rsvps;
create trigger rsvps_limite before insert on rsvps
  for each row execute function limitar_rsvps();

create or replace function limitar_formularios()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if char_length(coalesce(new.respuestas, '{}'::jsonb)::text) > 10000 then
    raise exception 'Respuesta demasiado larga.';
  end if;
  if (select count(*) from formularios where boda_id = new.boda_id and enviado_en > now() - interval '10 minutes') >= 60
     or (select count(*) from formularios where enviado_en > now() - interval '10 minutes') >= 300 then
    raise exception 'Demasiadas respuestas. Inténtalo más tarde.';
  end if;
  return new;
end;
$$;
drop trigger if exists formularios_limite on formularios;
create trigger formularios_limite before insert on formularios
  for each row execute function limitar_formularios();

-- Índices para que el recuento sea rápido
create index if not exists rsvps_boda_fecha on rsvps (boda_id, enviado_en);
create index if not exists formularios_boda_fecha on formularios (boda_id, enviado_en);

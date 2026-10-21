-- Fase 5: nuevo plan "completa" en las solicitudes de la web.
-- Ejecutar en Supabase → SQL Editor (después de fase3_web_novios.sql). Se puede ejecutar varias veces.

alter table public.solicitudes drop constraint if exists solicitudes_plan_check;
alter table public.solicitudes add constraint solicitudes_plan_check
  check (plan in ('esencial', 'completa', 'premium', 'a_medida', 'no_se'));

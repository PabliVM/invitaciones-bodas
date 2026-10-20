// /api/novios — Gestión de accesos de novios (solo superadmin).
// Usa SUPABASE_SERVICE_ROLE_KEY (variable de servidor, nunca expuesta al navegador).
//   GET    ?boda=<id>            → lista de emails con acceso
//   POST   { boda, email }       → da acceso y envía enlace de entrada
//   DELETE { boda, email }       → retira el acceso y borra la cuenta

import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

function admin() {
  return createClient(URL_SB, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Verifica que quien llama es superadmin a partir de su token de sesión
async function comprobarSuperadmin(req, sb) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return false;
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return false;
  const { data: perfil } = await sb.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  return !!perfil && perfil.role === 'superadmin';
}

async function buscarUsuario(sb, email) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const u = data.users.find(x => (x.email || '').toLowerCase() === email);
    if (u) return u;
    if (data.users.length < 1000) return null;
  }
  return null;
}

// Origen propio para el enlace de entrada (no se acepta uno arbitrario)
function origen(req) {
  const u = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') || u.host;
  const proto = req.headers.get('x-forwarded-proto') || u.protocol.replace(':', '');
  return proto + '://' + host;
}

async function preparar(req) {
  if (!URL_SB || !SERVICE || !ANON) return { error: json({ error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor.' }, 500) };
  const sb = admin();
  if (!(await comprobarSuperadmin(req, sb))) return { error: json({ error: 'No autorizado' }, 401) };
  return { sb };
}

async function bodaExiste(sb, boda) {
  if (!boda || typeof boda !== 'string') return false;
  const { data } = await sb.from('weddings').select('id').eq('id', boda).maybeSingle();
  return !!data;
}

export async function GET(req) {
  const { sb, error } = await preparar(req);
  if (error) return error;
  const boda = new URL(req.url).searchParams.get('boda');
  if (!(await bodaExiste(sb, boda))) return json({ error: 'Boda no encontrada' }, 404);
  const { data: perfiles, error: e } = await sb.from('profiles').select('id, creado_en').eq('role', 'novios').eq('wedding_id', boda);
  if (e) return json({ error: e.message }, 500);
  const accesos = [];
  for (const p of perfiles) {
    const { data } = await sb.auth.admin.getUserById(p.id);
    if (data && data.user) accesos.push({ email: data.user.email, ultimoAcceso: data.user.last_sign_in_at, creado: p.creado_en });
  }
  return json({ accesos });
}

export async function POST(req) {
  const { sb, error } = await preparar(req);
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) return json({ error: 'Email no válido' }, 400);
  if (!(await bodaExiste(sb, body.boda))) return json({ error: 'Boda no encontrada' }, 404);

  let usuario = await buscarUsuario(sb, email);
  if (usuario) {
    const { data: perfil } = await sb.from('profiles').select('role, wedding_id').eq('id', usuario.id).maybeSingle();
    if (perfil && perfil.role === 'superadmin') return json({ error: 'Ese email es de un administrador' }, 409);
    if (perfil && perfil.role === 'novios' && perfil.wedding_id !== body.boda) return json({ error: 'Ese email ya tiene acceso a otra boda' }, 409);
  } else {
    const { data, error: e } = await sb.auth.admin.createUser({ email, email_confirm: true });
    if (e) return json({ error: e.message }, 500);
    usuario = data.user;
  }

  const { error: e2 } = await sb.from('profiles').upsert({ id: usuario.id, role: 'novios', wedding_id: body.boda });
  if (e2) return json({ error: e2.message }, 500);

  // Envía el enlace de entrada (solo a usuarios ya existentes)
  const publico = createClient(URL_SB, ANON, { auth: { persistSession: false } });
  const { error: e3 } = await publico.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: origen(req) + '/novios' }
  });
  return json({ ok: true, enlaceEnviado: !e3, aviso: e3 ? 'Acceso creado, pero no se pudo enviar el email: ' + e3.message : null });
}

export async function DELETE(req) {
  const { sb, error } = await preparar(req);
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const usuario = EMAIL_RE.test(email) ? await buscarUsuario(sb, email) : null;
  if (!usuario) return json({ error: 'Acceso no encontrado' }, 404);
  const { data: perfil } = await sb.from('profiles').select('role, wedding_id').eq('id', usuario.id).maybeSingle();
  if (!perfil || perfil.role !== 'novios' || perfil.wedding_id !== body.boda) return json({ error: 'Acceso no encontrado' }, 404);
  await sb.from('profiles').delete().eq('id', usuario.id);
  const { error: e } = await sb.auth.admin.deleteUser(usuario.id);
  if (e) return json({ error: e.message }, 500);
  return json({ ok: true });
}

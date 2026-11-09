// /invitation.html?id=<boda> llega aquí (rewrite en next.config.mjs).
// Devuelve la misma invitation.html, pero con título, foto y enlace de la boda ya puestos en las
// etiquetas og: — así WhatsApp, Telegram, etc. muestran la vista previa (no ejecutan JavaScript).
// Si algo falla, se sirve la página sin cambios: la invitación funciona igual que siempre.

import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TITULOS = { bautizo: 'Bautizo de ', comunion: 'Comunión de ', cumpleanos: 'Cumpleaños de ', aniversario: 'Aniversario de ', evento: 'Celebración de ' };

let plantilla = null;

async function cargarPlantilla(origen) {
  if (plantilla) return plantilla;
  try {
    plantilla = await readFile(path.join(process.cwd(), 'public', 'invitation.html'), 'utf8');
  } catch {
    // Sin ?id= no hay rewrite: se sirve el archivo estático
    const r = await fetch(origen + '/invitation.html', { cache: 'no-store' });
    if (!r.ok) throw new Error('invitation.html no disponible');
    plantilla = await r.text();
  }
  return plantilla;
}

function attr(t) {
  return String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function cargarBoda(id) {
  if (!URL_SB || !ANON || !id || id.length > 100) return null;
  const r = await fetch(URL_SB + '/rest/v1/rpc/get_wedding_public', {
    method: 'POST',
    headers: { apikey: ANON, Authorization: 'Bearer ' + ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_id: id }),
    cache: 'no-store',
    signal: AbortSignal.timeout(3000)
  });
  if (!r.ok) return null;
  const filas = await r.json();
  return Array.isArray(filas) && filas[0] ? filas[0].data || {} : null;
}

// Mismo título y foto que pone la propia página (actualizarOG en invitation.html)
function etiquetar(html, boda, url, std) {
  const p = boda.pareja || {};
  const nombres = (p.novio || '') + (p.novia ? ' & ' + p.novia : '');
  if (!nombres.trim()) return html;
  let titulo = (TITULOS[boda.tipoEvento] || 'Boda de ') + nombres;
  if (std) titulo = 'Save the date · ' + titulo;
  const foto = boda.fotoCabecera || (boda.galeria && boda.galeria.fotos && boda.galeria.fotos[0]) || '';
  const poner = (id, valor) => {
    if (!valor) return;
    html = html.replace(new RegExp('(<meta[^>]*content=")[^"]*("[^>]*id="' + id + '")'), '$1' + attr(valor) + '$2');
  };
  poner('og-title', titulo); poner('tw-title', titulo);
  poner('og-image', foto); poner('tw-image', foto);
  poner('og-url', url);
  return html.replace(/<title>[^<]*<\/title>/, '<title>' + attr(titulo) + '</title>');
}

export async function GET(req) {
  const u = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') || u.host;
  const proto = req.headers.get('x-forwarded-proto') || u.protocol.replace(':', '');
  const origen = proto + '://' + host;
  let html;
  try {
    html = await cargarPlantilla(origen);
  } catch {
    return new Response('Invitación no disponible ahora mismo. Inténtalo de nuevo en un momento.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  try {
    const id = u.searchParams.get('id');
    const boda = await cargarBoda(id);
    const url = origen + '/invitation.html?' + u.searchParams.toString();
    if (boda) html = etiquetar(html, boda, url, u.searchParams.get('std') === '1');
  } catch { /* sin vista previa, la invitación funciona igual */ }
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' }
  });
}

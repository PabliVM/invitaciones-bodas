// Expone la config pública de Supabase (variables de entorno) a la app legacy de /public
export const dynamic = 'force-dynamic';

export function GET() {
  const config = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  };
  return new Response(`window.SUPABASE_CONFIG = ${JSON.stringify(config)};`, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

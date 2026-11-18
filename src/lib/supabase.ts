import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getConfig } from './config';

export function publicDb() {
  const { url, key } = getConfig();
  if (!url || !key) throw new Error('Supabase não configurado.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export async function sessionDb() {
  const { url, key } = getConfig();
  if (!url || !key) throw new Error('Supabase não configurado.');
  const jar = await cookies();
  return createServerClient(url, key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try {
          for (const { name, value, options } of values) jar.set(name, value, options);
        } catch {
          /* Server Components não escrevem cookies; proxy renova sessões. */
        }
      },
    },
  });
}

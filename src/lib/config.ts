import 'server-only';
import { z } from 'zod';

export function getConfig() {
  const production = process.env.NODE_ENV === 'production';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const demo = process.env.DEMO_MODE === 'true';
  if (production && demo) throw new Error('DEMO_MODE é proibido em produção.');
  if (production && (!url || !key || !process.env.NEXT_PUBLIC_SITE_URL))
    throw new Error('Configure NEXT_PUBLIC_SITE_URL e as duas variáveis públicas do Supabase.');
  if (url && !z.url().safeParse(url).success) throw new Error('URL do Supabase inválida.');
  if (
    process.env.NEXT_PUBLIC_SITE_URL &&
    !z.url().safeParse(process.env.NEXT_PUBLIC_SITE_URL).success
  )
    throw new Error('URL pública inválida.');
  if (
    production &&
    (!process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://') || !url?.startsWith('https://'))
  )
    throw new Error('Utilize HTTPS em produção.');
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_URL;
  const contact = process.env.CONTACT_EMAIL;
  return {
    url,
    key,
    demo,
    configured: Boolean(url && key),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    telegram:
      telegram && z.url().safeParse(telegram).success && new URL(telegram).protocol === 'https:'
        ? telegram
        : null,
    contact: contact && z.email().safeParse(contact).success ? contact : null,
  };
}

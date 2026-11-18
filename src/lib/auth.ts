import 'server-only';
import { redirect } from 'next/navigation';
import { getConfig } from './config';
import { sessionDb } from './supabase';

export async function requireAdmin() {
  if (!getConfig().configured) redirect('/admin/login');
  const db = await sessionDb();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) redirect('/admin/login');
  const { data: admin } = await db
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!admin) redirect('/admin/login?erro=acesso');
  return { db, user };
}

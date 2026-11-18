'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getConfig } from '@/lib/config';
import { sessionDb } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';
import { changeProductStatus, saveCategory, saveProduct } from '@/features/admin';

export type ActionState = { error?: string; success?: string };
export async function loginAction(_: ActionState, form: FormData): Promise<ActionState> {
  if (!getConfig().configured)
    return { error: 'Configure as variáveis do Supabase para acessar o painel.' };
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: 'Informe um e-mail válido e a senha de administrador.' };
  const db = await sessionDb();
  const { data, error } = await db.auth.signInWithPassword(parsed.data);
  if (error || !data.user)
    return { error: 'Não foi possível entrar. Verifique seus dados ou tente mais tarde.' };
  const { data: admin } = await db
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle();
  if (!admin) {
    await db.auth.signOut();
    return { error: 'Esta conta não tem acesso ao painel.' };
  }
  redirect('/admin');
}
export async function logoutAction() {
  const { db } = await requireAdmin();
  await db.auth.signOut();
  redirect('/admin/login');
}
function invalidateCatalog() {
  revalidatePath('/', 'layout');
}
export async function productAction(
  id: string | undefined,
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (id && !z.uuid().safeParse(id).success) return { error: 'Produto inválido.' };
  const input = {
    ...Object.fromEntries(form),
    is_featured: form.get('is_featured') === 'on',
    fetch_image: form.get('fetch_image') === 'on',
  };
  let result;
  try {
    result = await saveProduct(input, id);
  } catch {
    return {
      error:
        'Não foi possível validar o link. Confira o endereço ou use o link completo com sua tag.',
    };
  }
  if (result.error) return { error: result.error };
  invalidateCatalog();
  redirect('/admin/produtos?sucesso=salvo');
}
export async function statusAction(form: FormData) {
  await requireAdmin();
  const parsed = z
    .object({ id: z.uuid(), status: z.enum(['draft', 'published', 'archived']) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) redirect('/admin/produtos?erro=status');
  try {
    await changeProductStatus(parsed.data.id, parsed.data.status);
  } catch {
    redirect('/admin/produtos?erro=status');
  }
  invalidateCatalog();
  redirect('/admin/produtos?sucesso=status');
}
export async function categoryAction(
  id: string | undefined,
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin();
  if (id && !z.uuid().safeParse(id).success) return { error: 'Categoria inválida.' };
  const result = await saveCategory(
    { ...Object.fromEntries(form), is_active: form.get('is_active') === 'on' },
    id,
  );
  if (result.error) return { error: result.error };
  invalidateCatalog();
  return { success: 'Categoria salva.' };
}
export async function deleteCategoryAction(form: FormData) {
  const { db } = await requireAdmin();
  const parsed = z.uuid().safeParse(form.get('id'));
  if (!parsed.success) redirect('/admin/categorias?erro=exclusao');
  const { data, error } = await db
    .from('categories')
    .delete()
    .eq('id', parsed.data)
    .select('id')
    .single();
  if (error || !data) redirect('/admin/categorias?erro=exclusao');
  invalidateCatalog();
  redirect('/admin/categorias?sucesso=excluida');
}

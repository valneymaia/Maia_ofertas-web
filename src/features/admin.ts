import 'server-only';
import { requireAdmin } from '@/lib/auth';
import { categorySchema, productSchema } from '@/lib/validators';
import { resolveAffiliateUrl } from '@/lib/resolve-affiliate';
import { fetchAmazonProductImage } from '@/lib/amazon-image';
import type { Product, Category } from '@/types/domain';

export async function listAdminProducts(): Promise<Product[]> {
  const { db } = await requireAdmin();
  const { data, error } = await db
    .from('products')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(200);
  if (error) throw new Error('Não foi possível carregar os produtos.');
  return data as Product[];
}
export async function listAdminCategories(): Promise<Category[]> {
  const { db } = await requireAdmin();
  const { data, error } = await db.from('categories').select('*').order('display_order');
  if (error) throw new Error('Não foi possível carregar as categorias.');
  return data as Category[];
}
export async function saveProduct(input: Record<string, unknown>, id?: string) {
  const { db } = await requireAdmin();
  const affiliate_url = await resolveAffiliateUrl(String(input.affiliate_url || ''));
  let image_url = input.image_url;
  let image_source = input.image_source;
  if (input.fetch_image === true && !image_url) {
    const detected = await fetchAmazonProductImage(affiliate_url);
    image_url = detected || '';
    image_source = detected ? 'amazon_metadata' : 'placeholder';
  }
  const parsed = productSchema.safeParse({ ...input, affiliate_url, image_url, image_source });
  if (!parsed.success)
    return {
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' · '),
    };
  const { data: category } = await db
    .from('categories')
    .select('id')
    .eq('id', parsed.data.category_id)
    .eq('is_active', true)
    .maybeSingle();
  if (!category) return { error: 'Selecione uma categoria ativa.' };
  const query = id
    ? db.from('products').update(parsed.data).eq('id', id)
    : db.from('products').insert(parsed.data);
  const { data, error } = await query.select('id').single();
  if (error)
    return {
      error:
        error.code === '23505'
          ? 'Este endereço amigável já existe. Escolha outro slug.'
          : 'Não foi possível salvar. Confira os campos e tente novamente.',
    };
  return { id: data.id as string };
}
export const createProduct = (input: Record<string, unknown>) => saveProduct(input);
export const updateProduct = (id: string, input: Record<string, unknown>) => saveProduct(input, id);
export async function changeProductStatus(id: string, status: 'draft' | 'published' | 'archived') {
  const { db } = await requireAdmin();
  const { data, error } = await db
    .from('products')
    .update({ status })
    .eq('id', id)
    .select('id')
    .single();
  if (error || !data) throw new Error('Não foi possível alterar o status.');
}
export const publishProduct = (id: string) => changeProductStatus(id, 'published');
export const archiveProduct = (id: string) => changeProductStatus(id, 'archived');
export async function saveCategory(input: Record<string, unknown>, id?: string) {
  const { db } = await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(' · ') };
  if (id && !parsed.data.is_active) {
    const { count } = await db
      .from('products')
      .select('id', { head: true, count: 'exact' })
      .eq('category_id', id);
    if (count) return { error: 'Realocar todos os produtos antes de desativar esta categoria.' };
  }
  const query = id
    ? db.from('categories').update(parsed.data).eq('id', id)
    : db.from('categories').insert(parsed.data);
  const { data, error } = await query.select('id').single();
  if (error || !data)
    return {
      error:
        error?.code === '23505'
          ? 'O slug desta categoria já existe.'
          : 'Não foi possível salvar a categoria.',
    };
  return { id: data.id as string };
}

import 'server-only';
import { cache } from 'react';
import { getConfig } from '@/lib/config';
import { publicDb } from '@/lib/supabase';
import { demoCategories, demoProducts } from '@/data/demo';
import { initialProducts } from '@/data/initial-offers';
import { normalizeSearch } from '@/lib/validators';
import type { Category, Product } from '@/types/domain';

export const listCategories = cache(async (): Promise<Category[]> => {
  const config = getConfig();
  if (config.demo) return demoCategories;
  if (!config.configured) return demoCategories;
  const { data, error } = await publicDb()
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw new Error('Não foi possível carregar as categorias.');
  return data as Category[];
});
export type CatalogFilters = {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
  featured?: boolean;
  limit?: number;
};
export async function listPublishedProducts(filters: CatalogFilters = {}) {
  const config = getConfig();
  const page = Math.min(10000, Math.max(1, Math.floor(filters.page || 1)));
  const limit = Math.min(24, Math.max(1, Math.floor(filters.limit || 9)));
  const q = normalizeSearch((filters.q || '').slice(0, 100));
  const categories = await listCategories();
  const category = filters.category
    ? categories.find((c) => c.slug === filters.category)
    : undefined;
  if (filters.category && !category) return { products: [] as Product[], count: 0, page, limit };
  if (config.demo || !config.configured) {
    let products = (config.demo ? demoProducts : initialProducts).filter(
      (p) =>
        p.status === 'published' &&
        (!category || p.category_id === category.id) &&
        (!filters.featured || p.is_featured) &&
        normalizeSearch(p.title + ' ' + p.summary).includes(q),
    );
    if (filters.sort === 'destaques')
      products = [...products].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    return {
      products: products.slice((page - 1) * limit, page * limit),
      count: products.length,
      page,
      limit,
    };
  }
  let query = publicDb()
    .from('products')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .in(
      'category_id',
      categories.map((c) => c.id),
    );
  if (category) query = query.eq('category_id', category.id);
  if (filters.featured) query = query.eq('is_featured', true);
  if (q) query = query.ilike('search_text', `%${q.replace(/[%_\\]/g, '')}%`);
  if (filters.sort === 'destaques') query = query.order('is_featured', { ascending: false });
  const { data, count, error } = await query
    .order('published_at', { ascending: false })
    .order('id')
    .range((page - 1) * limit, page * limit - 1);
  if (error) throw new Error('Não foi possível carregar os produtos.');
  return { products: data as Product[], count: count || 0, page, limit };
}
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const config = getConfig();
  if (config.demo)
    return demoProducts.find((p) => p.slug === slug && p.status === 'published') || null;
  if (!config.configured) return initialProducts.find((p) => p.slug === slug) || null;
  const { data, error } = await publicDb()
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw new Error('Não foi possível carregar o produto.');
  return data as Product | null;
});
export const getFeaturedProducts = () => listPublishedProducts({ featured: true, limit: 3 });
export const getProductsByCategory = (category: string, page = 1) =>
  listPublishedProducts({ category, page });
export const searchProducts = (q: string) => listPublishedProducts({ q });

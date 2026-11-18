import type { MetadataRoute } from 'next';
import { publicDb } from '@/lib/supabase';
import { getConfig } from '@/lib/config';
import { listCategories } from '@/features/catalog';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl, configured } = getConfig();
  const base = [
    '',
    '/ofertas',
    '/sobre',
    '/contato',
    '/politica-de-privacidade',
    '/termos-de-uso',
  ].map((p) => ({ url: siteUrl + p }));
  const categories = await listCategories();
  const products: { slug: string; updated_at: string }[] = [];
  if (configured) {
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await publicDb()
        .from('products')
        .select('slug,updated_at')
        .eq('status', 'published')
        .order('id')
        .range(offset, offset + 499);
      if (error) throw new Error('Falha ao gerar sitemap.');
      products.push(...data);
      if (data.length < 500) break;
    }
  }
  return [
    ...base,
    ...categories.map((c) => ({ url: `${siteUrl}/categorias/${c.slug}` })),
    ...products.map((p) => ({ url: `${siteUrl}/produto/${p.slug}`, lastModified: p.updated_at })),
  ];
}

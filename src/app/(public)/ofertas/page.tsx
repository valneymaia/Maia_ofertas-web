import type { Metadata } from 'next';
import { listCategories, listPublishedProducts } from '@/features/catalog';
import { CategoryNavigation, Pagination, ProductGrid } from '@/components/products';
import { Breadcrumbs } from '@/components/layout';
import { getConfig } from '@/lib/config';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const p = await searchParams;
  return {
    title: 'Explorar ofertas',
    alternates: { canonical: '/ofertas' },
    robots: p.q || p.categoria || p.pagina || p.ordem ? { index: false, follow: true } : undefined,
  };
}
export default async function Offers({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const value = (key: string) => (typeof p[key] === 'string' ? (p[key] as string) : '');
  const q = value('q').slice(0, 100),
    category = value('categoria'),
    sort = value('ordem');
  const [categories, result] = await Promise.all([
    listCategories(),
    listPublishedProducts({ q, category, sort, page: Number(value('pagina')) || 1 }),
  ]);
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: 'Ofertas' }]} />
      <div className="page-title">
        <span className="eyebrow">ENCONTRE SUA PRÓXIMA ESCOLHA</span>
        <h1>
          Explore as descobertas<span className="orange-text">.</span>
        </h1>
        <p>Produtos selecionados, caminhos mais curtos para escolher.</p>
      </div>
      <CategoryNavigation categories={categories} />
      <form action="/ofertas" className="filters">
        <div>
          <label htmlFor="q">Buscar no catálogo</label>
          <input
            id="q"
            name="q"
            placeholder="Nome ou descrição do produto"
            defaultValue={q}
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="category">Categoria</label>
          <select id="category" name="categoria" defaultValue={category}>
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort">Ordenar por</label>
          <select id="sort" name="ordem" defaultValue={sort}>
            <option value="">Mais recentes</option>
            <option value="destaques">Destaques</option>
          </select>
        </div>
        <button className="button navy" type="submit">
          Filtrar produtos
        </button>
      </form>
      <p className="result-count">
        {result.count} {result.count === 1 ? 'produto encontrado' : 'produtos encontrados'}
        {q && <> para “{q}”</>}
      </p>
      <ProductGrid products={result.products} categories={categories} demo={getConfig().demo} />
      <Pagination {...result} params={{ q, categoria: category, ordem: sort }} />
    </div>
  );
}

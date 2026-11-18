import { notFound } from 'next/navigation';
import { listCategories, getProductsByCategory } from '@/features/catalog';
import { ProductGrid, Pagination } from '@/components/products';
import { Breadcrumbs } from '@/components/layout';
import { getConfig } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = (await listCategories()).find((c) => c.slug === slug);
  return {
    title: category?.name || 'Categoria não encontrada',
    description: category?.description,
    alternates: { canonical: `/categorias/${slug}` },
  };
}
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
}) {
  const { slug } = await params;
  const categories = await listCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const result = await getProductsByCategory(slug, Number((await searchParams).pagina) || 1);
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: 'Ofertas', href: '/ofertas' }, { label: category.name }]} />
      <div className="page-title">
        <span className="eyebrow">CURADORIA MAIAOFERTAS</span>
        <h1>
          {category.name}
          <span className="orange-text">.</span>
        </h1>
        <p>{category.description}</p>
      </div>
      <ProductGrid products={result.products} categories={categories} demo={getConfig().demo} />
      <Pagination {...result} params={{}} base={`/categorias/${slug}`} />
    </div>
  );
}

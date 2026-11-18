import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, listCategories, getProductsByCategory } from '@/features/catalog';
import { ProductVisual, AmazonOutboundLink, ProductGrid } from '@/components/products';
import { AffiliateDisclosure, Breadcrumbs } from '@/components/layout';
import { getConfig } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return {
    title: p?.title || 'Produto não encontrado',
    description: p?.summary,
    alternates: { canonical: `/produto/${slug}` },
    openGraph: p
      ? {
          title: p.title,
          description: p.summary,
          ...(p.image_url ? { images: [p.image_url] } : {}),
        }
      : undefined,
  };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const categories = await listCategories();
  const category = categories.find((c) => c.id === product.category_id);
  const related = category
    ? (await getProductsByCategory(category.slug)).products
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
    : [];
  const { demo } = getConfig();
  return (
    <div className="container page-content">
      <Breadcrumbs items={[{ label: 'Ofertas', href: '/ofertas' }, { label: product.title }]} />
      <section className="product-detail">
        <ProductVisual product={product} large />
        <div>
          <Link href={category ? `/categorias/${category.slug}` : '/ofertas'} className="eyebrow">
            {category?.name || 'Seleção Maia'}
          </Link>
          <h1>{product.title}</h1>
          <p className="detail-summary">{product.summary}</p>
          <div className="description">
            {product.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <p className="ad-label">
            {demo ? 'Produto demonstrativo' : 'Publicidade · link de associado'}
          </p>
          <AmazonOutboundLink url={product.affiliate_url} demo={demo} />
          <p className="muted detail-note">
            Consulte preço, condições e disponibilidade na Amazon. A compra acontece no ambiente da
            Amazon, com o vendedor indicado na página do produto.
          </p>
          <AffiliateDisclosure compact />
        </div>
      </section>
      {related.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <h2>Outras boas descobertas</h2>
            <Link href="/ofertas" className="text-link">
              Voltar ao catálogo →
            </Link>
          </div>
          <ProductGrid products={related} categories={categories} demo={demo} />
        </section>
      )}
    </div>
  );
}

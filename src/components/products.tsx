import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  ArrowRight,
  Headphones,
  Keyboard,
  Coffee,
  LampDesk,
  Backpack,
  Speaker,
  Package,
  SearchX,
  Laptop,
  House,
  Sparkles,
  Shirt,
  Grid2X2,
  Gamepad2,
  AirVent,
} from 'lucide-react';
import type { Product, Category } from '@/types/domain';
import { validateAmazonAffiliateUrl } from '@/lib/amazon';

export function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  const hash = Array.from(product.slug).reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const title = product.title.toLowerCase();
  const Icon = /playstation|console|videogame/.test(title)
    ? Gamepad2
    : /ar-condicionado|ventilador/.test(title)
      ? AirVent
      : /fone/.test(title)
        ? Headphones
        : /teclado/.test(title)
          ? Keyboard
          : /cafe/.test(title)
            ? Coffee
            : /lumin/.test(title)
              ? LampDesk
              : /mochila/.test(title)
                ? Backpack
                : /caixa de som/.test(title)
                  ? Speaker
                  : Package;
  return (
    <div className={`product-visual visual-${hash % 4}${large ? ' large' : ''}`}>
      {product.image_url ? (
        <Image
          unoptimized
          src={product.image_url}
          alt={product.title}
          width={480}
          height={360}
          loading={large ? 'eager' : 'lazy'}
        />
      ) : (
        <>
          <span className="visual-orbit" />
          <Icon
            className="product-icon"
            size={large ? 130 : 82}
            strokeWidth={1.15}
            aria-hidden="true"
          />
          <span className="illustration-label">Ilustração da categoria</span>
        </>
      )}
    </div>
  );
}
export function AmazonOutboundLink({ url, demo = false }: { url: string; demo?: boolean }) {
  if (demo)
    return (
      <span className="amazon-button demo-button" aria-disabled="true">
        Demonstração · sem compra
        <ArrowUpRight size={17} />
      </span>
    );
  let valid: string;
  try {
    valid = validateAmazonAffiliateUrl(url);
  } catch {
    return <p className="muted">Link em revisão</p>;
  }
  return (
    <a href={valid} className="amazon-button" target="_blank" rel="sponsored nofollow noopener">
      Ver na Amazon
      <ArrowUpRight size={17} />
      <span className="sr-only"> (link publicitário, abre em nova aba)</span>
    </a>
  );
}
export function ProductCard({
  product,
  category,
  demo = false,
}: {
  product: Product;
  category?: Category;
  demo?: boolean;
}) {
  return (
    <article className="product-card">
      <Link
        href={`/produto/${product.slug}`}
        className="visual-link"
        aria-label={`Conhecer ${product.title}`}
      >
        <ProductVisual product={product} />
      </Link>
      <div className="product-content">
        <div className="card-meta">
          <span>{category?.name || 'Seleção Maia'}</span>
          {product.is_featured && <span className="featured-badge">Escolha Maia</span>}
        </div>
        <h3>
          <Link href={`/produto/${product.slug}`}>{product.title}</Link>
        </h3>
        <p>{product.summary}</p>
        <div className="card-action">
          <span className="ad-label">{demo ? 'Produto demonstrativo' : 'Link publicitário'}</span>
          <AmazonOutboundLink url={product.affiliate_url} demo={demo} />
        </div>
      </div>
    </article>
  );
}
export function ProductGrid({
  products,
  categories,
  demo = false,
}: {
  products: Product[];
  categories: Category[];
  demo?: boolean;
}) {
  if (!products.length) return <EmptyState />;
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={categories.find((c) => c.id === product.category_id)}
          demo={demo}
        />
      ))}
    </div>
  );
}
export function EmptyState() {
  return (
    <div className="empty-state">
      <SearchX size={35} />
      <h3>Nenhum produto por aqui ainda</h3>
      <p>Novas descobertas estão a caminho. Tente outra busca ou explore todas as categorias.</p>
      <Link href="/ofertas" className="text-link">
        Explorar o catálogo <ArrowRight size={16} />
      </Link>
    </div>
  );
}
export function CategoryNavigation({ categories }: { categories: Category[] }) {
  const categoryIcons = [Headphones, Laptop, House, Backpack, Sparkles, Shirt, Grid2X2];
  return (
    <nav className="category-nav" aria-label="Categorias">
      <Link href="/ofertas">
        <Grid2X2 size={16} /> Todas as ofertas
      </Link>
      {categories.map((category, i) => {
        const Icon = categoryIcons[i % categoryIcons.length] || Package;
        return (
          <Link key={category.id} href={`/categorias/${category.slug}`}>
            <Icon size={16} />
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}
export function Pagination({
  count,
  page,
  limit,
  params,
  base = '/ofertas',
}: {
  count: number;
  page: number;
  limit: number;
  params: Record<string, string>;
  base?: string;
}) {
  const pages = Math.ceil(count / limit);
  if (pages < 2) return null;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...params, pagina: String(p) })}`;
  return (
    <nav className="pagination" aria-label="Paginação">
      {page > 1 && <Link href={href(page - 1)}>← Anterior</Link>}
      <span>
        Página {page} de {pages}
      </span>
      {page < pages && <Link href={href(page + 1)}>Próxima →</Link>}
    </nav>
  );
}

import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container page-content empty-state">
      <span className="eyebrow">404 · CAMINHO NÃO ENCONTRADO</span>
      <h1>Essa descoberta não está aqui.</h1>
      <p>A página pode ter mudado ou o produto saiu do catálogo.</p>
      <Link href="/ofertas" className="button navy">
        Explorar ofertas
      </Link>
    </div>
  );
}

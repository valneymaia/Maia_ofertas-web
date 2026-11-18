import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
export default async function Dashboard() {
  const { db } = await requireAdmin();
  const queries = [
    db.from('products').select('id', { count: 'exact', head: true }),
    db.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    db.from('products').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    db.from('products').select('id', { count: 'exact', head: true }).eq('is_featured', true),
    db.from('categories').select('id', { count: 'exact', head: true }),
  ];
  const results = await Promise.all(queries);
  if (results.some((r) => r.error)) throw new Error('Não foi possível carregar os indicadores.');
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">VISÃO GERAL</span>
          <h1>
            Olá, curador<span className="orange-text">.</span>
          </h1>
          <p>Suas escolhas dão vida à vitrine.</p>
        </div>
        <Link className="button orange" href="/admin/produtos/novo">
          + Cadastrar produto
        </Link>
      </div>
      <div className="stats-grid">
        {['Total de produtos', 'Publicados', 'Rascunhos', 'Destaques', 'Categorias'].map(
          (label, i) => (
            <div className="panel" key={label}>
              <span className="muted">{label}</span>
              <strong className="stat">{results[i].count || 0}</strong>
            </div>
          ),
        )}
      </div>
      <div className="panel">
        <h2>Do link para a sua vitrine</h2>
        <p>
          Cadastre um título e sua descrição, cole o link oficial da Amazon e selecione uma
          categoria. Você pode salvar como rascunho antes de publicar.
        </p>
        <Link className="text-link" href="/admin/produtos/novo">
          Criar uma nova descoberta →
        </Link>
      </div>
    </>
  );
}

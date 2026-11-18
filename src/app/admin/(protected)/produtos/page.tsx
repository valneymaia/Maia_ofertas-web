import Link from 'next/link';
import { listAdminProducts } from '@/features/admin';
import { statusAction } from '@/app/admin/actions';
import { ConfirmButton } from '@/components/admin-forms';
const statusNames = { draft: 'Rascunho', published: 'Publicado', archived: 'Arquivado' };
export default async function ProductsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ sucesso?: string; erro?: string }>;
}) {
  const products = await listAdminProducts();
  const params = await searchParams;
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">CATÁLOGO</span>
          <h1>Seus produtos</h1>
        </div>
        <Link href="/admin/produtos/novo" className="button orange">
          + Cadastrar produto
        </Link>
      </div>
      {params.sucesso && (
        <p className="message success" role="status">
          Produto atualizado. A vitrine já reflete a alteração.
        </p>
      )}
      {params.erro && (
        <p className="message error" role="alert">
          Não foi possível alterar o produto. Confira os dados e tente novamente.
        </p>
      )}
      <p className="muted">
        Exibindo os 200 produtos mais recentes. Produtos arquivados ficam fora da vitrine.
      </p>
      <div className="admin-products">
        {!products.length && (
          <div className="panel">
            <h2>Sua primeira descoberta começa aqui.</h2>
            <p>Cadastre um produto com seu link de afiliado.</p>
          </div>
        )}
        {products.map((p) => (
          <article key={p.id} className="panel admin-product">
            <div>
              <span className={`status-badge status-${p.status}`}>{statusNames[p.status]}</span>
              <h2>{p.title}</h2>
              <small>
                Atualizado em{' '}
                {new Intl.DateTimeFormat('pt-BR', {
                  timeZone: 'America/Fortaleza',
                  dateStyle: 'short',
                }).format(new Date(p.updated_at))}
              </small>
            </div>
            <div className="row-actions">
              <Link href={`/admin/produtos/${p.id}/editar`} className="small-button">
                Editar
              </Link>
              {p.status === 'published' && (
                <Link href={`/produto/${p.slug}`} className="small-button">
                  Ver no site
                </Link>
              )}
              <form action={statusAction}>
                <input type="hidden" name="id" value={p.id} />
                <input
                  type="hidden"
                  name="status"
                  value={p.status === 'published' ? 'draft' : 'published'}
                />
                <ConfirmButton
                  message={
                    p.status === 'published'
                      ? 'Retirar este produto da vitrine e voltar para rascunho?'
                      : 'Publicar este produto na vitrine?'
                  }
                >
                  {p.status === 'published' ? 'Despublicar' : 'Publicar'}
                </ConfirmButton>
              </form>
              {p.status !== 'archived' && (
                <form action={statusAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="status" value="archived" />
                  <ConfirmButton message="Arquivar este produto? Ele sairá da vitrine.">
                    Arquivar
                  </ConfirmButton>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

import { CategoryForm, ConfirmButton } from '@/components/admin-forms';
import { listAdminCategories } from '@/features/admin';
import { deleteCategoryAction } from '@/app/admin/actions';
export default async function CategoriesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
}) {
  const categories = await listAdminCategories();
  const p = await searchParams;
  return (
    <>
      <div className="page-title">
        <span className="eyebrow">ORGANIZAÇÃO</span>
        <h1>Categorias</h1>
        <p>
          Organize sua vitrine. Categorias com produtos precisam ser esvaziadas antes de desativar
          ou excluir.
        </p>
      </div>
      {p.erro && (
        <p role="alert" className="message error">
          Não foi possível excluir. Realocar os produtos associados e tentar novamente.
        </p>
      )}
      {p.sucesso && (
        <p role="status" className="message success">
          Categoria excluída.
        </p>
      )}
      <CategoryForm />
      {categories.map((c) => (
        <div key={c.id}>
          <CategoryForm category={c} />
          <form action={deleteCategoryAction} className="delete-category">
            <input type="hidden" name="id" value={c.id} />
            <ConfirmButton
              message={`Excluir a categoria ${c.name}? Esta ação só será permitida se ela estiver vazia.`}
            >
              Excluir categoria vazia
            </ConfirmButton>
          </form>
        </div>
      ))}
    </>
  );
}

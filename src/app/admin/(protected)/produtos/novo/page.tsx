import { ProductForm } from '@/components/admin-forms';
import { listAdminCategories } from '@/features/admin';
export default async function NewProduct() {
  return (
    <>
      <div className="page-title">
        <span className="eyebrow">NOVA DESCOBERTA</span>
        <h1>Cadastrar produto</h1>
        <p>Cole seu link de afiliado e escreva o que torna essa escolha interessante.</p>
      </div>
      <ProductForm categories={await listAdminCategories()} />
    </>
  );
}

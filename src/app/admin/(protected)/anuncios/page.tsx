import { AdGenerator } from '@/components/ad-generator';
import { listAdminCategories } from '@/features/admin';

export default async function AdGeneratorPage() {
  const categories = await listAdminCategories();
  return (
    <>
      <div className="page-title">
        <span className="eyebrow">FERRAMENTA DE CURADORIA</span>
        <h1>Gerar anúncio</h1>
        <p>
          Cole o link de afiliado, informe o nome do produto e escolha uma categoria. O gerador
          prepara um texto inicial para revisar antes de salvar como rascunho.
        </p>
      </div>
      <AdGenerator categories={categories.filter((category) => category.is_active)} />
    </>
  );
}

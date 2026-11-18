import { notFound } from 'next/navigation';
import { z } from 'zod';
import { ProductForm } from '@/components/admin-forms';
import { listAdminCategories } from '@/features/admin';
import { requireAdmin } from '@/lib/auth';
import type { Product } from '@/types/domain';
export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { db } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { data, error } = await db.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error('Não foi possível carregar o produto.');
  if (!data) notFound();
  return (
    <>
      <div className="page-title">
        <span className="eyebrow">CURADORIA</span>
        <h1>Editar produto</h1>
      </div>
      <ProductForm product={data as Product} categories={await listAdminCategories()} />
    </>
  );
}

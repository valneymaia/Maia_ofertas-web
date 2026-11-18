import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('@/lib/config', () => ({ getConfig: vi.fn(() => ({ demo: true, configured: false })) }));
vi.mock('@/lib/supabase', () => ({ publicDb: vi.fn() }));
import { getConfig } from '@/lib/config';
import { listPublishedProducts, getProductBySlug } from '@/features/catalog';
import { demoProducts } from '@/data/demo';
describe('catálogo com fixtures isoladas', () => {
  beforeEach(() => {
    vi.mocked(getConfig).mockReturnValue({ demo: true, configured: false } as ReturnType<
      typeof getConfig
    >);
  });
  it('combina busca e categoria sem acentos', async () => {
    const r = await listPublishedProducts({ q: 'TECLÁDO', category: 'informatica' });
    expect(r.products).toHaveLength(1);
  });
  it('não retorna categoria inexistente', async () =>
    expect((await listPublishedProducts({ category: 'invalid' })).count).toBe(0));
  it('limita paginação', async () => {
    const r = await listPublishedProducts({ limit: 1000, page: -1 });
    expect(r.limit).toBe(24);
    expect(r.page).toBe(1);
  });
  it('oculta rascunhos e arquivados', async () => {
    const original = demoProducts[0].status;
    try {
      for (const status of ['draft', 'archived'] as const) {
        demoProducts[0].status = status;
        expect(
          (await listPublishedProducts()).products.some((p) => p.id === demoProducts[0].id),
        ).toBe(false);
        expect(await getProductBySlug(demoProducts[0].slug)).toBeNull();
      }
    } finally {
      demoProducts[0].status = original;
    }
  });
});

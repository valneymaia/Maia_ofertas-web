import { describe, expect, it, vi } from 'vitest';
const { getUser, from } = vi.hoisted(() => ({ getUser: vi.fn(), from: vi.fn() }));
vi.mock('@/lib/config', () => ({ getConfig: () => ({ configured: true }) }));
vi.mock('@/lib/supabase', () => ({ sessionDb: async () => ({ auth: { getUser }, from }) }));
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`redirect:${url}`);
  },
}));
import { requireAdmin } from '@/lib/auth';
describe('autorização no servidor', () => {
  it('recusa visitante', async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(requireAdmin()).rejects.toThrow('redirect:/admin/login');
  });
  it('recusa conta sem concessão administrativa', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'user' } }, error: null });
    from.mockReturnValue({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }),
    });
    await expect(requireAdmin()).rejects.toThrow('acesso');
  });
  it('aceita usuário validado e provisionado', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'admin' } }, error: null });
    from.mockReturnValue({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { user_id: 'admin' } }) }) }),
    });
    expect((await requireAdmin()).user.id).toBe('admin');
  });
});

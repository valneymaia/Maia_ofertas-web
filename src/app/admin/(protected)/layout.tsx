import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '../actions';
import { Logo } from '@/components/layout';
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo />
        <span className="eyebrow">PAINEL DE CURADORIA</span>
        <nav aria-label="Administração">
          <Link href="/admin">Visão geral</Link>
          <Link href="/admin/produtos">Produtos</Link>
          <Link href="/admin/categorias">Categorias</Link>
          <Link href="/">Ver vitrine ↗</Link>
        </nav>
        <div className="admin-user">
          <small>{user.email}</small>
          <form action={logoutAction}>
            <button type="submit" className="small-button">
              Sair da conta
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}

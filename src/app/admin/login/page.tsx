import Link from 'next/link';
import { Logo } from '@/components/layout';
import { LoginForm } from '@/components/admin-forms';
import { getConfig } from '@/lib/config';
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { configured } = getConfig();
  const { erro } = await searchParams;
  return (
    <div className="login-page">
      <div className="login-card">
        <Logo />
        <span className="eyebrow">ÁREA RESTRITA</span>
        <h1>Seu espaço de curadoria.</h1>
        <p className="muted">
          Entre para cadastrar seus produtos e gerenciar os links de afiliado.
        </p>
        {!configured && (
          <p className="message error" role="alert">
            O painel precisa da configuração do Supabase. Consulte o README para conectar o banco e
            provisionar seu administrador.
          </p>
        )}
        {erro && (
          <p className="message error" role="alert">
            Esta conta não tem permissão de administrador.
          </p>
        )}
        <LoginForm configured={configured} />
        <Link href="/" className="text-link">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}

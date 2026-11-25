import Link from 'next/link';
import { ArrowUpRight, Search, Tag, Send, ShieldCheck } from 'lucide-react';
import { getConfig } from '@/lib/config';

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="MaiaOfertas — início">
      <span className="logo-symbol">
        <Tag size={23} strokeWidth={2.5} />
      </span>
      <span>
        maia<span className="logo-light">ofertas</span>
        <span className="logo-dot">.</span>
      </span>
    </Link>
  );
}
export function SearchBar({ value = '' }: { value?: string }) {
  return (
    <form action="/ofertas" className="search" role="search">
      <Search size={19} aria-hidden="true" />
      <label htmlFor="site-search" className="sr-only">
        Buscar produtos
      </label>
      <input
        id="site-search"
        name="q"
        defaultValue={value}
        maxLength={100}
        placeholder="O que você está procurando?"
      />
      <button type="submit" aria-label="Buscar">
        <ArrowUpRight size={19} />
      </button>
    </form>
  );
}
export function SiteHeader() {
  const { telegram } = getConfig();
  return (
    <>
      <div className="topbar">
        <span>Boas escolhas começam com boas descobertas.</span>
        <span>
          <ShieldCheck size={13} /> Curadoria independente
        </span>
      </div>
      <header className="header">
        <div className="container header-main">
          <Logo />
          <SearchBar />
          <nav className="desktop-nav" aria-label="Navegação principal">
            <Link href="/ofertas">Explorar ofertas</Link>
            <Link href="/admin/login" className="header-admin-link">
              Entrar
            </Link>
            {telegram && (
              <a href={telegram} className="telegram-link" target="_blank" rel="noopener">
                <Send size={16} /> Nosso Telegram
              </a>
            )}
          </nav>
          <details className="mobile-nav">
            <summary>Menu</summary>
            <nav aria-label="Navegação mobile">
              <Link href="/ofertas">Explorar ofertas</Link>
              <Link href="/sobre">Sobre o MaiaOfertas</Link>
              <Link href="/admin/login">Entrar no painel</Link>
              {telegram && <a href={telegram}>Nosso Telegram</a>}
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? 'disclosure compact' : 'disclosure'}>
      <ShieldCheck size={16} aria-hidden="true" />
      <span>
        Como associado da Amazon, eu ganho com compras qualificadas.
        {!compact && ' Os links de produtos são publicitários.'}
      </span>
    </p>
  );
}
export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Logo />
            <p>
              Uma curadoria de descobertas.
              <br />
              Mais simples de encontrar. Melhor de escolher.
            </p>
          </div>
          <nav aria-label="Institucional">
            <Link href="/sobre">Sobre nós</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/politica-de-privacidade">Privacidade</Link>
            <Link href="/termos-de-uso">Termos de uso</Link>
          </nav>
        </div>
        <AffiliateDisclosure />
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MaiaOfertas. Curadoria independente.</span>
          <span>Você escolhe aqui. Compra na Amazon.</span>
        </div>
      </div>
    </footer>
  );
}
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Você está em" className="breadcrumbs">
      <Link href="/">Início</Link>
      {items.map((item, i) => (
        <span key={i}>
          {' '}
          /{' '}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

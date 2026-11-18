import { SiteHeader, SiteFooter } from '@/components/layout';
import { getConfig } from '@/lib/config';
import { StructuredData } from '@/components/structured-data';
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = getConfig();
  return (
    <>
      <SiteHeader />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'MaiaOfertas',
          url: config.siteUrl,
          inLanguage: 'pt-BR',
          description: 'Curadoria independente de produtos com links de associado Amazon.',
        }}
      />
      {config.demo && (
        <div className="demo-banner">
          Ambiente de demonstração — produtos ilustrativos e links de compra desativados.
        </div>
      )}
      {!config.configured && !config.demo && (
        <div className="demo-banner">
          Desenvolvimento local: configure o Supabase para cadastrar e publicar seus produtos.
        </div>
      )}
      <main id="conteudo">{children}</main>
      <SiteFooter />
    </>
  );
}

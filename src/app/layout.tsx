import type { Metadata } from 'next';
import { getConfig } from '@/lib/config';
import './globals.css';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { siteUrl } = getConfig();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'MaiaOfertas | Boas descobertas para o seu dia',
      template: '%s | MaiaOfertas',
    },
    description:
      'Descubra produtos com curadoria independente e links de associado para comprar na Amazon Brasil.',
    openGraph: { type: 'website', locale: 'pt_BR', siteName: 'MaiaOfertas' },
    twitter: { card: 'summary' },
  };
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}

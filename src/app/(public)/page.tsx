import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MousePointer2,
  ScanLine,
  Sparkles,
  Tag,
} from 'lucide-react';
import { getFeaturedProducts, listCategories, listPublishedProducts } from '@/features/catalog';
import { CategoryNavigation, ProductGrid } from '@/components/products';
import { AffiliateDisclosure } from '@/components/layout';
import { getConfig } from '@/lib/config';

export const metadata = { alternates: { canonical: '/' } };
export default async function Home() {
  const [categories, featured, recent] = await Promise.all([
    listCategories(),
    getFeaturedProducts(),
    listPublishedProducts({ limit: 6 }),
  ]);
  const { demo, telegram } = getConfig();
  return (
    <>
      <div className="category-strip">
        <div className="container">
          <CategoryNavigation categories={categories} />
        </div>
      </div>
      <div className="container">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> SUA PRÓXIMA BOA DESCOBERTA
            </span>
            <h1>
              Menos procura.
              <br />
              Mais <span>boas escolhas.</span>
            </h1>
            <p>
              Produtos que fazem sentido para o seu dia.
              <br className="desktop-break" /> A gente seleciona. Você descobre e escolhe na Amazon.
            </p>
            <div className="hero-actions">
              <Link href="/ofertas" className="button orange">
                Explorar descobertas <ArrowUpRight size={19} />
              </Link>
              <Link href="/sobre" className="hero-about">
                Conheça o MaiaOfertas <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-trust">
              <span>
                <Check size={15} /> Curadoria independente
              </span>
              <span>
                <Check size={15} /> Compra na Amazon
              </span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-circle" />
            <div className="floating-pill pill-top">
              <Sparkles size={16} /> Escolhido a dedo
            </div>
            <div className="discovery-card">
              <div className="mini-logo">
                <Tag size={22} /> maiaofertas.
              </div>
              <div className="discovery-line" />
              <div className="discovery-tag">
                <Tag size={89} strokeWidth={1.1} />
              </div>
              <div className="discovery-bottom">
                <span>
                  Uma boa descoberta
                  <br />
                  <strong>muda o seu dia.</strong>
                </span>
                <span className="small-arrow">
                  <ArrowUpRight size={22} />
                </span>
              </div>
            </div>
            <div className="floating-pill pill-bottom">
              <span className="orange-square">
                <MousePointer2 size={20} />
              </span>
              <span>
                Gostou? O próximo passo
                <br />
                <strong>é direto na Amazon.</strong>
              </span>
            </div>
            <span className="art-plus plus-one">+</span>
            <span className="art-plus plus-two">+</span>
          </div>
        </section>
        <div className="value-strip">
          <span>
            <ScanLine size={20} />
            <span>
              <strong>Curadoria com propósito</strong>
              <small>Escolhas úteis para a sua rotina</small>
            </span>
          </span>
          <span>
            <MousePointer2 size={20} />
            <span>
              <strong>Direto para a Amazon</strong>
              <small>Consulte os detalhes antes de comprar</small>
            </span>
          </span>
          <span>
            <Tag size={20} />
            <span>
              <strong>Transparência sempre</strong>
              <small>Links de associado identificados</small>
            </span>
          </span>
        </div>
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">VALE A DESCOBERTA</span>
              <h2>
                Na seleção do Maia<span className="orange-text">.</span>
              </h2>
              <p>Um olhar atento para o que pode fazer a diferença no seu dia.</p>
            </div>
            <Link href="/ofertas?ordem=destaques" className="text-link">
              Ver todas as escolhas <ArrowRight size={17} />
            </Link>
          </div>
          <ProductGrid products={featured.products} categories={categories} demo={demo} />
        </section>
        <section className="editorial-band">
          <div>
            <span className="eyebrow">ESCOLHER FICOU MAIS SIMPLES</span>
            <h2>
              Seu dia tem muitas escolhas.
              <br />A próxima pode começar aqui.
            </h2>
          </div>
          <Link href="/ofertas" className="button light">
            Encontre sua descoberta <ArrowUpRight size={18} />
          </Link>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PARA EXPLORAR COM CALMA</span>
              <h2>Mais descobertas para você</h2>
            </div>
            <Link href="/ofertas" className="text-link">
              Explorar catálogo <ArrowRight size={17} />
            </Link>
          </div>
          <ProductGrid products={recent.products} categories={categories} demo={demo} />
        </section>
        {telegram && (
          <section className="telegram-band">
            <div>
              <h2>As descobertas também estão no Telegram.</h2>
              <p>Acompanhe as publicações do nosso canal.</p>
            </div>
            <a href={telegram} className="button navy" target="_blank" rel="noopener">
              Conhecer o canal <ArrowUpRight size={18} />
            </a>
          </section>
        )}
        <AffiliateDisclosure />
      </div>
    </>
  );
}

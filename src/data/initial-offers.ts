import links from './initial-links.json';
import type { Product } from '@/types/domain';
import { demoCategories } from './demo';

// Produtos reais fornecidos pelo proprietário. Conteúdo editorial e ilustrações próprios.
export const initialProducts: Product[] = [
  {
    title: 'PlayStation 5 Slim Digital 825 GB — Gran Turismo',
    slug: 'playstation-5-slim-digital-825gb',
    asin: 'B0FPGF9J2J',
    summary:
      'Uma opção para quem quer explorar jogos no console. Confira os itens do pacote e os detalhes da edição na Amazon.',
    description:
      'Se você está escolhendo um console para a sala, vale conferir esta edição do PlayStation 5 Slim Digital. Antes de comprar, compare os recursos da versão digital com a sua forma de jogar.\n\nVerifique na página da Amazon os itens incluídos, as condições da oferta, a garantia e as informações do vendedor.',
    category_id: demoCategories[0].id,
  },
  {
    title: 'Ar-condicionado Samsung WindFree Inverter 9.000 BTU',
    slug: 'ar-condicionado-samsung-windfree-9000',
    asin: 'B0GM1XDLLM',
    summary:
      'Uma opção para planejar o conforto da sua casa. Confira a voltagem, as medidas e as condições de instalação na Amazon.',
    description:
      'Na escolha de um ar-condicionado, considere o tamanho do ambiente e a orientação de um profissional para dimensionar a capacidade necessária.\n\nConfira na Amazon a especificação exata deste modelo Samsung WindFree, a voltagem, os itens incluídos e as condições de instalação e garantia antes de decidir.',
    category_id: demoCategories[2].id,
  },
].map((p, i) => ({
  ...p,
  id: `20000000-0000-4000-8000-00000000000${i + 1}`,
  affiliate_url: links[i].affiliate_url,
  image_url: links[i].image_url,
  image_source: 'amazon_metadata',
  is_featured: true,
  status: 'published',
  created_at: '2026-11-18T18:00:00Z',
  updated_at: '2026-11-18T18:00:00Z',
  published_at: '2026-11-18T18:00:00Z',
}));

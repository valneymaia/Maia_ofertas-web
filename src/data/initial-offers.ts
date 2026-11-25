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
  {
    title: 'Placa-mãe MSI B550M-A PRO AMD B550 AM4 Micro ATX DDR4',
    slug: 'placa-mae-msi-b550m-a-pro',
    asin: 'B08MWFDPMS',
    summary:
      'Uma opção de placa-mãe para montar ou atualizar um computador com processadores AMD AM4. Confira a compatibilidade dos componentes na Amazon.',
    description:
      'A MSI B550M-A PRO usa o chipset AMD B550 e formato Micro ATX. Antes de escolher, confira a compatibilidade com o processador, a memória, o gabinete e os demais componentes. Consulte na Amazon a ficha e as condições atuais do anúncio.',
    category_id: demoCategories[1].id,
  },
  {
    title: 'Sony PlayStation 5 Edição Digital 825GB com 1 Controle Branco',
    slug: 'playstation-5-edicao-digital-825gb-branco',
    asin: 'B0GWNKJDCZ',
    summary:
      'Console PlayStation 5 Edição Digital com armazenamento de 825 GB e controle branco. Confira os itens e detalhes da edição na Amazon.',
    description:
      'Esta edição digital do PlayStation 5 tem SSD de 825 GB e acompanha um controle sem fio DualSense branco. Confira na Amazon os itens incluídos, a compatibilidade dos jogos e as condições do vendedor antes de comprar.',
    category_id: demoCategories[0].id,
  },
].map((p, i) => ({
  ...p,
  id: `20000000-0000-4000-8000-00000000000${i + 1}`,
  affiliate_url: links[i].affiliate_url,
  image_url: links[i].image_url,
  image_source: links[i].image_url ? ('amazon_metadata' as const) : ('placeholder' as const),
  is_featured: true,
  status: 'published',
  created_at: '2026-11-18T18:00:00Z',
  updated_at: '2026-11-18T18:00:00Z',
  published_at: '2026-11-18T18:00:00Z',
}));

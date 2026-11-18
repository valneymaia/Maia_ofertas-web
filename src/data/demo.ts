import type { Category, Product } from '@/types/domain';

export const demoCategories: Category[] = [
  ['Eletrônicos', 'eletronicos', 'Tecnologia que faz parte da sua rotina.'],
  ['Informática', 'informatica', 'Escolhas para trabalhar, estudar e criar.'],
  ['Casa e cozinha', 'casa-e-cozinha', 'Boas ideias para o seu espaço.'],
  ['Acessórios', 'acessorios', 'Detalhes úteis para o dia a dia.'],
  ['Beleza', 'beleza', 'Cuidados e bem-estar com escolhas conscientes.'],
  ['Moda', 'moda', 'Peças e acessórios para o seu estilo.'],
  ['Outros', 'outros', 'Mais descobertas da nossa curadoria.'],
].map(([name, slug, description], i) => ({
  id: `00000000-0000-4000-8000-00000000000${i + 1}`,
  name,
  slug,
  description,
  display_order: i,
  is_active: true,
}));
const titles = [
  [
    'Fone sem fio para acompanhar seu dia',
    'eletronicos',
    'Uma seleção de exemplo para quem gosta de ouvir música e podcasts com liberdade.',
  ],
  [
    'Teclado compacto para o seu espaço',
    'informatica',
    'Uma ideia de produto para organizar a mesa e deixar a rotina de trabalho mais confortável.',
  ],
  [
    'Cafeteira para uma pausa bem feita',
    'casa-e-cozinha',
    'Um exemplo de curadoria para tornar o ritual do café ainda mais especial.',
  ],
  [
    'Luminária para transformar o ambiente',
    'casa-e-cozinha',
    'Uma seleção ilustrativa para trazer uma iluminação acolhedora para a sua casa.',
  ],
  [
    'Mochila para levar o essencial',
    'acessorios',
    'Uma ideia de acessório para acompanhar seus trajetos e organizar o que importa.',
  ],
  [
    'Caixa de som para os seus momentos',
    'eletronicos',
    'Um produto ilustrativo para descobrir opções de áudio para o dia a dia.',
  ],
];
export const demoProducts: Product[] = titles.map(([title, category, summary], i) => ({
  id: `10000000-0000-4000-8000-00000000000${i + 1}`,
  title,
  slug: ['fone-sem-fio', 'teclado-compacto', 'cafeteira', 'luminaria', 'mochila', 'caixa-de-som'][
    i
  ],
  summary,
  description: `${summary}\n\nEste produto é uma demonstração de desenvolvimento, sem preço, marca ou disponibilidade reais. Ao cadastrar um produto, inclua sua descrição original e o link de afiliado gerado pela Amazon.`,
  asin: null,
  affiliate_url: 'https://www.amazon.com.br/dp/B000000001?tag=demonstracao-20',
  image_url: null,
  image_source: 'placeholder',
  category_id: demoCategories.find((c) => c.slug === category)!.id,
  is_featured: i < 3,
  status: 'published',
  created_at: '2026-11-18T12:00:00Z',
  updated_at: '2026-11-18T12:00:00Z',
  published_at: '2026-11-18T12:00:00Z',
}));

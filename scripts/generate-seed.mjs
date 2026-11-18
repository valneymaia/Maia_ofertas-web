import { readFileSync, writeFileSync } from 'node:fs';
const links = JSON.parse(
  readFileSync(new URL('../src/data/initial-links.json', import.meta.url), 'utf8').replace(
    /^\uFEFF/,
    '',
  ),
);
const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
const items = [
  {
    title: 'PlayStation 5 Slim Digital 825 GB — Gran Turismo',
    slug: 'playstation-5-slim-digital-825gb',
    asin: 'B0FPGF9J2J',
    category: 'eletronicos',
    summary:
      'Uma opção para explorar jogos no console. Confira os itens do pacote e os detalhes da edição na Amazon.',
    description:
      'Antes de escolher este console, compare os recursos da versão digital com a sua forma de jogar. Confira os itens incluídos, as condições de garantia e as informações do vendedor na Amazon.',
  },
  {
    title: 'Ar-condicionado Samsung WindFree Inverter 9.000 BTU',
    slug: 'ar-condicionado-samsung-windfree-9000',
    asin: 'B0GM1XDLLM',
    category: 'casa-e-cozinha',
    summary:
      'Uma opção para planejar o conforto da sua casa. Confira a voltagem, as medidas e as condições de instalação na Amazon.',
    description:
      'Considere o tamanho do ambiente e a orientação de um profissional para dimensionar a capacidade necessária. Confira na Amazon a especificação exata do modelo, a voltagem, os itens incluídos e as condições de instalação e garantia.',
  },
];
const sql =
  '-- Carga opcional: dois produtos e links reais fornecidos pelo proprietário.\n-- Aplicar após todas as migrations; imagens por URL original da Amazon.\nbegin;\n' +
  items
    .map(
      (p, i) =>
        `insert into public.products(title,slug,summary,description,asin,affiliate_url,image_url,image_source,category_id,is_featured,status)\nselect ${[p.title, p.slug, p.summary, p.description, p.asin, links[i].affiliate_url, links[i].image_url, 'amazon_metadata'].map(quote).join(',')}, id, true, 'published' from public.categories where slug = ${quote(p.category)}\non conflict(slug) do update set image_url = excluded.image_url, image_source = excluded.image_source;`,
    )
    .join('\n') +
  '\ncommit;\n';
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql);
console.log('supabase/seed.sql gerado com os links originais e tags preservadas.');

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
  {
    title: 'Placa-mãe MSI B550M-A PRO AMD B550 AM4 Micro ATX DDR4',
    slug: 'placa-mae-msi-b550m-a-pro',
    asin: 'B08MWFDPMS',
    category: 'informatica',
    summary:
      'Uma opção de placa-mãe para montar ou atualizar um computador com processadores AMD AM4. Confira a compatibilidade dos componentes na Amazon.',
    description:
      'A MSI B550M-A PRO usa o chipset AMD B550 e formato Micro ATX. Antes de escolher, confira a compatibilidade com o processador, a memória, o gabinete e os demais componentes. Consulte na Amazon a ficha e as condições atuais do anúncio.',
  },
  {
    title: 'Sony PlayStation 5 Edição Digital 825GB com 1 Controle Branco',
    slug: 'playstation-5-edicao-digital-825gb-branco',
    asin: 'B0GWNKJDCZ',
    category: 'eletronicos',
    summary:
      'Console PlayStation 5 Edição Digital com armazenamento de 825 GB e controle branco. Confira os itens e detalhes da edição na Amazon.',
    description:
      'Esta edição digital do PlayStation 5 tem SSD de 825 GB e acompanha um controle sem fio DualSense branco. Confira na Amazon os itens incluídos, a compatibilidade dos jogos e as condições do vendedor antes de comprar.',
  },
];
const sql =
  '-- Carga opcional: quatro produtos e links reais fornecidos pelo proprietário.\n-- Aplicar após todas as migrations; imagens por URL original da Amazon quando disponíveis.\nbegin;\n' +
  items
    .map((p, i) => {
      const imageUrl = links[i].image_url ? quote(links[i].image_url) : 'null';
      const imageSource = links[i].image_url ? 'amazon_metadata' : 'placeholder';
      const fields = [p.title, p.slug, p.summary, p.description, p.asin, links[i].affiliate_url]
        .map(quote)
        .join(',');
      return `insert into public.products(title,slug,summary,description,asin,affiliate_url,image_url,image_source,category_id,is_featured,status)\nselect ${fields}, ${imageUrl}, ${quote(imageSource)}, id, true, 'published' from public.categories where slug = ${quote(p.category)}\non conflict(slug) do update set affiliate_url = excluded.affiliate_url, image_url = excluded.image_url, image_source = excluded.image_source;`;
    })
    .join('\n') +
  '\ncommit;\n';
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql);
console.log('supabase/seed.sql gerado com os links originais e tags preservadas.');

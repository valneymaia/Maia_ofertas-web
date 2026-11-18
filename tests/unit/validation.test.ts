import { describe, expect, it } from 'vitest';
import { validateAmazonAffiliateUrl } from '@/lib/amazon';
import { productSchema, categorySchema, slugify, normalizeSearch } from '@/lib/validators';
import { initialProducts } from '@/data/initial-offers';

const valid = 'https://www.amazon.com.br/dp/B0FPGF9J2J?tag=valneymaia05-20&linkCode=sl2';
describe('links de associado', () => {
  it('preserva URL e tag integralmente', () =>
    expect(validateAmazonAffiliateUrl(valid)).toBe(valid));
  it('aceita os dois links reais verificados sem abrir a Amazon', () =>
    initialProducts.forEach((p) =>
      expect(validateAmazonAffiliateUrl(p.affiliate_url)).toBe(p.affiliate_url),
    ));
  it.each([
    'javascript:alert(1)',
    'data:text/html,test',
    valid.replace('https:', 'http:'),
    valid.replace('www.amazon.com.br', 'amazon.com.br.evil.com'),
    valid.replace('www.amazon.com.br', 'evil-amazon.com.br'),
    valid.replace('www.amazon.com.br', 'www.amazon.com.br@evil.com'),
    valid.replace('www.amazon.com.br', 'user:pass@www.amazon.com.br'),
    valid.replace('www.amazon.com.br', 'www.amazon.com.br:8080'),
    valid.replace('www.amazon.com.br', 'www.amazon.com.br:443'),
    valid.replace('www.amazon.com.br', 'www.amazon.com.br.'),
    valid.replace('?tag=valneymaia05-20', '?other=1'),
    `${valid}&tag=outro-20`,
    `${valid}&%74ag=outro-20`,
    `${valid}&redirect=https://evil.com`,
    valid.replace('/dp/B0FPGF9J2J', '/gp/redirect.html'),
    ` ${valid}`,
    `${valid}\n`,
    'https://amzn.to/abcde',
    'https://link.amazon/B0929exza',
  ])('rejeita entrada perigosa ou não verificável: %s', (input) =>
    expect(() => validateAmazonAffiliateUrl(input)).toThrow(),
  );
});
describe('validações de catálogo', () => {
  const product = {
    ...initialProducts[0],
    asin: initialProducts[0].asin || '',
    image_url: '',
    image_source: 'placeholder',
  };
  it('valida produto para publicação', () =>
    expect(productSchema.safeParse(product).success).toBe(true));
  it('rejeita ASIN divergente', () =>
    expect(productSchema.safeParse({ ...product, asin: 'B000000001' }).success).toBe(false));
  it('exige licença informada para imagem', () =>
    expect(
      productSchema.safeParse({ ...product, image_url: 'https://example.org/image.png' }).success,
    ).toBe(false));
  it('rejeita categoria inválida', () =>
    expect(productSchema.safeParse({ ...product, category_id: 'inexistente' }).success).toBe(
      false,
    ));
  it('valida nome e ordem de categoria', () =>
    expect(
      categorySchema.safeParse({ name: 'a', slug: 'Foo', display_order: -1, is_active: true })
        .success,
    ).toBe(false));
  it('gera slug acentuado', () =>
    expect(slugify('  Casa & Cozinha: seleção! ')).toBe('casa-cozinha-selecao'));
  it('normaliza busca', () => expect(normalizeSearch('  Eletrônicos  ')).toBe('eletronicos'));
});

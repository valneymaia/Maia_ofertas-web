import { describe, expect, it, vi } from 'vitest';
import { extractProductImage, isAmazonImageUrl } from '@/lib/product-image';
import { fetchAmazonProductImage } from '@/lib/amazon-image';
const image = 'https://m.media-amazon.com/images/I/product._AC_SX342_.jpg';
const other = 'https://m.media-amazon.com/images/I/other.jpg';
const affiliate = 'https://www.amazon.com.br/dp/B0FPGF9J2J?tag=valneymaia05-20';
describe('imagem de metadados', () => {
  it('prioriza og:image independentemente da ordem dos atributos', () =>
    expect(
      extractProductImage(
        `<img id="landingImage" src="${other}"><meta content='${image}' property='og:image'>`,
      ),
    ).toBe(image));
  it('aceita twitter:image e atributos sem aspas', () =>
    expect(extractProductImage(`<META NAME=twitter:image CONTENT="${image}">`)).toBe(image));
  it('usa imagem principal quando não existe og:image', () =>
    expect(
      extractProductImage(
        `<img src="${other}"><img data-old-hires="${other}" src="${image}" id="landingImage">`,
      ),
    ).toBe(image));
  it('ignora tags em comentários e strings de scripts', () =>
    expect(
      extractProductImage(
        `<!-- <meta property="og:image" content="${image}"> --><script>const x='<meta property="og:image" content="${other}">';</script>`,
      ),
    ).toBeNull());
  it.each([
    'javascript:alert(1)',
    'https://m.media-amazon.com.evil.com/images/I/x.jpg',
    'https://127.0.0.1/images/I/x.jpg',
    'http://m.media-amazon.com/images/I/x.jpg',
    'https://m.media-amazon.com/images/I/x.svg',
    'https://user:pass@m.media-amazon.com/images/I/x.jpg',
  ])('rejeita imagem externa ou insegura %s', (value) => {
    expect(isAmazonImageUrl(value)).toBe(false);
    expect(extractProductImage(`<meta property="og:image" content="${value}">`)).toBeNull();
  });
  it('retorna null sem imagem sem inventar URL', () =>
    expect(extractProductImage('<html><head></head></html>')).toBeNull());
});
describe('leitura controlada da página', () => {
  it('busca endereço canônico sem tag de afiliado', async () => {
    const request = vi
      .fn()
      .mockResolvedValue(
        new Response(`<meta property="og:image" content="${image}">`, {
          headers: { 'content-type': 'text/html; charset=UTF-8' },
        }),
      );
    expect(await fetchAmazonProductImage(affiliate, request)).toBe(image);
    expect(request).toHaveBeenCalledWith(
      'https://www.amazon.com.br/dp/B0FPGF9J2J',
      expect.objectContaining({ redirect: 'manual' }),
    );
  });
  it.each([301, 403, 503])('não segue redirecionamento/bloqueio %s', async (status) => {
    const request = vi
      .fn()
      .mockResolvedValue(new Response(null, { status, headers: { location: 'https://evil.com' } }));
    expect(await fetchAmazonProductImage(affiliate, request)).toBeNull();
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('limita tamanho da resposta', async () => {
    const request = vi
      .fn()
      .mockResolvedValue(
        new Response('x'.repeat(3_000_001), { headers: { 'content-type': 'text/html' } }),
      );
    expect(await fetchAmazonProductImage(affiliate, request)).toBeNull();
  });
  it('rejeita URL insegura antes de qualquer fetch', async () => {
    const request = vi.fn();
    await expect(fetchAmazonProductImage('https://127.0.0.1/', request)).rejects.toThrow();
    expect(request).not.toHaveBeenCalled();
  });
});

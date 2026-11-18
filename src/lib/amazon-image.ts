import 'server-only';
import { validateAmazonAffiliateUrl } from './amazon';
import { extractProductImage } from './product-image';

/** Importação explícita no cadastro; não roda no catálogo nem contorna bloqueios. */
export async function fetchAmazonProductImage(
  affiliateUrl: string,
  request: typeof fetch = fetch,
): Promise<string | null> {
  validateAmazonAffiliateUrl(affiliateUrl);
  const asin = new URL(affiliateUrl).pathname.match(
    /\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|$)/i,
  )?.[1];
  if (!asin) return null;
  try {
    // Remove parâmetros de afiliado: a consulta de metadados não gera clique de associado.
    const response = await request(`https://www.amazon.com.br/dp/${asin}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
      headers: { Accept: 'text/html', 'Accept-Language': 'pt-BR' },
    });
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
      await response.body?.cancel();
      return null;
    }
    const reader = response.body?.getReader();
    if (!reader) return null;
    const decoder = new TextDecoder();
    let length = 0,
      html = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 3_000_000) {
        await reader.cancel();
        return null;
      }
      html += decoder.decode(value, { stream: true });
    }
    html += decoder.decode();
    return extractProductImage(html);
  } catch {
    return null;
  }
}

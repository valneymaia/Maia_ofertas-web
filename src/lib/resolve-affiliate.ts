import 'server-only';
import { validateAmazonAffiliateUrl } from './amazon';

const shortHosts = new Set(['link.amazon', 'amzlinks.in', 'amzn.to']);
/** Resolve somente encurtadores permitidos. Nunca faz fetch no destino Amazon. */
export async function resolveAffiliateUrl(
  input: string,
  request: typeof fetch = fetch,
): Promise<string> {
  let current = input;
  for (let hop = 0; hop < 5; hop++) {
    let url: URL;
    try {
      url = new URL(current);
    } catch {
      throw new Error('Informe um link válido.');
    }
    if (['www.amazon.com.br', 'amazon.com.br'].includes(url.hostname))
      return validateAmazonAffiliateUrl(current);
    if (
      current !== current.trim() ||
      /[\s\\\u0000-\u001f]/u.test(current) ||
      url.protocol !== 'https:' ||
      url.port ||
      url.username ||
      url.password ||
      !shortHosts.has(url.hostname) ||
      !/^\/[a-zA-Z0-9]{5,32}$/.test(url.pathname) ||
      url.search ||
      url.hash
    ) {
      throw new Error(
        'Cole um link direto da Amazon Brasil ou um link curto oficial link.amazon/amzn.to.',
      );
    }
    const response = await request(url, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    await response.body?.cancel();
    const location = response.headers.get('location');
    if (![301, 302, 303, 307, 308].includes(response.status) || !location)
      throw new Error('Não foi possível verificar o link curto. Use o link completo com sua tag.');
    current = new URL(location, url).href;
  }
  throw new Error('O link excedeu o limite de redirecionamentos. Use o link completo.');
}

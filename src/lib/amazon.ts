import { z } from 'zod';

const hosts = new Set(['amazon.com.br', 'www.amazon.com.br']);
export function validateAmazonAffiliateUrl(input: string): string {
  if (input !== input.trim() || /[\s\\\u0000-\u001f\u007f]/u.test(input)) {
    throw new Error('O link contém espaços ou caracteres inválidos.');
  }
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error('Informe uma URL válida.');
  }
  if (
    url.protocol !== 'https:' ||
    !hosts.has(url.hostname) ||
    url.port ||
    url.username ||
    url.password
  ) {
    throw new Error('Use um link HTTPS direto de amazon.com.br, sem credenciais.');
  }
  if (!/^https:\/\/(?:www\.)?amazon\.com\.br\//i.test(input)) {
    throw new Error('Use o endereço direto da Amazon Brasil, sem atalhos ou porta explícita.');
  }
  const tags = url.searchParams.getAll('tag');
  if (tags.length !== 1 || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{1,98}-20$/.test(tags[0])) {
    throw new Error('O link precisa de uma única tag de associado Amazon Brasil (tag=seu-id-20).');
  }
  if (
    !/^\/(?:[^/?#]+\/)?dp\/[A-Z0-9]{10}(?:\/|$)/i.test(url.pathname) &&
    !/^\/gp\/product\/[A-Z0-9]{10}(?:\/|$)/i.test(url.pathname)
  ) {
    throw new Error(
      'Use um link de produto completo, com /dp/ASIN ou /gp/product/ASIN. Links amzn.to ainda não são aceitos.',
    );
  }
  for (const key of url.searchParams.keys()) {
    if (
      /^(?:url|redirect|redirect_url|redirect_uri|return|returnurl|return_to|destination)$/i.test(
        key,
      )
    ) {
      throw new Error('O link não pode conter um destino de redirecionamento.');
    }
  }
  return input; // Preserva integralmente a tag e os parâmetros fornecidos.
}
export const affiliateUrlSchema = z
  .string()
  .max(2048)
  .transform((value, ctx) => {
    try {
      return validateAmazonAffiliateUrl(value);
    } catch (error) {
      ctx.addIssue({ code: 'custom', message: (error as Error).message });
      return z.NEVER;
    }
  });

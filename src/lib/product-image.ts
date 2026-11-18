import { Parser } from 'htmlparser2';

export function isAmazonImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      !url.port &&
      !url.username &&
      !url.password &&
      [
        'm.media-amazon.com',
        'images-na.ssl-images-amazon.com',
        'images-eu.ssl-images-amazon.com',
      ].includes(url.hostname) &&
      url.pathname.startsWith('/images/I/') &&
      /\.(?:jpe?g|png|webp)$/i.test(url.pathname) &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

/** Lê apenas atributos HTML, sem executar scripts nem baixar a imagem. */
export function extractProductImage(html: string): string | null {
  const candidates: { priority: number; value: string }[] = [];
  const add = (priority: number, value: string | undefined) => {
    if (value && isAmazonImageUrl(value)) candidates.push({ priority, value });
  };
  const parser = new Parser(
    {
      onopentag(name, attributes) {
        if (name === 'meta') {
          const key = (
            attributes.property ||
            attributes.name ||
            attributes.itemprop ||
            ''
          ).toLowerCase();
          if (key === 'og:image' || key === 'og:image:secure_url') add(0, attributes.content);
          if (key === 'twitter:image' || key === 'twitter:image:src') add(1, attributes.content);
          if (key === 'image') add(2, attributes.content);
        }
        if (name === 'link' && attributes.rel?.toLowerCase() === 'image_src')
          add(2, attributes.href);
        if (name === 'img' && attributes.id === 'landingImage') {
          add(3, attributes.src);
          add(4, attributes['data-old-hires']);
        }
      },
    },
    { decodeEntities: true, lowerCaseAttributeNames: true, lowerCaseTags: true },
  );
  parser.end(html);
  candidates.sort((a, b) => a.priority - b.priority);
  return candidates[0]?.value || null;
}

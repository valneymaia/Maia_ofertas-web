import type { MetadataRoute } from 'next';
import { getConfig } from '@/lib/config';
export const dynamic = 'force-dynamic';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: `${getConfig().siteUrl}/sitemap.xml`,
  };
}

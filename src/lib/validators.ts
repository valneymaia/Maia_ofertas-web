import { z } from 'zod';
import { affiliateUrlSchema } from './amazon';

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
export const normalizeSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
const slug = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use letras minúsculas, números e hífens.');
const text = (max: number) => z.string().trim().max(max);
export const categorySchema = z.object({
  name: text(80).min(2),
  slug,
  description: text(1000),
  display_order: z.coerce.number().int().min(0).max(999),
  is_active: z.boolean(),
});
export const productSchema = z
  .object({
    title: text(180).min(3),
    slug,
    summary: text(320).min(10),
    description: text(10000).min(20),
    asin: z
      .union([
        z.literal(''),
        z.string().regex(/^[A-Z0-9]{10}$/, 'ASIN precisa de 10 letras maiúsculas/números.'),
      ])
      .transform((v) => v || null),
    affiliate_url: affiliateUrlSchema,
    image_url: z
      .union([
        z.literal(''),
        z.url().refine((v) => new URL(v).protocol === 'https:', 'A imagem precisa usar HTTPS.'),
      ])
      .transform((v) => v || null),
    image_source: z.enum(['placeholder', 'own', 'licensed']),
    category_id: z.uuid(),
    is_featured: z.boolean(),
    status: z.enum(['draft', 'published', 'archived']),
  })
  .superRefine((v, ctx) => {
    if (Boolean(v.image_url) !== (v.image_source !== 'placeholder'))
      ctx.addIssue({
        code: 'custom',
        path: ['image_url'],
        message: 'Informe a origem da imagem ou utilize a ilustração padrão sem URL.',
      });
    if (v.asin && !new URL(v.affiliate_url).pathname.includes(v.asin))
      ctx.addIssue({
        code: 'custom',
        path: ['asin'],
        message: 'O ASIN não corresponde ao link informado.',
      });
  });
export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(200),
});

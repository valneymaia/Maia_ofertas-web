export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
};
export type Product = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  asin: string | null;
  affiliate_url: string;
  image_url: string | null;
  image_source: 'placeholder' | 'own' | 'licensed' | 'amazon_metadata';
  category_id: string;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

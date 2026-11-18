begin;
create extension if not exists unaccent with schema extensions;
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 80),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 160),
  description text not null default '' check (length(description) <= 1000),
  display_order integer not null default 0 check (display_order between 0 and 999),
  is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 3 and 180),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 160),
  summary text not null check (length(summary) between 10 and 320),
  description text not null check (length(description) between 20 and 10000),
  asin text check (asin ~ '^[A-Z0-9]{10}$'),
  affiliate_url text not null check (length(affiliate_url) <= 2048),
  image_url text check (image_url ~ '^https://'),
  image_source text not null default 'placeholder' check (image_source in ('placeholder','own','licensed')),
  category_id uuid not null references public.categories(id) on delete restrict,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  search_text text not null default '',
  check ((image_url is null and image_source = 'placeholder') or (image_url is not null and image_source <> 'placeholder')),
  check (status <> 'published' or published_at is not null)
);
-- Defesa adicional para escritas diretas no PostgREST, sem depender do formulário.
create function public.guard_product() returns trigger language plpgsql set search_path = '' as $$
declare link text; tag_count integer;
begin
  link := new.affiliate_url;
  if link !~ '^https://(www\.)?amazon\.com\.br/([^/?#]+/)?dp/[A-Za-z0-9]{10}([/?#]|$)'
    and link !~ '^https://(www\.)?amazon\.com\.br/gp/product/[A-Za-z0-9]{10}([/?#]|$)' then
    raise exception 'Link direto Amazon Brasil inválido';
  end if;
  select count(*) into tag_count from regexp_matches(split_part(link, '#', 1), '[?&]tag=', 'g');
  if tag_count <> 1 or split_part(link, '#', 1) !~ '[?&]tag=[A-Za-z0-9][A-Za-z0-9_-]{1,98}-20(&|$)' or link ~ '[[:space:]\\]' or split_part(link, '#', 1) ~ '[?&][^=&]*%[^=&]*=' or link ~* '[?&](url|redirect|redirect_url|redirect_uri|return|returnurl|return_to|destination)=' then
    raise exception 'Identificação de associado ou URL inválida';
  end if;
  if new.asin is not null and position(new.asin in split_part(link, '?', 1)) = 0 then raise exception 'ASIN divergente'; end if;
  if not exists(select 1 from public.categories where id = new.category_id and is_active) then raise exception 'Categoria inexistente ou inativa'; end if;
  new.updated_at := now();
  new.search_text := lower(extensions.unaccent(new.title || ' ' || new.summary));
  if new.status = 'published' then new.published_at := coalesce(new.published_at, now()); else new.published_at := null; end if;
  return new;
end;
$$;
create trigger guard_product before insert or update on public.products for each row execute function public.guard_product();
create function public.guard_category() returns trigger language plpgsql set search_path = '' as $$
begin
  if not new.is_active and exists(select 1 from public.products where category_id = new.id) then raise exception 'Realocar produtos antes de desativar a categoria'; end if;
  new.updated_at := now(); return new;
end;
$$;
create trigger guard_category before update on public.categories for each row execute function public.guard_category();
create index products_public_date_idx on public.products(published_at desc, id) where status = 'published';
create index products_category_status_idx on public.products(category_id, status);
create index products_featured_idx on public.products(published_at desc) where status = 'published' and is_featured;
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
revoke all on public.admin_users from anon, authenticated;
revoke all on public.categories, public.products from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.categories, public.products to anon, authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;
create policy admin_self on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
create policy categories_public on public.categories for select to anon, authenticated using (is_active);
create policy categories_admin on public.categories for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy products_public on public.products for select to anon, authenticated using (status = 'published' and exists(select 1 from public.categories where id = category_id and is_active));
create policy products_admin on public.products for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
insert into public.categories(name, slug, description, display_order) values
 ('Eletrônicos','eletronicos','Tecnologia para a sua rotina.',0),
 ('Informática','informatica','Escolhas para trabalhar, estudar e criar.',1),
 ('Casa e cozinha','casa-e-cozinha','Boas ideias para o seu espaço.',2),
 ('Acessórios','acessorios','Detalhes úteis para o dia a dia.',3),
 ('Beleza','beleza','Cuidados e bem-estar.',4),
 ('Moda','moda','Escolhas para o seu estilo.',5),
 ('Outros','outros','Mais descobertas da nossa curadoria.',6);
commit;

import { createClient } from '@supabase/supabase-js';
import { test, expect } from '@playwright/test';

test('administrador cria rascunho, publica e arquiva', async ({ page, browser }) => {
  const url = process.env.TEST_SUPABASE_URL!;
  if (!['localhost', '127.0.0.1'].includes(new URL(url).hostname))
    throw new Error('Use somente banco local.');
  const db = createClient(url, process.env.TEST_SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const suffix = Date.now();
  const email = `admin-e2e-${suffix}@example.test`,
    password = 'E2E-local-only-admin-password!';
  const slug = `produto-e2e-${suffix}`,
    categorySlug = `categoria-e2e-${suffix}`;
  const created = await db.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error || !created.data.user)
    throw new Error('Não foi possível provisionar usuário local.');
  const userId = created.data.user.id;
  const grant = await db.from('admin_users').insert({ user_id: userId });
  if (grant.error) throw new Error('Aplique as migrations no banco local.');
  const visitor = await browser.newPage();
  try {
    await page.goto('/admin/login');
    await page.getByLabel('E-mail de administrador').fill(email);
    await page.getByLabel('Senha', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Entrar no painel' }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/categorias');
    const categoryForm = page
      .locator('form')
      .filter({ has: page.getByRole('heading', { name: 'Nova categoria' }) });
    await categoryForm.getByLabel('Nome', { exact: true }).fill(`Categoria E2E ${suffix}`);
    await categoryForm.getByLabel('Slug', { exact: true }).fill(categorySlug);
    await categoryForm
      .getByLabel('Descrição', { exact: true })
      .fill('Categoria criada pelo teste administrativo local.');
    await categoryForm.getByRole('button', { name: 'Salvar categoria' }).click();
    await expect(categoryForm.getByRole('status')).toHaveText('Categoria salva.');
    await page.goto('/admin/produtos/novo');
    await page.getByRole('checkbox', { name: /Buscar a imagem do produto/ }).uncheck();
    await page.getByLabel('Nome do produto').fill(`Produto E2E ${suffix}`);
    await page.getByLabel('Endereço amigável (slug)').fill(slug);
    await page
      .getByLabel('Resumo original')
      .fill('Resumo editorial criado pelo teste local isolado.');
    await page
      .getByLabel('Descrição editorial')
      .fill('Descrição original longa o suficiente para criar e verificar este produto de teste.');
    await page
      .getByLabel('Seu link de afiliado da Amazon')
      .fill('https://www.amazon.com.br/dp/B000000001?tag=testeisolado-20');
    const { data: category } = await db
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (!category) throw new Error('Categoria não criada.');
    await page.getByLabel('Categoria', { exact: true }).selectOption(category.id);
    await page.getByRole('button', { name: 'Salvar produto' }).click();
    await expect(page).toHaveURL(/\/admin\/produtos\?sucesso=salvo/);
    await visitor.goto(`http://localhost:3101/produto/${slug}`);
    await expect(
      visitor.getByRole('heading', { name: 'Essa descoberta não está aqui.' }),
    ).toBeVisible();
    const card = page
      .getByRole('article')
      .filter({ has: page.getByRole('heading', { name: `Produto E2E ${suffix}` }) });
    await expect(card.getByText('Rascunho', { exact: true })).toBeVisible();
    page.on('dialog', (dialog) => dialog.accept());
    await card.getByRole('button', { name: 'Publicar', exact: true }).click();
    await expect(card.getByText('Publicado', { exact: true })).toBeVisible();
    await visitor.goto(`http://localhost:3101/produto/${slug}`);
    await expect(visitor.getByRole('heading', { level: 1 })).toHaveText(`Produto E2E ${suffix}`);
    await expect(visitor.getByRole('link', { name: /Ver na Amazon/ })).toHaveAttribute(
      'href',
      /tag=testeisolado-20/,
    );
    await card.getByRole('button', { name: 'Arquivar', exact: true }).click();
    await expect(card.getByText('Arquivado', { exact: true })).toBeVisible();
    await visitor.reload();
    await expect(
      visitor.getByRole('heading', { name: 'Essa descoberta não está aqui.' }),
    ).toBeVisible();
  } finally {
    await visitor.close();
    await db.from('products').delete().eq('slug', slug);
    await db.from('categories').delete().eq('slug', categorySlug);
    await db.auth.admin.deleteUser(userId);
  }
});

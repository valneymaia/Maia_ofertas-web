import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/(?:www\.)?amazon\.com\.br\//, (route) => route.abort());
  await page.route(
    /https:\/\/(?:m\.media-amazon\.com|images-(?:na|eu)\.ssl-images-amazon\.com)\//,
    (route) =>
      route.fulfill({
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="480" height="360" fill="#eef2ed"/></svg>',
      }),
  );
});
test('homepage, busca, categoria e link direto sem navegação automática', async ({ page }) => {
  let outbound = 0;
  page.on('request', (r) => {
    if (new URL(r.url()).hostname.endsWith('amazon.com.br')) outbound++;
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('boas escolhas');
  await page.getByLabel('Buscar produtos').fill('PlayStation');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page).toHaveURL(/q=PlayStation/);
  await expect(page.getByRole('heading', { name: /PlayStation 5/ })).toBeVisible();
  await page
    .getByRole('heading', { name: /PlayStation 5/ })
    .getByRole('link')
    .click();
  const link = page.getByRole('link', { name: /Ver na Amazon/ }).first();
  await expect(link).toHaveAttribute(
    'href',
    /https:\/\/www\.amazon\.com\.br\/.*tag=valneymaia05-20/,
  );
  await expect(link).toHaveAttribute('rel', 'sponsored nofollow noopener');
  expect(outbound).toBe(0);
  await page.goto('/categorias/casa-e-cozinha');
  await expect(page.getByRole('heading', { name: /Samsung WindFree/ })).toBeVisible();
});
test('vazio, 404 e área protegida', async ({ page }) => {
  await page.goto('/ofertas?q=inexistente');
  await expect(page.getByRole('heading', { name: /Nenhum produto/ })).toBeVisible();
  const response = await page.goto('/pagina-inexistente');
  expect(response?.status()).toBe(404);
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByLabel('E-mail de administrador')).toBeVisible();
});
for (const width of [360, 390, 768, 1440]) {
  test(`layout e acessibilidade em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    if (width < 800) {
      await page.getByText('Menu', { exact: true }).click();
      await expect(page.getByRole('navigation', { name: 'Navegação mobile' })).toBeVisible();
    }
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  });
}
test('formulário de login tem labels e configuração explícita', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.getByRole('button', { name: 'Entrar no painel' })).toBeDisabled();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

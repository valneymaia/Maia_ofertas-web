import { defineConfig } from '@playwright/test';
const url = process.env.TEST_SUPABASE_URL;
if (!url || !['localhost', '127.0.0.1'].includes(new URL(url).hostname))
  throw new Error('E2E administrativo exige Supabase LOCAL isolado em .env.test.');
if (!process.env.TEST_SUPABASE_ANON_KEY || !process.env.TEST_SUPABASE_SERVICE_ROLE_KEY)
  throw new Error('Configure as chaves locais em .env.test.');
export default defineConfig({
  testDir: './tests/admin-e2e',
  workers: 1,
  timeout: 90000,
  use: { baseURL: 'http://localhost:3101', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --port 3101',
    url: 'http://localhost:3101/admin/login',
    timeout: 120000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: url,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.TEST_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3101',
      DEMO_MODE: 'false',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
});

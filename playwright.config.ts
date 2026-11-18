import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure' },
  webServer:
    process.env.E2E_EXTERNAL_SERVER === 'true'
      ? undefined
      : {
          command: 'node node_modules/next/dist/bin/next dev --port 3100',
          url: 'http://localhost:3100',
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          env: {
            DEMO_MODE: 'false',
            NEXT_PUBLIC_SUPABASE_URL: '',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
            NEXT_TELEMETRY_DISABLED: '1',
          },
        },
});

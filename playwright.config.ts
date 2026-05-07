import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  webServer: { command: 'npm run dev', url: 'http://localhost:4321', reuseExistingServer: true },
  use: { baseURL: 'http://localhost:4321' },
});

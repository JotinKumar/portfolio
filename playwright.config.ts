import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const webPort = process.env.PLAYWRIGHT_WEB_PORT ?? '3000';
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: skipWebServer
    ? undefined
    : {
        command: `npm run dev -- --port ${webPort}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
});

import { defineConfig, devices } from "@playwright/test";

const appPort = Number(process.env.PLAYWRIGHT_PORT ?? 4173);
const fakeSupabasePort = Number(process.env.PLAYWRIGHT_FAKE_DB_PORT ?? 54329);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node tests/fixtures/fake-supabase.mjs",
      url: `http://127.0.0.1:${fakeSupabasePort}/health`,
      reuseExistingServer: false,
      timeout: 30_000,
      env: {
        FAKE_SUPABASE_PORT: String(fakeSupabasePort),
      },
    },
    {
      command: `npm run dev -- --hostname 127.0.0.1 --port ${appPort}`,
      url: `http://127.0.0.1:${appPort}`,
      reuseExistingServer: false,
      timeout: 180_000,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${fakeSupabasePort}`,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "playwright-public-key",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  ],
});

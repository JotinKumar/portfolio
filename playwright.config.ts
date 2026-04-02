import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const isCI = Boolean(process.env.CI);
const isWindows = process.platform === "win32";
const localChannel = (process.env.PLAYWRIGHT_CHANNEL ?? (isWindows && !isCI ? "msedge" : undefined)) as
  | "chrome"
  | "msedge"
  | undefined;
const chromiumSandbox = process.env.PLAYWRIGHT_CHROMIUM_SANDBOX === "false" ? false : !isCI;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "local-chromium",
      use: {
        browserName: "chromium",
        ...(localChannel ? { channel: localChannel } : {}),
        chromiumSandbox,
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
});

import { defineConfig, devices } from "@playwright/test";

/**
 * E2E suite. Runs against a running app (BIO_BASE_URL, default the dev
 * server on :3200) with a real Postgres. Emails are read from the
 * OutboundEmail table, which is where they land when RESEND_API_KEY is unset.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: process.env.PW_OUTPUT ?? "test-results",
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BIO_BASE_URL ?? "http://localhost:3200",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } }, testIgnore: /mobile\.spec\.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
  webServer: process.env.BIO_BASE_URL
    ? undefined
    : { command: "npm run dev", url: "http://localhost:3200/login", reuseExistingServer: true, timeout: 120_000, env: { RATE_LIMIT_DISABLED: "1" } },
});

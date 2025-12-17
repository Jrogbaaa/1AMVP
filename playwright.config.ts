import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for 1Another MVP
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Mobile viewport for responsive testing
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  // Auto-start Next.js dev server
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      // Ensure auth secrets are available for the dev server
      AUTH_SECRET: process.env.AUTH_SECRET || "dev-test-secret-at-least-32-characters-long",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "dev-test-secret-at-least-32-characters-long",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
      SKIP_ENV_VALIDATION: "true",
    },
  },
});


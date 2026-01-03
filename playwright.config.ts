import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

/**
 * Playwright configuration for 1Another MVP
 * 
 * In CI: Only run Chromium-based tests (faster, no extra browser installs needed)
 * Locally: Run all browsers for comprehensive coverage
 * 
 * @see https://playwright.dev/docs/test-configuration
 */

// Chromium-based projects (work in CI without extra setup)
const chromiumProjects = [
  // Desktop Chrome
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
  // Mobile Chrome emulation (Android)
  {
    name: "mobile-chrome",
    use: { ...devices["Pixel 5"] },
  },
  {
    name: "mobile-chrome-landscape",
    use: { ...devices["Pixel 5 landscape"] },
  },
];

// Additional browsers (require extra install, only run locally)
const additionalBrowserProjects = [
  // Firefox
  {
    name: "firefox",
    use: { ...devices["Desktop Firefox"] },
  },
  // WebKit (Safari)
  {
    name: "webkit",
    use: { ...devices["Desktop Safari"] },
  },
  // Mobile Safari emulation (iOS)
  {
    name: "mobile-safari",
    use: { ...devices["iPhone 12"] },
  },
  {
    name: "mobile-safari-landscape",
    use: { ...devices["iPhone 12 landscape"] },
  },
  // Tablet testing
  {
    name: "tablet-safari",
    use: { ...devices["iPad Pro 11"] },
  },
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // In CI: only Chromium-based tests; Locally: all browsers
  projects: isCI ? chromiumProjects : [...chromiumProjects, ...additionalBrowserProjects],

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


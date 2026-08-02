import { defineConfig, devices } from '@playwright/test'

const externalBaseURL = process.env.PLAYWRIGHT_TEST_BASE_URL

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  outputDir: 'test-results/cross-browser-artifacts',
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'desktop-firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'desktop-webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'hybrid-chromium',
      use: {
        ...devices['Desktop Chrome'],
        hasTouch: true,
      },
    },
  ],
  reporter: process.env.CI
    ? [
        ['github'],
        [
          'html',
          { open: 'never', outputFolder: 'playwright-cross-browser-report' },
        ],
        [
          'json',
          { outputFile: 'test-results/cross-browser-results.json' },
        ],
      ]
    : [
        ['line'],
        [
          'html',
          { open: 'never', outputFolder: 'playwright-cross-browser-report' },
        ],
        [
          'json',
          { outputFile: 'test-results/cross-browser-results.json' },
        ],
      ],
  retries: 0,
  testDir: './tests/cross-browser',
  timeout: 60_000,
  use: {
    baseURL: externalBaseURL ?? 'http://127.0.0.1:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'bun run dev -- --host 127.0.0.1',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        url: 'http://127.0.0.1:3000',
      },
  workers: process.env.CI ? 1 : 2,
})

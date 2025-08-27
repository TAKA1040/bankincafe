import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定ファイル
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* 最大並列実行数 */
  fullyParallel: true,
  /* CI環境でのリトライ設定 */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* 並列ワーカー数 */
  workers: process.env.CI ? 1 : undefined,
  /* レポーター設定 */
  reporter: 'html',
  /* 共通のテスト設定 */
  use: {
    /* ベースURL */
    baseURL: 'http://localhost:3000',
    /* トレース収集 */
    trace: 'on-first-retry',
    /* スクリーンショット */
    screenshot: 'only-on-failure',
    /* ビデオ録画 */
    video: 'retain-on-failure',
  },

  /* ブラウザ設定 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* モバイルテスト */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* ローカル開発サーバー設定 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

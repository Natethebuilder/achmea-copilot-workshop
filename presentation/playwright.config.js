import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.js',
  fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:5218/achmea-copilot-workshop/' },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 5218 --strictPort',
    url: 'http://127.0.0.1:5218/achmea-copilot-workshop/',
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['iPhone SE'], defaultBrowserType: 'chromium' } },
  ],
})

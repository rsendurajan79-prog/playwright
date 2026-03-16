// tests/retry-network.spec.ts
import { test, expect } from '@playwright/test';
import { isNetworkError } from '../support/helpers/networkerrhandler';

test('Retry only on network failure with logs attached', async ({ page }, testInfo) => {
  const consoleLogs: string[] = [];
  const networkLogs: string[] = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('requestfailed', req => {
    networkLogs.push(`FAILED: ${req.url()} - ${req.failure()?.errorText}`);
  });

  try {
    await page.goto('https://www.saucedemo.com/', { timeout: 5000 });

    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page.locator('.title')).toHaveText('Products', { timeout: 3000 });

  } catch (error) {
    await testInfo.attach('console-logs', {
      body: consoleLogs.join('\n'),
      contentType: 'text/plain'
    });

    await testInfo.attach('network-logs', {
      body: networkLogs.join('\n'),
      contentType: 'text/plain'
    });

    if (isNetworkError(error as Error)) {
      testInfo.annotations.push({
        type: 'retry',
        description: 'Retrying due to network failure'
      });
      throw error;
    }

    throw new Error(`Functional failure: ${error}`);
  }
});


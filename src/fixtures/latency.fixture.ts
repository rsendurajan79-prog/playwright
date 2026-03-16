import { test as base } from '@playwright/test';

type MyOptions = {
  mockLatency: boolean;
};
//value can be set to true or false when running the test, default is false from playwright.config as well or command line
export const test = base.extend<MyOptions>({
  mockLatency: [false, { option: true }],   // default value

  page: async ({ page, mockLatency }, use) => {
    if (mockLatency) {
      await page.route('**/inventory-service/**', async (route) => {
        await new Promise(res => setTimeout(res, 3000));
        await route.continue();
      });
    }

    await use(page);
  }
});

export const expect = test.expect;

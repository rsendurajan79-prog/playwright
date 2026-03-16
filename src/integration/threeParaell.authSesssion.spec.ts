// parallel-tests.spec.ts
import { test, expect } from '../fixtures/auth.storage.fixture';

test.describe.parallel('Parallel tests with shared login session', () => {

  test.only('Test A - Validate product title', async ({ page }) => {
    console.log('Value of process.env.CI:', process.env.CI);
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('Test B - Validate cart icon exists', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.shopping_cart_link')).toBeVisible();

  });

  test('Test C - Validate first product is visible', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.inventory_item').first()).toBeVisible();
  });
});

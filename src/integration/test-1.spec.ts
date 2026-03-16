import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('john');
  await page.locator('input[name="username"]').press('Tab');
  await page.locator('input[name="password"]').fill('demo');
  await page.getByRole('button', { name: 'Log In' }).click();

  // 2. Wait for login to complete (important!)
    await page.waitForURL('https://parabank.parasoft.com/parabank/overview.htm')
  await page.locator('#headerPanel').getByRole('link', { name: 'Services' }).click();
  await page.locator('#headerPanel').getByRole('link', { name: 'About Us' }).click();
  await page.getByRole('link', { name: 'Bill Pay' }).click();
  await page.getByRole('button', { name: 'Send Payment' }).click();
  await page.getByRole('link', { name: 'home', exact: true }).click();
  await page.getByRole('link', { name: 'Log Out' }).click();
});
import { test, expect } from '@playwright/test';

const authFile = './auth/user.json';

test.describe('Authenticated Feature', () => {
 test.use({ storageState: authFile });

  test('Check Dashboard', async ({ page }) => {
    // This page will already have the cookies!
    await page.goto('https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC');
    await page.getByRole('link', { name: 'Open New Account' }).click();
    await expect(page).toHaveURL('https://parabank.parasoft.com/parabank/openaccount.htm');
  });
});
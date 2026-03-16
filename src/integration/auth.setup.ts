import { test as setup, expect } from '@playwright/test';

setup('authenticate and save storage state', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
  await page.context().storageState({ path: 'auth/user.json' });        
    });
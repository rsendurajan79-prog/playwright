import { test as base,APIRequestContext,expect } from '@playwright/test';
import fs from 'node:fs';

 export const test = base.extend<{ authenticatedRequest: APIRequestContext }>({
  authenticatedRequest: async ({ playwright }, use) => {
    // Read the token from the saved storage state file
    const state = JSON.parse(fs.readFileSync('playwright/.auth/user.json', 'utf-8'));
    
    // Find the token (adjust this based on where your API saves it)
    const token = state.origins[0]?.localStorage.find(e => e.name === 'token')?.value;

    const context = await playwright.request.newContext({
      extraHTTPHeaders: {
        'Authorization': `Bearer ${token}`,
      },
    });

    await use(context);
    await context.dispose();
  },
});

//implemetation of API token in the test 
import { test } from './fixtures'; // Import your custom version of test
test('api test with bearer token', async ({ authenticatedRequest }) => {
  const response = await authenticatedRequest.get('/api/secure-data');
  expect(response.ok()).toBeTruthy();
});
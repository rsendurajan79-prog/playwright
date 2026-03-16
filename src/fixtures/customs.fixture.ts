import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ browser }, use, testInfo) => {
    // read baseURL from the config that was used for this run    
    const baseURL = testInfo.project.use.baseURL;
    const context = await browser.newContext();
    const page = await context.newPage(); 
  console.log('--- Custom Page Fixture Initialized ---');

    
    if (baseURL)                  // navigate only if one is definedgate only if one is defined
      await page.goto(baseURL); 
    else 
        console.warn('No baseURL defined in the config for this project. Skipping navigation.');       

   await use(page);
    await context.close();  
    console.log('Test completed, browser context closed.');
  }
});

export { expect } from '@playwright/test';
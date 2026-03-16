import { FullConfig,chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch({ headless: false });
//     const { baseURL, storageState } = config.projects[0].use;
//   const authFile = storageState as string;

//   // 1. Ensure the directory exists
//   const authDir = path.dirname(authFile);
//   if (!fs.existsSync(authDir)) {
//     fs.mkdirSync(authDir, { recursive: true });
//   }

//   // 2. Launch browser and login
//  // const browser = await chromium.launch();
//   const page = await browser.newPage();
//   // Dynamic URL usage
//       await page.goto('https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC');
//       await page.getByRole('textbox', { name: 'username' }).fill('john');
//       await page.getByRole('textbox', { name: 'password' }).fill('demo');
//       // Alternatively, using labels if roles are not properly defined
//       // await page.getByLabel('Username').fill('john');
//       // await page.getByLabel('Password').fill('demo');
//       await page.getByRole('button', { name: 'Log In' }).click();
      
  
//   // Wait for a success indicator (URL change or element)
//   await page.waitForURL('**/overview.htm');

//   // 3. Save the state
//   await page.context().storageState({ path: authFile });
//   await browser.close();
   
}
export default globalSetup;


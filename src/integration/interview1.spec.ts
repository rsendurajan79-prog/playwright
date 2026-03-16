// Task:  
// Automate the following workflow using Playwright + TypeScript:

// Navigate to a public demo site (e.g., https://reqres.in or https://www.saucedemo.com).

// Perform login using credentials from a JSON test data file.

// After login, validate that the landing page loads with correct UI elements.

// Add two items to the cart and verify the cart count updates.

// Intercept the network call for “Add to Cart” and assert:

// Request method is correct

// Response status is 200

// Response body contains expected fields

// Take a screenshot only if the test fails.

// Generate a custom HTML report with test metadata (browser, environment, timestamp).

// This challenge checks your framework mindset, not just scripting.
import { test, expect } from "@playwright/test";
import testData from '../fixtures/testdata.json' with { type: 'json' };
import playwrightConfig from "playwright.config";

    test('interview test 1', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.fill('#user-name', testData.userName);
        await page.fill('#password', testData.password);
        await page.click('#login-button');
        await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
        // Add two items to the cart and verify the cart count updates.
        const  addToCartButtons = page.locator('button[id^="add-to-cart"]');
        // Intercept Add to Cart request
    await page.route('**/cart/**', async (route) => {
      const request = route.request();
      expect(request.method()).toBe('POST');

      const response = await route.fetch();
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('item_id');

      route.continue();
    });
            for (let i = 0; i < 2; i++) {
            await addToCartButtons.nth(i).click();
            }
  
        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
        

    });


    test('interview test 2', async ({ page }) => {
//  Task:
// Call a public API (e.g., GET https://reqres.in/api/users?page=2 (reqres.in in Bing)).
// Extract a user’s email from the API response.
// Use that email to perform a UI search on a demo site.
// Validate that the UI displays the same user details returned by the API.
        await page.request.get('https://reqres.in/api/users?page=2').then(async (response) => {
            expect(response.status()).toBe(200);
            const data = await response.json();
            const userEmail = data.data[0].email;
            console.log('Extracted email:', userEmail);
       });
     });
     
   test.fixme('interview test 3', async ({ page }) => {
//  Task:
// Tests retry only when the failure is due to a network issue.
// Functional/UI failures never retry (preventing false positives).
// Console logs and network logs are captured and attached to the report.
// Debugging is easier because logs and traces are preserved.

  //  refer src\integration\retryONOnlyNetworkFailure.spec.ts
    
   });
   test('interview test 4', async ({ page }) => {
//     Question : 
//     "We have a complex Dashboard that loads data from three different slow-running microservices.
// When a user clicks 'Generate Report', a loading spinner appears.
// The button stays 'Disabled' until all three services respond.
// Sometimes the spinner disappears, but the data table is still empty for another second while the frontend renders.
// Our current tests are failing 20% of the time because they try to scrape the table before the data is actually there."

   // 1. Start listening for responses BEFORE the action to avoid race conditions
const responsePromise1 = page.waitForResponse(r => r.url().includes('/service1') && r.status() === 200);
const responsePromise2 = page.waitForResponse(r => r.url().includes('/service2') && r.status() === 200);
const responsePromise3 = page.waitForResponse(r => r.url().includes('/service3') && r.status() === 200);

await page.getByRole('button', { name: 'Generate Report' }).click();

// 2. Wait for all network calls to resolve
await Promise.all([responsePromise1, responsePromise2, responsePromise3]);

// 3. Use toPass to poll for the UI rendering state
await expect(async () => {
  // We use standard assertions here because they THROW an error if they fail,
  // which is what triggers toPass to try again.
  await expect(page.locator('.table').filter({ hasText: 'Report 1' }).getByText('Completed')).toBeVisible({ timeout: 500 });
  await expect(page.locator('.table').filter({ hasText: 'Report 2' }).getByText('Completed')).toBeVisible({ timeout: 500 });
  await expect(page.locator('.table').filter({ hasText: 'Report 3' }).getByText('Completed')).toBeVisible({ timeout: 500 });
}).toPass({
  intervals: [1000, 2000, 5000],
  timeout: 15000 // Dashboard loading often needs more than 10s in CI
});
   })

   //Gemini Coding Question- oneway 
   //How would you handle the file chooser in Playwright

  test('upload file - file chooser', async ({ page }) => {
  await page.goto('/profile');

  // 1. Start listening for the file chooser before clicking the UI button
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Upload' }).click();
  const fileChooser = await fileChooserPromise;

  // 2. Set the files on the intercepted chooser
  await fileChooser.setFiles('./test-data/avatar.png');

  // 3. Assertion
  await expect(page.getByText('Upload Successful')).toBeVisible();
});
//Mention that setInputFiles is the best way to handle uploads in headless mode because it bypasses the OS-level file picker dialog which Playwright cannot "see."

 //How would you handle the file chooser in Playwright--SECOND method

  test('upload file - direct', async ({ page }) => {
  await page.goto('/profile');

  // 1. Locate the actual input element (often hidden)
  // If getByLabel doesn't work, use a CSS selector like 'input[type="file"]'
  await page.setInputFiles('input[type="file"]', './test-data/avatar.png');

  // 2. Assert the success message
  await expect(page.getByText('Upload Successful')).toBeVisible();
});

// Navigate to /checkout.
// Locate the Iframe using its id or title attribute (e.g., id="payment-frame").
// Inside that Iframe, fill in the "Card Number" field.
// Inside the same Iframe, fill in the "Expiry Date".
// Switch back to the main page (the parent frame) and click the "Complete Purchase" button.
test('payment checkout with iframe', async ({ page }) => {
  await page.goto('/checkout');
  
  // 1. Create the frame locator
  // Senior Tip: Use the frame's title if available, it's more accessible
  const paymentFrame = page.frameLocator('#payment-frame');

  // 2. Interact with elements inside the frame
  // Playwright automatically waits for the frame to be available/loaded
  await paymentFrame.getByLabel('Card Number').fill('1214-5456-5466-6757');
  await paymentFrame.getByLabel('Expiry Date').fill('10/30');

  // 3. Interact with the main page
  // Notice we don't need to "exit" the frame; 'page' still refers to the main doc
  await page.getByRole('button', { name: 'Complete Purchase' }).click();

  // 4. Final Assertion
  await expect(page.getByText('Thanks for your purchases')).toBeVisible();
});
//The interviewer might ask:
//"What happens if the 'Card Number' field is actually inside a nested iframe (an iframe inside an iframe)?"
//page.frameLocator('#outer-frame').frameLocator('#inner-frame').getByRole(...)


//Your application has a "Sign Up" page. On this page, there is a link that says "Read our Terms of Service".
// When clicked, this link opens the Terms of Service in a completely new browser tab.You need to switch to that new tab.
// Verify the heading ($h1$) in the new tab contains the text "Legal Agreement".
// Close the new tab and return to the original "Sign Up" page to check a "I Agree" checkbox.
// Note the addition of 'context' in the fixture object
test('handle multi-tab Terms of Service workflow', async ({ page, context }) => {
  await page.goto('/signup');
  
  // 1. Start listening for the new page (tab) before clicking
  const pagePromise = context.waitForEvent('page');

  // 2. Trigger the action that opens the new tab
  await page.getByRole('link', { name: 'Read our Terms of Service' }).click();

  // 3. Wait for the new tab to actually open and initialize
  const newTab = await pagePromise;

  // 4. Interact with the new tab
  // Tip: Use wait ToLoadState if the page is heavy
  await newTab.waitForLoadState(); 
  await expect(newTab.getByRole('heading', { name: 'Legal Agreement' })).toBeVisible();
  
  // 5. Cleanup the tab and return to main flow
  await newTab.close();

  // 6. Complete the original form
  // Role is 'checkbox',
  await page.getByRole('checkbox', { name: 'I Agree' }).check();
  await expect(page.getByRole('checkbox', { name: 'I Agree' })).toBeChecked();
});

//"Why did you use context.waitForEvent('page') instead of page.waitForEvent('popup')?"
//Answer: context.waitForEvent('page') is generally safer for target="_blank" links,
// whereas popup is specifically for window.open() calls. Both can work, but page is more universal for tabs.


//Interviewer: "You are testing an e-commerce dashboard. When a user clicks 'Submit Order', the app sends an API request, shows a 'Processing...' spinner,
//  and then dynamically adds a row to a table.
//  Sometimes the API is slow, and sometimes the table row doesn't appear immediately. How do you write a robust test for this?"
test('should successfully submit order and update dashboard', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Set up network interception BEFORE the action
  const orderPromise = page.waitForResponse(response => 
    response.url().includes('/api/orders') && response.status() === 201
  );

  // 2. Trigger the action
  await page.getByRole('button', { name: 'Submit Order' }).click();

  // 3. Wait for the API response to settle
  const response = await orderPromise;
  const responseBody = await response.json();
  const newOrderId = responseBody.id;

  // 4. Handle dynamic UI: Wait for spinner to vanish
  // Playwright's toBeHidden() retries automatically
  await expect(page.getByText('Processing...')).toBeHidden();

  // 5. Verify the table update using Locators
  // We locate the table, find the first row, and check for the ID
  const firstRow = page.locator('table >> tr').nth(1); 
  await expect(firstRow).toContainText(newOrderId);
});

//POM
import {type Locator,type  Page } from '@playwright/test';

export class LoginPage {
  // 1. Declare properties with types
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // 2. Initialize locators in the constructor (Lazy loading)
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  // 3. Define high-level actions
  async goto() {
    await this.page.goto('/login');
  }

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}
//how to use test 
import { LoginPage } from './pages/LoginPage';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('myUser', 'myPassword');
});

//to make it more clean -create fixture to POM object like this 
// In a fixtures.ts file
export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

// In your actual test file
test('login test', async ({ loginPage }) => {
   // loginPage is already initialized and ready to go!
   await loginPage.goto();
});

// The Concept: Every method in your POM returns this (the current page) or the next page object.
async login(user, pass): Promise<DashboardPage> {
  await this.usernameInput.fill(user);
  await this.passwordInput.fill(pass);
  await this.loginButton.click();
  return new DashboardPage(this.page); // Return the next page!
}

// Inside the test
await loginPage.goto().login('user', 'pass').then(dashboard => {
   expect(dashboard.welcomeMessage).toBeVisible();
});

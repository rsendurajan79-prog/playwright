import { test, expect } from '@playwright/test';


test.describe('example', () => {

test.skip('should load google homepage', async ({page, browserName }) => {
    if (browserName === 'firefox' || browserName === 'webkit' ) {
        test.skip();
    }
    //console.log(browser.browserType());
    //console.log(browser.version());
    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle('Google');
});


test.skip('handle new window', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.hyrtutorials.com/p/window-handles-practice.html');

  // Wait for new window to open
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('#newWindowBtn').click() // it will open new window
  ]);

  // Interact with the new window
  await newPage.waitForLoadState();
  console.log(await newPage.title()+" - New Window Title");

  // Perform actions in the new window
   await newPage.getByPlaceholder('Enter First Name').fill('John Doe');

  // Bring parent window to front
  await page.bringToFront();
    console.log(await page.title()+" - Parent Window Title");
    //handles multiple open window 
    const pages = context.pages();

for (const p of pages) {
  console.log(await p.title());
}
//another way to handle multiple open window
await pages[0].bringToFront();
console.log(await pages[0].title()+" - First Window Title");
await pages[1].bringToFront();
console.log(await pages[1].title()+" - Second Window Title");

});

test.only('Practice Window and Tab Handling', async ({ page, context }) => {
    await page.goto('https://www.hyrtutorials.com/p/window-handles-practice.html');

//     // 1. Open New Window
//     const [newWindow] = await Promise.all([
//         context.waitForEvent('page'),
//         page.click('#newWindowBtn')
//     ]);
//     await newWindow.waitForLoadState();
//     console.log('New Window Title:', await newWindow.title());
//    await newWindow.getByPlaceholder('Enter First Name').fill('John Doe');
 

//     await newWindow.close();

//     // 2. Open New Tab
//     const [newTab] = await Promise.all([
//         context.waitForEvent('page'),
//         page.click('#newTabBtn')
//     ]);
//     await newTab.waitForLoadState();
//     console.log('New Tab Title:', await newTab.title());
//     await newTab.close();

    // 3. Open Multiple Windows (Button 3)
    // This triggers 2 new windows. We use the context to catch them.
    const multiWindowPromise = context.waitForEvent('page');
    await page.click('#name'); // Some sites require focus or specific interactions
   await page.locator('#multipleWindowsBtn').scrollIntoViewIfNeeded();
    await page.locator('#multipleWindowsBtn').click({ force: true });

    // const [MultipleWindow] = await Promise.all([
    //     context.waitForEvent('page'),
    //     page.click('#multipleWindowsBtn')
    // ]);
    
    // Playwright stores all open pages in context.pages()
    // We wait a bit for them to initialize
    await page.waitForTimeout(2000); 
    const allPages = context.pages();
    console.log(`Total pages open: ${allPages.length}`);
    
    // 4. Open Multiple Tabs (Button 4)
    const [multiTabs] = await Promise.all([
        context.waitForEvent('page'),
        page.click('#multipleTabsBtn')
    ]);
    await multiTabs.waitForLoadState();
    console.log('One of the multiple tabs:', await multiTabs.url());

    // 5. Open Multiple Tabs and Windows (Button 5)
    // This is the ultimate test. It opens a mix of both.
    await page.click('#tabsWindowsBtn');
    
    // Best practice to interact with specific windows:
    for (const p of context.pages()) {
        const title = await p.title();
        console.log(`Interacting with: ${title}`);
        if (title.includes('Alerts')) {
            await p.bringToFront();
            // Perform actions on specific window
        }
    }

    // Clean up: Close everything except the main page
    for (const p of context.pages()) {
        if (p !== page) await p.close();
    }
});


});


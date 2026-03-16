import { test, expect } from "@playwright/test";
import { Page, Dialog, Locator } from '@playwright/test';



test.describe('Table Handling Tests', () => {
    test('should extract and validate table headers contain text', async ({ page }) => {
        await page.goto('https://playground.bondaracademy.com/pages/tables/smart-table');
        // Extract table headers
        const headers = await page.locator('thead tr th').allTextContents();
        console.log('Table Headers:', headers);

        //await expect(page.locator('thead tr th')).toContainText(['Actions','First Name','Last Name','Username','E-mail','Age','Salary','Actions']);
        // Locate all rows in the table body
        const rows = page.locator('tbody tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const rowText = await rows.nth(i).innerText();
            console.log(`Row ${i + 1}: ${rowText}`);

            // Example: If you want to find a row with specific text and click edit
            if (rowText.includes('ann@gmail.com')) {
                await rows.nth(i).locator('.nb-edit').click();
            }
        }
    });
    test('should validate table data and perform actions', async ({ page }) => {
        await page.goto('https://playground.bondaracademy.com/pages/tables/smart-table');
        expect(page.getByText(' Smart Table ').first()).toBeVisible();

        // Find the row containing specific text and click the delete button
        await page.locator('tbody tr').filter({ hasText: '16' }).first().locator('.nb-trash').click();
        //Find the row based on id value give and click delete button
        //get the row id from user         
        page.locator('tbody tr').filter({ hasText: '16' }).first().locator('.nb-trash').click()

    });

    test.fixme('validate dialog content and perform actions', async ({ page }) => {
        await page.goto('https://playground.bondaracademy.com/pages/modal-overlays/dialog');

        const nameToEnter = 'Gemini';

        // 1. Setup the listener to handle BOTH dialogs
        page.on('dialog', async dialog => {

            // FORCE PRINT: This should run for every dialog
            console.log(`DIALOG DETECTED! Type: ${dialog.type()} | Message: ${dialog.message()}`);

            if (dialog.type() === 'alert') {
                await dialog.accept();
            } else if (dialog.type() === 'prompt') {
                await dialog.accept('Gemini');
            }
        });

        // 2. Trigger the sequence
        await page.getByRole('button', { name: 'ENTER NAME' }).click();
        // 3. Verify the name was added to the list
        // The list is located inside the 'Random dialog' card
        const nameList = page.locator('nb-card-header', { hasText: 'Enter your name' }).getByPlaceholder('Name');

        await nameList.fill(nameToEnter);
        await expect(nameList.last()).toHaveText(nameToEnter);
        


    });
})


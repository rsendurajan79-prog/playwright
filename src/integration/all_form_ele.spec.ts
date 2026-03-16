import {test,expect} from '@playwright/test'
import { time } from 'console';
import { text } from 'stream/consumers';
import { setInterval } from 'timers/promises';

test('handle actual new tab redirection', async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/pages/modal-overlays/window');

    // 1. Start waiting for the new page event
    const pagePromise = page.waitForEvent('page');

    // 2. Click the button that opens the new tab
    await page.getByRole('button', { name: 'OPEN HOMEPAGE IN A NEW TAB' }).click();

    // 3. Resolve the promise to get the new page object
    const newTab = await pagePromise;

    // 4. Wait for the new tab to load completely
    await newTab.waitForLoadState();

    // 5. Interact with the NEW tab
    console.log(await newTab.title());
    await expect(newTab).toHaveURL('https://playground.bondaracademy.com/');
    
    // You can now use 'newTab' just like 'page'
    await newTab.getByTitle('Forms').click();

    // 6. You can still switch back to the original page if needed
    await page.bringToFront();
});
test.only('@all form element handling', async ({ page,context }) => {
    await context.tracing.start({ screenshots: true, snapshots: true,sources: true });
    try {
    await page.goto('https://playground.bondaracademy.com/pages/forms/layouts');
    await page.getByRole('textbox', { name: 'Email address' }).fill('basicemail@gmail.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.locator('#exampleInputPassword1').fill('basicpassword');
    await page.locator('.form-group > .status-basic > .label > .custom-checkbox').click();
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('first');
    await page.getByRole('textbox', { name: 'Website' }).click();
    await page.getByRole('textbox', { name: 'Website' }).fill('https://playground.bondaracademy.com/pages/forms/layouts');
    await page.getByRole('textbox', { name: 'Message' }).click();
    await page.getByRole('textbox', { name: 'Message' }).fill('ffhsdkjnsdkjvkdsjbvkjbdfvkdfviodfhvhoihdfoihdoivhdfoihiodfhboidfhboidfboidfhboihdfoibhdf');
    await page.locator('#inputEmail3').click();
    await page.locator('#inputEmail3').fill('horizonatalemail');
    await page.locator('#inputPassword3').click();
    await page.locator('#inputPassword3').fill('sdfsfd');
    await page.locator('.checkbox > .status-basic > .label > .custom-checkbox').click();
    await page.getByRole('textbox', { name: 'Jane Doe' }).click();
    await page.getByRole('textbox', { name: 'Jane Doe' }).fill('inline name');
    await page.getByRole('textbox', { name: 'Jane Doe' }).press('Tab');
    await context.tracing.group('label1')
    await page.locator('form').filter({ hasText: 'Remember meSubmit' }).getByPlaceholder('Email').fill('inlineEmail');
    await page.locator('.custom-checkbox').first().click();
    await page.locator('form').filter({ hasText: 'Remember meSubmit' }).getByRole('button').click();
    await page.getByRole('link', { name: 'Datepicker' }).click();
    await page.getByRole('textbox', { name: 'Form Picker' }).click();
    await page.getByText('25').click();
    await page.getByRole('textbox', { name: 'Range Picker' }).click();
    await page.getByRole('button', { name: 'March' }).click();
    await page.getByText('2016', { exact: true }).click();
    await page.getByText('Jun').click();
    await page.getByText('1').nth(2).click();
    await page.getByRole('textbox', { name: 'Min Max Picker' }).click();
    await page.getByRole('button').nth(3).click();
    await page.getByRole('button').nth(3).click();
    await page.getByRole('button').nth(3).click();
    await page.getByRole('button', { name: 'December' }).click();
    await page.getByText('2021').click();
    await page.getByRole('button', { name: '- 2027' }).click();
    await page.getByRole('button', { name: 'December' }).click();
    await page.getByText('2016', { exact: true }).click();
    await page.getByText('2017').click();
    await page.getByText('2026').click();
    await page.locator('nb-layout-column').click();
    await page.getByRole('link', { name: 'Extra Components' }).click();
    await context.tracing.groupEnd();
    await context.tracing.stop({path:'allformelementhandling.zip'});    
    } catch (error) {
        await context.tracing.stop({path:'allformelementhandling.zip'});
    }
    
    
    
    // // Text Input
    // const textInput = await page.getByPlaceholder('Jane Doe');
    // await textInput.fill('Playwright Testing');
    // expect.soft(textInput).toHaveText('Playwright Testing');
    // // Another way to assert without using the element handle
    // expect.soft(await textInput.inputValue()).toBe('Playwright Testing');

    // // Text by label and role
    // const textarea = await page.getByLabel('Email');
    // await textarea.type('suthaka@gmail.com', { delay: 100 });
    // expect.soft(textarea).toHaveValue('suthaka@gmail.com');

    // //Text by Role
    // await page.getByRole('textbox', { name: 'Password' }).fill('mysecretpassword');
    // expect.soft(page.getByRole('textbox', { name: 'Password' })).toHaveValue('mysecretpassword');
  

    // await page.getByPlaceholder('Type something').fill('Playwright Testing'); 
    // expect.soft('Playwright Testing').toBe('Playwright Testing');  


    // // // Textarea
    // // await page.getByPlaceholder('Textarea').fill('This is a textarea input');

    // // Checkbox
    // await page.getByLabel('Checkbox 1').check();
    // await page.getByLabel('Checkbox 2').check();

    // // Radio Button
    // await page.getByText('Option 2').check();


    
    // // Select Dropdown
    // await page.getByLabel('Select').selectOption('option2');
    // // Multi-Select Dropdown
    // await page.getByLabel('Multi-Select').selectOption(['option1', 'option3']);
    // // Date Picker
    // await page.getByLabel('Date').fill('2024-12-31');
    // // Time Picker
    // await page.getByLabel('Time').fill('23:59');
    // // File Upload
    // const filePath = 'path/to/your/file.txt';
    // await page.setInputFiles('input[type="file"]', filePath);

    // // Submit the form
    // await page.getByRole('button', { name: 'Submit' }).click();
    // // Validate form submission (e.g., check for success message)
    // await expect(page.getByText('Form submitted successfully')).toBeVisible();
});




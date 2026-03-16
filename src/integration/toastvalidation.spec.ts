import {test,expect} from '@playwright/test'
test('validate toast message', async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/pages/modal-overlays/toastr');
    await page.getByRole('button', { name: 'Show toast' }).click();
    await expect(page.getByText("I'm cool toaster!")).toBeVisible();

});
test.only('validating tool tips message ',async({page})=>{
    await page.goto('https://playground.bondaracademy.com/pages/modal-overlays/tooltip');
    await page.getByText('LEFT').hover();
     
    await expect(page.getByText('LEFT')).toHaveAttribute('nbtooltip', 'This is a tooltip');
    await page.locator('body').click(); // Click outside to hide the tooltip
    await page.getByText('TOP').hover();
    await page.pause();
    await expect(page.getByText('TOP')).toHaveAttribute('nbtooltip', 'This is a tooltip');
    await page.locator('body').click(); // Click outside to hide the tooltip
    await page.getByText('RIGHT').hover();
    await expect(page.getByText('RIGHT')).toHaveAttribute('nbtooltip', 'This is a tooltip');
    await page.locator('body').click(); // Click outside to hide the tooltip
    await page.getByText('BOTTOM').hover();
    await expect(page.getByText('BOTTOM')).toHaveAttribute('nbtooltip', 'This is a tooltip');
    await page.locator('body').click(); // Click outside to hide the tooltip

     
    
})   
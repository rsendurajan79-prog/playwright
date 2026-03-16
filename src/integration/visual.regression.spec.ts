import { test, expect } from "@playwright/test";
test.describe('Visual Regression Tests', () => {
    test('should capture and compare screenshots for visual regression', async ({ page }) => {
        await page.goto('https://www.playground.bondaracademy.com/pages/iot-dashboard');
        await page.waitForLoadState('networkidle');

        // Capture a screenshot of the entire page
        const screenshot = await page.screenshot();
        // Compare the screenshot with a baseline image
        expect(screenshot).toMatchSnapshot('visual-regression-baseline.png');
    });
    test('should capture and compare screenshots for specific elements', async ({ page }) => {
        await page.goto('https://www.playground.bondaracademy.com/pages/iot-dashboard');
        await page.waitForLoadState('networkidle');
        // Capture a screenshot of a specific element
        const element = page.locator('.nb-lightbulb');
        const elementScreenshot = await element.screenshot();
        // Compare the element screenshot with a baseline image
        expect(elementScreenshot).toMatchSnapshot('element-visual-regression-baseline.png');
    });
});
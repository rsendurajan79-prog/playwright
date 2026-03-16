import { test, expect } from "@playwright/test";
import { EPPHelpers } from "@helpers/epphelpers";

import { testData } from "@fixtures/test-data"


test.describe("EPP Login Tests", () => {
    let eppHelpers: EPPHelpers;

    test.beforeEach(async ({ page }) => {
        eppHelpers = new EPPHelpers(page);
    });

    test.only("should login to EPP successfully and verify dashboard", async ({ page }) => {
        // Use dedicated EPP username from test data
        const eppUsername = testData.eppUsername;

        // Perform EPP login
        await eppHelpers.loginToEPP(eppUsername);
        // Verify page is loaded properly
        await page.waitForLoadState('networkidle');
        // Verify we are on the dashboard
        await eppHelpers.verifyDashboard();

        // Additional verification - check URL contains dashboard
        const currentUrl = await eppHelpers.getCurrentUrl();
        expect(currentUrl).toContain('app/dashboard');

        // Verify page is loaded properly
        await page.waitForLoadState('networkidle');

        console.log(`Successfully logged into EPP and verified dashboard for user: ${eppUsername}`);
    });

    test("should login to EPP with custom password and verify dashboard", async ({ page }) => {
        const eppUsername = testData.eppUsername;
        const customPassword = "Cigna@123";

        // Login with custom password
        await eppHelpers.loginToEPP(eppUsername, customPassword);

        // Verify dashboard access
        await eppHelpers.verifyDashboard();

        // Verify URL structure
        const currentUrl = await eppHelpers.getCurrentUrl();
        expect(currentUrl).toMatch(/.*evernorth\.com.*app\/dashboard/);

        console.log('Successfully logged into EPP with custom password and verified dashboard');
    });

    test("should navigate to settings and preferences from EPP dashboard", async ({ page }) => {
        const eppUsername = testData.eppUsername;

        // Login to EPP first
        await eppHelpers.loginToEPP(eppUsername);

        // Verify dashboard
        await eppHelpers.verifyDashboard();

        // Navigate to settings and preferences
        await eppHelpers.navigateToSettingAndPreferences();

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        console.log('Successfully navigated to Settings and Preferences from EPP dashboard');
    });

    test("should verify EPP login page loads correctly", async ({ page }) => {
        // Navigate directly to login page
        await page.goto('/app/login');
        await page.waitForLoadState('domcontentloaded');

        // Verify URL contains login path
        const currentUrl = page.url();
        expect(currentUrl).toContain('app/login');
        expect(currentUrl).toContain('evernorth.com');

        // Verify login elements are present (basic check)
        const loginButton = page.getByRole('button', { name: /log in|next/i });
        await expect(loginButton).toBeVisible();

        console.log('EPP login page loaded successfully');
    });

    test.afterEach(async ({ page }) => {
        // Clean up - logout if needed
        try {
            await eppHelpers.logoutFromEPP();
        } catch {
            // Ignore logout errors in test cleanup
            console.log('Logout cleanup - no action needed');
        }
    });
});
import { Page, expect, test } from "@playwright/test";
import { PageHelpers } from "../helpers/pagehelpers";
import { WaitHelpers } from "../helpers/wait-helpers";
import { ValidationHelpers } from "../helpers/validationhelpers";
import { DEFAULT_PASSWORD, Heading, SHORTTIMEOUT, UsernameVerificationText } from "../constants/constant";

export class EPPHelpers {
private pageHelpers: PageHelpers;
private waitHelpers: WaitHelpers;
private validationHelpers: ValidationHelpers;

constructor(private page: Page) {
    this.pageHelpers = new PageHelpers(this.page);
    this.waitHelpers = new WaitHelpers(this.page);
    this.validationHelpers = new ValidationHelpers(this.page);
}

/**
 * Login to EPP (Evernorth Provider Portal)
 * @param eppUsername - EPP username
 * @param eppPassword - EPP password (defaults to DEFAULT_PASSWORD)
 */
async loginToEPP(eppUsername: string, eppPassword: string = DEFAULT_PASSWORD): Promise<void> {
    // Clear any existing state to avoid test interference
    await this.page.context().clearCookies();

    // Navigate to login URL
    await this.page.goto("/app/login", {
        waitUntil: "commit",
        timeout: SHORTTIMEOUT,
    });

    await this.page.waitForLoadState("domcontentloaded");
    await this.validationHelpers.validateURLPattern(/.*evernorth\.com/);
    await this.waitHelpers.waitForFastPageLoad();

    // Get baseURL from test info - this will access the config's baseURL
    const baseURL = test.info().project.use.baseURL;

    // Get current URL and verify it contains the login path
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('app/login');

    expect(this.page.url()).toBe(`${baseURL}app/login`);

    await this.pageHelpers.clickByRole({ role: 'button', name: 'Login' });
    await this.waitHelpers.waitForFastPageLoad();
    await this.pageHelpers.verifyByRole({ role: 'heading', Heading });
    // await this.pageHelpers.verifyByText(UsernameVerificationText);
    await this.pageHelpers.fillByRole({ role: 'username', eppUsername });
    await this.pageHelpers.clickByRole({ role: 'button', name: 'Next' });
    await this.pageHelpers.fillByRole({ role: 'password', eppPassword });
    await this.pageHelpers.clickByRole({ role: 'button', name: 'Continue' });
    await this.waitHelpers.waitForFastPageLoad(); // Use fast page load for final step
    await this.page.waitForURL({ url: '/dashboard', waitUntil: 'networkidle' });
    // Verify successful login - dashboard page
    const finalUrl = this.page.url();
    expect(finalUrl).toContain('app/dashboard');
}

/**
 * Navigate to Settings and Preferences
 */
async navigateToSettingAndPreferences(): Promise<void> {
    // Try multiple strategies to find and click settings
    const settingsSelectors = [
        '[data-test*="header-username"]',
        '[data-test*="user-menu"]',
        '[class*="user-menu"]',
        '.header-username'
    ];

    let userMenuFound = false;
    for (const selector of settingsSelectors) {
        try {
            const userMenu = this.page.locator(selector);
            if (await userMenu.isVisible()) {
                await userMenu.hover();
                userMenuFound = true;
                break;
                }
            } catch {
                continue;
            }
            }
            
            if (!userMenuFound) {
                console.log('User menu not found, trying alternative approach');
            }
            
            // Try to click settings link
            const settingsLinkSelectors = [
                '[data-test*="settings"]',
                '[data-test*="preferences"]',
                'text=Settings',
                'text=Preferences',
                'a[href*="settings"]'
            ];
            
            for (const selector of settingsLinkSelectors) {
                try {
                    const settingsLink = this.page.locator(selector);
                    if (await settingsLink.isVisible()) {
                        await settingsLink.click();
                        await this.waitHelpers.waitForFastPageLoad();
                        return;
                    }
                } catch {
                    continue;
                }
            }
            
            console.log('Settings link not found - manual navigation may be required');
            }
            
            /**
             * Get current page URL
             */
            async getCurrentUrl(): Promise<string> {
              return this.page.url();
          }
          
          /**
           * Verify user is on dashboard page
           */
          async verifyDashboard(): Promise<void> {
              const currentUrl = this.page.url();
              expect(currentUrl).toContain('app/dashboard');
          
              // Additional verification - check for dashboard elements
              const dashboardElements = [
                  this.page.locator('[data-test*="dashboard"]'),
                  this.page.locator('[class*="dashboard"]'),
                  this.page.getByText(/dashboard/i),
                  this.page.locator('.dashboard-container'),
                  this.page.locator('#dashboard')
              ];
          
              // Try to find at least one dashboard indicator
              let dashboardFound = false;
              for (const element of dashboardElements) {
                  try {
                      await element.waitFor({ state: 'visible', timeout: 5000 });
                      dashboardFound = true;
                      break;
                  } catch {
                      // Continue to next element
                  }
              }
          
              if (!dashboardFound) {
                  console.log('Dashboard elements not found, but URL contains dashboard path');
              }
          }
          
          /**
 * Logout from EPP application
 */
async logoutFromEPP(): Promise<void> {
  // Try to find and click logout button/link
  const logoutSelectors = [
      this.page.getByRole({ role: 'button', name: /logout/i }),
      this.page.getByRole({ role: 'link', name: /logout/i }),
      this.page.locator('[data-test*="logout"]'),
      this.page.locator('[class*="Logout"]'),
      this.page.locator('text=Logout'),
      this.page.locator('text=Sign Out')
  ];

  for (const selector of logoutSelectors) {
      try {
          if (await selector.isVisible()) {
              await selector.click();
              await this.page.waitForLoadState(state: "domcontentloaded");
              break;
          }
      } catch {
          // Continue to next selector
      }
  }
}

/**
* Verify EPP login page loads correctly
*/
async verifyLoginPageLoaded(): Promise<void> {
  // Verify URL contains login path
  await this.validationHelpers.validateEPPLoginUrl();

  // Verify login elements are present
  const loginButton = this.page.getByRole({ role: 'button', name: /log in|next/i });
  await expect(loginButton).toBeVisible();
}



/**
 * Clear browser cookies and session data
 */
async clearSession(): Promise<void> {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
}
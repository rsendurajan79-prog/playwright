import { Page, expect } from "@playwright/test";

export class WaitHelpers {
  constructor(private page: Page) {}

  /** Wait for small button spinner to disappear */
  async waitForSmallSpinnerToDisappear(timeout: number = 40000): Promise<void> {
    const spinner = this.page.locator("div[data-test-id='button-spinner']");
    await expect(spinner).not.toBeVisible({ timeout });
  }

  /** Wait for table spinner to disappear */
  async waitForTableSpinnerToDisappear(timeout: number = 40000): Promise<void> {
    const spinner = this.page.locator("div[data-test='spinner']");
    await expect(spinner).not.toBeVisible({ timeout });
  }

  /** Wait for page spinner to disappear */
  async waitForPageSpinnerToDisappear(timeout: number = 60000): Promise<void> {
    const spinner = this.page.locator("div[class*='loading-spinner']");
    await expect(spinner).not.toBeVisible({ timeout });
  }

  /** Wait for image spinner to disappear */
  async waitForImageSpinnerToDisappear(timeout: number = 60000): Promise<void> {
    const spinner = this.page.getByTestId("image-spinner");
    await expect(spinner).not.toBeVisible({ timeout });
  }
}
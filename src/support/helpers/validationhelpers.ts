import { Page, expect } from "@playwright/test";

export class ValidationHelpers {
  constructor(private page: Page) {}

  /**
   * Validate error message with color
   */
  async validateErrorMessage(
    selector: string,
    expectedMessage: string,
    messageType: "error" | "warning" = "error"
  ): Promise<void> {
    const element = this.page.locator(selector);

    // Validate message text
    const actualText: string | null = await element.textContent();
    expect(actualText?.trim()).toContain(expectedMessage);

    // Validate color based on type
    const expectedColor = messageType.toLowerCase() === "warning" 
      ? "rgb(51, 51, 51)" 
      : "rgb(204, 0, 0)";

    await expect(element).toHaveCSS("color", expectedColor);
  }

  /**
   * Validate element text content
   */
  async validateTextContent(
    selector: string,
    expectedText: string,
    isAutomationId: boolean = false
  ): Promise<void> {
    const locator = isAutomationId
      ? this.page.getByTestId(selector)
      : this.page.locator(selector);

    await expect(locator).toHaveText(expectedText);
  }

  /**
   * Validate element contains text
   */
  async validateContainsText(
    selector: string,
    expectedText: string,
    isAutomationId: boolean = false
  ): Promise<void> {
    const locator = isAutomationId
      ? this.page.getByTestId(selector)
      : this.page.locator(selector);

    await expect(locator).toContainText(expectedText);
  }

  /**
   * Validate URL pattern
   */
  async validateURLPattern(pattern: RegExp): Promise<void> {
    const currentUrl: string = this.page.url();
    expect(currentUrl).toMatch(pattern);
  }

  /**
   * Validate URL contains specific path
   */
  async validateURLContains(path: string): Promise<void> {
    const currentUrl: string = this.page.url();
    expect(currentUrl).toContain(path);
  }

  /**
   * Validate page title
   */
  async validatePageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Validate element is visible
   */
  async validateElementVisible(selector: string, isAutomationId: boolean = false): Promise<void> {
    const locator = isAutomationId
      ? this.page.getByTestId(selector)
      : this.page.locator(selector);

    await expect(locator).toBeVisible();
  }

  /**
   * Validate element is hidden
   */
  async validateElementHidden(selector: string, isAutomationId: boolean = false): Promise<void> {
    const locator = isAutomationId
      ? this.page.getByTestId(selector)
      : this.page.locator(selector);

    await expect(locator).not.toBeVisible();
  }

  /**
   * Validate element attribute value
   */
  async validateAttributeValue(
    selector: string,
    attribute: string,
    expectedValue: string,
    isAutomationId: boolean = false
  ): Promise<void> {
    const locator = isAutomationId
      ? this.page.getByTestId(selector)
      : this.page.locator(selector);

    await expect(locator).toHaveAttribute(attribute, expectedValue);
  }

  /**
   * Validate element count
   */
  async validateElementCount(
    selector: string,
    expectedCount: number,
    isAutomationId: boolean = false
  ): Promise<void> {
    const locator = isAutomationId
      ? this.page.getByTestId(selector)
      : this.page.locator(selector);

    await expect(locator).toHaveCount(expectedCount);
  }

  /**
   * Validate EPP specific URLs
   */
  async validateEPPLoginUrl(): Promise<void> {
    await this.validateURLPattern(/.*evernorth\.com.*app\/login/);
  }

  /**
   * Validate EPP dashboard URL
   */
  async validateEPPDashboardUrl(): Promise<void> {
    await this.validateURLPattern(/.*evernorth\.com.*app\/dashboard/);
  }

  /**
   * Validate form validation message
   */
  async validateFormValidationMessage(
    fieldSelector: string,
    expectedMessage: string
  ): Promise<void> {
    const validationMessage = this.page.locator(`${fieldSelector} + .validation-message, ${fieldSelector} ~ .validation-message`);
    await expect(validationMessage).toContainText(expectedMessage);
  }
}
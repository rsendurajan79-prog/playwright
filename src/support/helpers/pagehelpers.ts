import { Page, Locator, expect } from "@playwright/test";

export class PageHelpers {
  constructor(private page: Page) {}

  /**
   * Locate element by data-test-id attribute
   */
  getByAutomationId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  getByDataTestId(testId: string): Locator {
    return this.page.locator(`[data-test="${testId}"]`);
  }

  async clickByAutomationId(testId: string): Promise<void> {
    const element = this.getByAutomationId(testId);
    await element.click();
  }

  async clickByLabel(label: string): Promise<void> {
    const element = this.page.getByLabel(label);
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  async clickByRole(role: any, name: string): Promise<void> {
    const element = this.page.getByRole(role, { name });
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  async verifyByRole(role: any, name: string): Promise<void> {
    const element = this.page.getByRole(role, { name });
    await element.waitFor({ state: "visible" });
    await expect(element).toBeVisible();
  }

  async verifyByText(text: string): Promise<void> {
    const element = this.page.getByText(text);
    await element.waitFor({ state: "visible" });
    await expect(element).toBeVisible();
  }

  async fillByRole(name: string, value: string): Promise<void> {
    const element = this.page.getByRole('textbox', { name });
    await element.fill(value);
  }

  async fillByAutomationId(testId: string, value: string): Promise<void> {
    const element = this.getByAutomationId(testId);
    await element.waitFor({ state: "visible" });
    await element.fill(value);
  }

  async getTextByAutomationId(testId: string): Promise<string | null> {
    const element = this.getByAutomationId(testId);
    await element.waitFor({ state: "visible" });
    return await element.textContent();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickByLocator(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  async verifyIsEnabled(testId: string, shouldBeEnabled: boolean): Promise<void> {
    const element = this.getByAutomationId(testId);
    if (shouldBeEnabled) {
      await expect(element).toBeEnabled({ timeout: 5000 });
    } else {
      await expect(element).toBeDisabled({ timeout: 5000 });
    }
  }

  async verifyIsVisible(testId: string, shouldBeVisible: boolean): Promise<void> {
    const element = this.getByAutomationId(testId);
    if (shouldBeVisible) {
      const count = await element.count();
      if (count > 0) {
        await element.first().scrollIntoViewIfNeeded();
      }
      await expect(element.first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(element).not.toBeVisible({ timeout: 5000 });
    }
  }

  async waitForElement(selector: string, timeout: number = 5000, isAutomationId: boolean = true): Promise<Locator> {
    const element = isAutomationId ? this.getByAutomationId(selector) : this.page.locator(selector);
    await expect(element).toBeVisible({ timeout });
    return element;
  }
}
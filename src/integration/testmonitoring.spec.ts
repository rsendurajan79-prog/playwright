import {expect} from '@playwright/test'
import {test } from '../fixtures/allure.attach.fixture';

test.describe('Monitoring', () => {
  test('should fast forward time and check for inactivity logout', async ({ page }) => {
// Initial time does not matter for the test, so we can pick current time.

await page.clock.install();
await page.goto('file:///C:/Users/suthakar79/Desktop/clock.html');
// Interact with the page
await page.getByRole('button').click();

// Fast forward time 5 minutes as if the user did not do anything.
// Fast forward is like closing the laptop lid and opening it after 5 minutes.
// All the timers due will fire once immediately, as in the real browser.
await page.clock.fastForward('05:00');

// Check that the user was logged out automatically.
await expect(page.getByText('You have been logged out due to inactivity.')).toBeVisible();

page.close();
    });
});
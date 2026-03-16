import { test as base, expect, Page } from '@playwright/test';


export const test = base.extend<{ networkMonitor: Page }>({
    networkMonitor: async ({ page }, use, testInfo) => {
        // Listen to all network requests and log them
        const failedRequests: { url: string; status: number }[] = [];
        page.on('response', response => {
            const status = response.status();
            const url = response.url();
            if (status >= 400) {
                console.warn(`Warning: Received error response ${status} for ${url}`);
                failedRequests.push({ url, status });

            }
        });

        await use(page);
        if (failedRequests.length > 0) {
            console.error('Failed network requests during the test:');
            await testInfo.attach('failed-requests', {
                body: JSON.stringify(failedRequests, null, 2),
                contentType: 'application/json',
            });
        }
    }
});

export { expect } from '@playwright/test';
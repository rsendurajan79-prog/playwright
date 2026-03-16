import { test as base } from '@playwright/test';
import { allure } from 'allure-playwright';
import fs from 'node:fs';

type Artifacts = {
  artifacts: string[];
  
}

export const test = base.extend<Artifacts>({
  // Automatically attach artifacts after each test
  artifacts: 
    async ({ page }, use, testInfo) => {
      await use([]); // Use an empty array for artifacts

      // Attach screenshot (if exists)
      for (const attachment of testInfo.attachments) {
        if (attachment.name === 'screenshot') {
          const buffer = fs.readFileSync(attachment.path!);
          allure.attachment('Screenshot', buffer, 'image/png');

          
        }
      }

      // Attach video
      const videoPath = await page.video()?.path();
      if (videoPath) {
        const videoBuffer = fs.readFileSync(videoPath);
        allure.attachment('Execution Video', videoBuffer, 'video/webm');
      }

      // Attach trace
      for (const attachment of testInfo.attachments) {
        if (attachment.name === 'trace') {
          const traceBuffer = fs.readFileSync(attachment.path!);
          allure.attachment('Playwright Trace', traceBuffer, 'application/zip');
        }
      }
    },
   
  
});

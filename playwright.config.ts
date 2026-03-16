import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import {test} from './src/fixtures/latency.fixture';

// Load environment variables
const environment: string = process.env.NODE_ENV || 'sit';
dotenv.config({ path: `.env.${environment}` });

/**
 * Main Playwright Configuration for EPP (Evernorth Provider Portal) E2E Tests
 */
export default defineConfig({
    testDir: './src/integration',
    globalSetup: './src/support/setup/global-setup.ts',
    globalTeardown: './src/support/setup/global-teardown.ts',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    //workers: process.env.CI ? 1 : undefined,
    workers: 1,
    timeout: 60000,
    expect: { timeout: 10000 },
    reporter: [
        ['html', { outputFolder: 'playwright-report-epp', open: 'always' }],
        ['json', { outputFile: 'test-results/epp-results.json' }],
        ['junit', { outputFile: 'test-results/epp-junit.xml' }],
        ['allure-playwright',
            { outputFolder: 'allure-results-epp' }

        ],
    ],
    use: {
        // baseURL: 'https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC',
        // 1. Set your Base URL
        baseURL: 'https://api.restful-api.dev',
        // 2. Set Global Headers
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Add your API Key or Authorization token here
            'x-api-key': '0d719000-0e5a-4a82-91d3-99b07d4ab50e',
        },

        trace: 'off' ,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: Number.parseInt(process.env.ACTION_TIMEOUT || '30000'),
        navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
        headless: true,
        viewport: { width: 1280, height: 1500 },
        testIdAttribute: 'data-test',
        ignoreHTTPSErrors: true,
       // mockLatency: true, // Custom flag to enable latency mocking in fixtures
    },
    projects: [
        // {
        //     name: 'setup',
        //     testMatch: /auth\.setup\.ts/
        // },
        // {
        //     name: 'chromium',
        //     use: {
        //         ...devices['Desktop Chrome'],
        //         storageState: 'auth/user.json',
        //         launchOptions: { args: ['--disable-web-security', '--allow-running-insecure-content'] }
        //     },
        //     dependencies: ['setup'] // Ensure setup runs before this project
        // },
        //     {
        //   name: 'Microsoft Edge',use: {...devices['Desktop Edge'], channel: 'msedge' // This tells Playwright to use the installed Edge browser
        //   },

        //   { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', workers: 1, use: { ...devices['Desktop Safari'] } },
        //     { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
        // { name: 'Mobile Safari', use: { ...devices['iPhone 15'] } },
    ]
});
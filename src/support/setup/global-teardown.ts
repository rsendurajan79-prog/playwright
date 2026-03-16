import { FullConfig } from '@playwright/test';
async function globalTearDown(config: FullConfig) {
    console.log('Global teardown for Epp test completed successfully');

}
    export default globalTearDown;

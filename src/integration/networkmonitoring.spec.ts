import { test } from "@fixtures/networkmonitor.fixture";
//  WORKED FINE 
    test('should monitor network requests and log failed ones', async ({ networkMonitor }) => {
        await networkMonitor.goto('https://www.example.com');
        // Perform some actions that trigger network requests
        // For demonstration, we can just wait for a few seconds to allow any requests to complete
        await networkMonitor.waitForTimeout(5000);  
        // The fixture will automatically log any failed requests and attach them to the test report    
    });
    test.slow('should handle network errors gracefully', async ({ networkMonitor }) => {
        // Intentionally navigate to a non-existent page to trigger a network error
        await networkMonitor.goto('https://www.example.com/nonexistentpage');   
        // The fixture will log the 404 error and attach it to the test report
                await networkMonitor.waitForTimeout(5000);  
    });


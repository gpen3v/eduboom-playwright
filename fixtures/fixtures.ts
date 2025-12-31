// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  
  page: async ({ context, page }, use) => {
    
    /**
    * Set the cookieConsent as accepted to prevent the cookie banner from appearing during tests.
    */
    await context.addCookies([{
      name: 'cookieConsent',
      value: 'accepted',
      domain: process.env.DOMAIN,
      path: '/'
    }]);
    
    /**
     * Mock /api/v1/user to ensure tests start with a fresh guest user.
     */
    await page.route(`${process.env.USER_ENDPOINT}`, route => 
      route.fulfill({
        status: 200,
        json: {
          name: "Guest",
          email: `test-${Date.now()}@example.com`,
        }
      })
    );
    
    await use(page);
  }
});
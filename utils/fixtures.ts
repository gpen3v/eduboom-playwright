import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ context, page }, use) => {
    await context.addCookies([{
      name: 'cookieConsent',
      value: 'accepted',
      domain: process.env.COOKIE_DOMAIN,
      path: '/'
    }]);
    await use(page);
  }
});
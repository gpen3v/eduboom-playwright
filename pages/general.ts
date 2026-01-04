import { type Locator, type Page } from '@playwright/test';

export class GeneralPage {
  readonly page: Page;
  readonly cookieBar: Locator

  constructor(page: Page) {
    this.page = page;
    this.cookieBar = page.locator('.cookie-wrap');
  }
}
import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardWrapper: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardWrapper = page.locator('.dashboard-wrapper');
  }
}
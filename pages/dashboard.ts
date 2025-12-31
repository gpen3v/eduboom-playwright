import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardWrapper: Locator;
  readonly subjectCardChip: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardWrapper = page.locator('.dashboard-wrapper');
    this.subjectCardChip = page.locator('.subject-card-chip');
  }

  async validateSubjectsGrade(grade: number) {
    await expect(this.subjectCardChip.first()).toBeVisible();
    const chipTexts = await this.subjectCardChip.allInnerTexts();

    for (const text of chipTexts) {
      expect(text).toBe(`${grade} Szkoła Podstawowa`);
    }
  }
}
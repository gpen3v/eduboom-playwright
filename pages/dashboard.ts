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

  async getUserGrade() {
    const responsePromise = this.page.waitForResponse(`${process.env.USER_ENDPOINT}`);
    const response = await responsePromise;
    expect.soft(response.status()).toBe(200);
    const data = await response.json();
    const grade = data.grades[0].number;
    console.log("Klas:", grade);
    return grade;
  }

  async validateSubjectsGrade(grade: number) {
    await expect(this.subjectCardChip.first()).toBeVisible();
    const chipTexts = await this.subjectCardChip.allInnerTexts();

    for (const text of chipTexts) {
      expect(text).toBe(`${grade} Szkoła Podstawowa`);
    }
  }
}
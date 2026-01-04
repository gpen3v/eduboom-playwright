import { expect, type Locator, type Page } from '@playwright/test';
import { texts } from '../utils/testData.json'

export class DashboardPage {
  readonly page: Page;
  readonly dashboardWrapper: Locator;
  readonly subjectCardTitle: Locator;
  readonly subjectCardChip: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardWrapper = page.locator('.dashboard-wrapper');
    this.subjectCardTitle = page.locator('.subject-card-title')
    this.subjectCardChip = page.locator('.subject-card-chip');
  }

  /**
   * Validates that the dashboard subject cards display the expected subject names.
   * @param subjects - An array of subject names to validate on the dashboard
   */
  async validateDashboardSubjects(subjects: string[]) {
    if (!subjects || subjects.length === 0) return;

    for (let i = 0; i < subjects.length; i++) {
      await expect(
        this.subjectCardTitle.nth(i),
        `Subject ${i + 1} is ${subjects[i]}`
      ).toHaveText(subjects[i]);
    }
  }
}
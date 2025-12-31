import { expect, type Locator, type Page } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;
  readonly rolePicker: Locator;
  readonly roleCard: Locator;
  readonly studentRoleCard: Locator;
  readonly studentRoleCheckedIcon: Locator;
  readonly rolePickerContinueButton: Locator;
  readonly studentGradePicker: Locator;
  readonly gradeCard: Locator;
  readonly gradePickerContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rolePicker = page.locator('.role-picker-cards-container');
    this.roleCard = page.locator('.user-role-card');
    this.studentRoleCard = page.getByTestId('student');
    this.studentRoleCheckedIcon = this.studentRoleCard.locator('.checked-icon');
    this.rolePickerContinueButton = page.getByTestId('role-picker-continue-btn');
    this.studentGradePicker = page.getByTestId('grade-picker-student');
    this.gradeCard = page.locator('.grade-card');
    this.gradePickerContinueButton = page.getByTestId('grade-picker-continue-btn');
  }

  async selectGrade(grade: number) {
    const card = this.gradeCard.filter({ hasText: grade.toString() });
    await card.click();
    return card; // return the selected card for assertions
  }

  async submitResponseOK() {
    const responsePromise = this.page.waitForResponse(process.env.USER_ENDPOINT!);
    await this.gradePickerContinueButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  }

  async submitAndGetGrade() {
    const responsePromise = this.page.waitForResponse(process.env.USER_ENDPOINT!);
    await this.gradePickerContinueButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const data = await response.json();
    const grade = data.grades[0].number;
    return grade;
  }

  async submitResponse500() {
    const responsePromise = this.page.waitForResponse(process.env.USER_ENDPOINT!);
    await this.gradePickerContinueButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(500);
  }
}


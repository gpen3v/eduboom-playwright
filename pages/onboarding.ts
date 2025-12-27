import { expect, type Locator, type Page } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;
  readonly rolePicker: Locator;
  readonly roleCard: Locator;
  readonly studentRoleCard: Locator;
  readonly rolePickerContinueButton: Locator;
  readonly studentGradePicker: Locator;
  readonly gradeCard: Locator;
  readonly gradePickerContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rolePicker = page.locator('.role-picker-cards-container');
    this.roleCard = page.locator('.user-role-card');
    this.studentRoleCard = page.getByTestId('student');
    this.rolePickerContinueButton = page.getByTestId('role-picker-continue-btn');
    this.studentGradePicker = page.getByTestId('grade-picker-student');
    this.gradeCard = page.locator('.grade-card');
    this.gradePickerContinueButton = page.getByTestId('grade-picker-continue-btn');
    
  }
}


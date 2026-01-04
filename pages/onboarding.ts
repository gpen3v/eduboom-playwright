import { expect, type Locator, type Page } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;
  readonly rolePicker: Locator;
  readonly gradesSwiper: Locator;
  readonly gradeSliderPrevButton: Locator;
  readonly roleCard: Locator;
  readonly studentRoleCard: Locator;
  readonly studentRoleCheckedIcon: Locator;
  readonly rolePickerContinueButton: Locator;
  readonly studentGradePicker: Locator;
  readonly gradeCard: Locator;
  readonly gradeActive: Locator;
  readonly gradePickerContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rolePicker = page.locator('.role-picker-cards-container');
    this.gradesSwiper = page.locator('.mySwiper');
    this.gradeSliderPrevButton = this.gradesSwiper.locator('.slider-btn-prev');
    this.roleCard = page.locator('.user-role-card');
    this.studentRoleCard = page.getByTestId('student');
    this.studentRoleCheckedIcon = this.studentRoleCard.locator('.checked-icon');
    this.rolePickerContinueButton = page.getByTestId('role-picker-continue-btn');
    this.studentGradePicker = page.getByTestId('grade-picker-student');
    this.gradeCard = page.locator('.grade-card');
    this.gradeActive = page.locator('.grade-card--active .grade-card__number');
    this.gradePickerContinueButton = page.getByTestId('grade-picker-continue-btn');
  }

  /**
   * Generates a random integer between 1 and 8 (inclusive)
   * @returns {number} Random number from 1 to 8
   */
  getRandomGrade(): number {
    return Math.floor(Math.random() * 8) + 1;
  }

  async selectGrade(grade: number) {
    const card = this.gradeCard.filter({ hasText: grade.toString() });
    const maxAttempts = 5;
    // Try clicking directly; if not clickable (out of viewport), slide and retry
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await card.click({ timeout: 1000 });
        return card;
      } catch {
        // Not in viewport → click the slider previous button
        await this.gradeSliderPrevButton.click();
      }
    }
  }

  async submitResponse500() {
    const responsePromise = this.page.waitForResponse(process.env.USER_ENDPOINT!);
    await this.gradePickerContinueButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(500);
  }

  async submitAndGetSubjects(grade: number) {
    // Prepare to wait for response from the API endpoint with subjects for the selected grade
    const responsePromise = this.page.waitForResponse(
      `${process.env.DASHBOARD_TEXTBOOKS_ENDPOINT}?limit=-1&include=sections,sections.lessons`
    );
    await this.gradePickerContinueButton.click();

    // Wait for and validate API response
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const data = await response.json();

    // Validate the subjects for the grade and collect names
    const subjectNames: string[] = [];
    for (const subjectData of data.data) {
      expect.soft(subjectData.grade.number, 
        `Tested grade is ${grade}, the subject "${subjectData.subject.name}" is for grade ${subjectData.grade.number}`
      ).toBe(grade); // Validate the subject is for the selected grade
      subjectNames.push(subjectData.subject.name); // Add the subject name to the subjectNames array
    }
    return subjectNames;
  }
}


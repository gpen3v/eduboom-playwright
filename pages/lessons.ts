import { expect, type Locator, type Page } from '@playwright/test';
import { gradeIDs, texts } from '../utils/testData.json'

export class LessonsPage {
  readonly page: Page;
  readonly lessonsContainer: Locator;
  readonly gradesSwiper: Locator;
  readonly gradeSliderNextButton: Locator;
  readonly gradeChip: Locator;
  readonly subjectsSection: Locator;
  readonly noSubjects: Locator;
  readonly subjectCardTitle: Locator

  constructor(page: Page) {
    this.page = page;
    this.lessonsContainer = page.locator('.lessons-page-grades-container');
    this.gradesSwiper = page.locator('.mySwiper');
    this.gradeSliderNextButton = this.gradesSwiper.locator('.slider-btn-next');
    this.gradeChip = page.locator('.grade');
    this.subjectsSection = page.locator('.subjects-wrap');
    this.noSubjects = page.locator('.subjects-wrap.soon');
    this.subjectCardTitle = this.subjectsSection.locator('.v-card-title');
  }

  async ensureGradeVisible(grade: number) {
    const nextGrade = grade + 1;
    if (nextGrade > 8) return; // no more grades, exit early
    const nextChip = this.page.getByTestId(`${nextGrade}-primary-school`);

    try {
      // Try to assert if the next chip is already in the viewport
      await expect(nextChip).toBeInViewport({ timeout: 500 });
      return; // It's visible, no need to slide
    } catch {
      // Not in viewport → click the slider next button
      await this.gradeSliderNextButton.click();
    }
  }

  async selectGradeAndValidateSubjects(grade: number): Promise<string[]> {
    const gradeChipNumber = this.page.getByTestId(`${grade}-primary-school`).locator('.v-card-item').first();
    const gradeNumberString = grade.toString() as keyof typeof gradeIDs;
    const gradeID = gradeIDs[gradeNumberString];

    // Prepare to wait for response from the API endpoint with subjects for the selected grade
    const responsePromise = this.page.waitForResponse(
      `${process.env.TEXTBOOKS_ENDPOINT}?limit=-1&include=subject&filter[grade_id]=${gradeID}`
    );

    // Select grade
    await this.ensureGradeVisible(grade);
    await gradeChipNumber.click();

    // Wait for and validate API response
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const data = await response.json();

    // In case there are no lessons for the grade
    if (data.data.length === 0) {
      await expect(this.subjectsSection).toHaveClass(/soon/);
      await expect(this.subjectsSection.locator('h4')).toHaveText(texts.soon);
      return [];
    }

    // Validate the subjects for the grade and collect names
    const subjectNames: string[] = [];
    for (const [index, subjectData] of data.data.entries()) {
      expect.soft(subjectData.grade.number,
        `Tested grade is ${grade}, the subject "${subjectData.subject.name}" is for grade ${subjectData.grade.number}`
      ).toBe(grade);
      await expect.soft(this.subjectCardTitle.nth(index)).toHaveText(subjectData.subject.name);
      subjectNames.push(subjectData.subject.name);
    }
    return subjectNames;
  }
}
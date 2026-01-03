import { type Locator, type Page } from '@playwright/test';

export class SubjectPage {
  readonly page: Page;
  readonly subjectHeaderTitle: Locator;
  readonly subjectSections: Locator;
  readonly lesson: Locator;
  readonly lessonTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.subjectHeaderTitle = page.locator('.subject-header__expanded__name');
    this.subjectSections = page.locator('.subject-sections');
    this.lesson = page.locator('.stepper-item');
    this.lessonTitle = page.locator('.stepper-content__body__text');
  }
}
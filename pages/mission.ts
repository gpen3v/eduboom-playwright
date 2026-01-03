import { type Locator, type Page } from '@playwright/test';

export class MissionPage {
  readonly page: Page;
  readonly missionTitle: Locator
  readonly missionWrapper
  readonly missionUnlocked: Locator;

  constructor(page: Page) {
    this.page = page;
    this.missionTitle = page.getByTestId('mission-title');
    this.missionWrapper = page.locator('.wrap-mission');
    this.missionUnlocked = page.getByTestId('mission-unlocked');
  }
}
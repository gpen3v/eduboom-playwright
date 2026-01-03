import { type Locator, type Page } from '@playwright/test';
import { texts } from '../utils/testData.json';

export class VideoLessonPage {
  readonly page: Page;
  readonly video: Locator;
  readonly videoWrapper: Locator
  readonly videoPlaying: Locator;
  readonly videoPaused: Locator;
  readonly videoSource: Locator;
  readonly closeButton: Locator;
  readonly playPauseButton: Locator;
  readonly rewindButton: Locator;
  readonly forwardButton: Locator;
  readonly muteButton: Locator;
  readonly speedButton: Locator;
  readonly videoOverlay: Locator;
  readonly backButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.video = page.locator('video');
    this.videoWrapper = page.locator('.video-js-wrap');
    this.videoPlaying = page.locator('.vjs-playing video');
    this.videoPaused = page.locator('.vjs-paused video');
    this.videoSource = this.video.locator('source');
    this.videoOverlay = page.locator('.video-overlay');
    this.playPauseButton = page.locator('.video-action-wrap button').nth(1);
    this.rewindButton = page.locator('.video-action-wrap button').first()
    this.forwardButton = page.locator('.video-action-wrap button').nth(2);
    this.muteButton = page.locator('.video-action-wrap-fixed button').first();
    this.speedButton = page.locator('.speed-toggle-btn');
    this.closeButton = page.locator('.close-button');
    this.backButton = page.locator('.back-button');
    this.continueButton = page.getByRole('button', { name: texts.continue });
  }
}
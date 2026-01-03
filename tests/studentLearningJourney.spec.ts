import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures.ts';
import { LessonsPage } from '../pages/lessons.ts';
import { SubjectPage } from '../pages/subject.ts';
import { MissionPage } from '../pages/mission.ts';
import { VideoLessonPage } from '../pages/videoLesson.ts';
import { paths } from '../utils/testData.json';

test.describe('Student Learning Journey', () => {
  let lessonsPage: LessonsPage;
  let subjectPage: SubjectPage;
  let missionPage: MissionPage;
  let lesson: VideoLessonPage;
  let subjectName: string | undefined;
  
  test('student can find and watch a video lesson', async ({ page }) => {
    lessonsPage = new LessonsPage(page);
    subjectPage = new SubjectPage(page);
    missionPage = new MissionPage(page);
    lesson = new VideoLessonPage(page);

    // Go to Lessons page
    await page.goto(paths.lessons);

    await expect(lessonsPage.gradeChip.first()).toBeVisible();
    if (lessonsPage.noSubjects) {
      // If no subjects for grade 1 select the first grade that has subjects (dynamic)
      for (let g = 2; g <= 8; g++) {
        const subjectNames = await lessonsPage.selectGradeAndValidateSubjects(g);
        if (subjectNames.length > 0) {
          subjectName = subjectNames[0];
          break;
        }
      }
      if (!subjectName) throw new Error('No grade with subjects found');
      // Go to the first subject
      await expect(lessonsPage.subjectCardTitle.first()).toHaveText(subjectName);
      await lessonsPage.subjectCardTitle.first().click();
    } else {
      // Go to the first subject for first grade
      subjectName = await lessonsPage.subjectCardTitle.first().innerText();
      await lessonsPage.subjectCardTitle.first().click();
    }
    // Validate subject page
    await expect(subjectPage.subjectHeaderTitle).toHaveText(subjectName);
    await expect(subjectPage.subjectSections).toBeVisible();

    // Select the first lesson for the selected subject and go to its mission page
    const lessonTitle = await subjectPage.lessonTitle.first().innerText();
    await subjectPage.lesson.first().click();
    await expect(missionPage.missionTitle).toHaveText(lessonTitle);
    await expect(missionPage.missionWrapper).toBeVisible();

    // Go to the only unlocked video lesson
    await missionPage.missionUnlocked.click();

    // Verify that the video player is visible and playing
    await expect(lesson.videoPlaying).toBeVisible();
    expect(await lesson.video.evaluate((v: HTMLVideoElement) => v.autoplay)).toBeTruthy();
    expect(await lesson.video.evaluate((v: HTMLVideoElement) => v.muted)).toBeFalsy();
    // Validate src in video is not empty
    const srcVideo = await lesson.video.getAttribute('src');
    expect(srcVideo).toBeTruthy();
    // Validate src in source is not empty  
    const srcSource = await lesson.videoSource.getAttribute('src');
    expect(srcSource).toBeTruthy();
    //Validate Continue and Back buttons are disabled at the start of the lesson
    await expect(lesson.continueButton).toBeDisabled();
    await expect(lesson.backButton).toHaveClass(/back-disabled/);
    //Video controls
    await lesson.videoWrapper.click();
    await expect(lesson.videoOverlay).toBeVisible();
    await expect(lesson.rewindButton).toBeVisible();
    await expect(lesson.forwardButton).toBeVisible();
    await expect(lesson.speedButton).toBeVisible();
    //Pause
    await lesson.playPauseButton.click();
    await expect(lesson.videoPaused).toBeVisible();
    //Play
    await lesson.playPauseButton.click();
    await expect(lesson.videoPlaying).toBeVisible();
    //Mute
    await lesson.muteButton.click();
    expect(await lesson.video.evaluate((v: HTMLVideoElement) => v.muted)).toBeTruthy();
    //Unmute
    await lesson.muteButton.click();
    expect(await lesson.video.evaluate((v: HTMLVideoElement) => v.muted)).toBeFalsy();

    //Close Video to go back to the mission page
    await lesson.closeButton.click();
    await expect(missionPage.missionTitle).toBeVisible();
  });
});

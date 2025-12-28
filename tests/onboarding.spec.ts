import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures.ts';
import { OnboardingPage } from '../pages/onboarding.ts';
import { DashboardPage } from '../pages/dashboard.ts';
import { paths } from '../utils/testData.json'


test('Onboarding Flow', async ({ page, context }) => {

  const onboarding = new OnboardingPage(page);
  const dashboard = new DashboardPage(page);
  const testedGrade = 8;

  // Go to Onboarding page
  await page.goto(paths.onboarding);
  await expect(page.locator('.cookie-wrap')).not.toBeVisible();
  

  // Select the Student role
  await expect(onboarding.rolePicker).toBeVisible();
  await expect(onboarding.rolePickerContinueButton).toBeDisabled();
  await onboarding.studentRoleCard.click();
  await expect(onboarding.studentRoleCheckedIcon).toBeVisible();
  await expect(onboarding.rolePickerContinueButton).toBeEnabled();
  await onboarding.rolePickerContinueButton.click();

  // Select a grade
  await expect(onboarding.studentGradePicker).toBeVisible();
  await expect(onboarding.gradePickerContinueButton).toBeEnabled();
  const selectedGrade = await onboarding.selectGrade(testedGrade);
  await expect(selectedGrade).toHaveClass(/grade-card--active/);
  await onboarding.gradePickerContinueButton.click();

  // Vlidate Student's dashboard content
  const userGrade = await dashboard.getUserGrade();
  expect(userGrade).toBe(testedGrade);
  await expect(page).toHaveURL(paths.dashboard);
  await expect(dashboard.dashboardWrapper).toBeVisible();
  await dashboard.validateSubjectsGrade(testedGrade);
});
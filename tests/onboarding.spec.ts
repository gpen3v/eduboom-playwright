import { expect } from '@playwright/test';
import { test } from '../utils/fixtures.ts';
import { OnboardingPage } from '../pages/onboarding.ts';
import { DashboardPage } from '../pages/dashboard.ts';
import { paths } from '../utils/testData.json'


test('Onboarding Flow', async ({ page }) => {

  const onboarding = new OnboardingPage(page);
  const dashboard = new DashboardPage(page);

  await page.goto(paths.onboarding);
  await expect(page.locator('.cookie-wrap')).not.toBeVisible();

  await expect(onboarding.rolePicker).toBeVisible();
  await onboarding.studentRoleCard.click();
  await onboarding.rolePickerContinueButton.click();
  await onboarding.gradeCard.filter({ hasText: '8' }).click();
  await onboarding.gradePickerContinueButton.click();

  await expect(dashboard.dashboardWrapper).toBeVisible();

});
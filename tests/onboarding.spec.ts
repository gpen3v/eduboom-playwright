import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures.ts';
import { OnboardingPage } from '../pages/onboarding.ts';
import { DashboardPage } from '../pages/dashboard.ts';
import { paths } from '../utils/testData.json';

test.describe('Onboarding Flow', () => {
  let onboarding: OnboardingPage;
  let dashboard: DashboardPage;
  let testedGrade: number;

  test.beforeEach(async ({ page }) => {
    onboarding = new OnboardingPage(page);
    dashboard = new DashboardPage(page);
    testedGrade = 8;

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

    // Remove fixture mock to have the real response and to get the grade later
    await page.unroute(`${process.env.USER_ENDPOINT}`);
  });

  test('Positive Scenario - Successful Onboarding', async ({ page }) => {
    // Continue to Dashboard
    const userGrade = await onboarding.submitAndGetGrade(); // Click Continue and get the grade of the user
    expect(userGrade).toBe(testedGrade);

    // Vlidate Student's dashboard content
    await expect(page).toHaveURL(paths.dashboard);
    await expect(dashboard.dashboardWrapper).toBeVisible();
    await dashboard.validateSubjectsGrade(testedGrade);
  });

  test('Negative Scenario - Status 500 Internal Server Error', async ({ page }) => {
    // Mock API to return error
    await page.route(process.env.USER_ENDPOINT!, route => {
      route.fulfill({
        status: 500,
        json: { message: 'Internal Server Error' }
      });
    });

    // Attempt to Continue to Dashboard
    await onboarding.submitResponse500();

    // Vlidate student is not redirected to dashboard
    await expect(page).not.toHaveURL(paths.dashboard);
    await expect(dashboard.dashboardWrapper).not.toBeVisible();
  });
});
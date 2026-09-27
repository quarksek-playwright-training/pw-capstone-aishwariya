import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/SignupPage';

test(
  'Signup with an existing account email',
  { tag: ['@regression', '@auth', '@negative'] },
  async ({ page }) => {
    const signupPage = new SignupPage(page);

    await signupPage.navigateTo('/notes/app/register');

    await signupPage.register(
      process.env.ACCOUNT1_EMAIL!,
      'Duplicate Account',
      'TestPassword123!',
      'TestPassword123!',
    );

    await expect(
      page.getByText('An account already exists with the same email address'),
    ).toBeVisible();

    await expect(page).toHaveURL(/\/register/);
  },
);
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test(
  'Login with valid email and incorrect password',
  { tag: ['@regression', '@auth', '@negative'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateTo('/notes/app/login');

    await loginPage.login(
      process.env.ACCOUNT1_EMAIL!,
      'WrongPassword123!',
    );

    await expect(
      page.getByTestId('alert-message'),
    ).toHaveText('Incorrect email address or password');

    await expect(page).toHaveURL(/\/login/);
  },
);
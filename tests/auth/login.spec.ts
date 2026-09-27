import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('Login with valid credentials', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigateTo('/notes/app/login');

  await loginPage.login(
    process.env.ACCOUNT1_EMAIL!,
    process.env.ACCOUNT1_PASSWORD!,
  );

  await expect(page).not.toHaveURL(/\/login/);
});
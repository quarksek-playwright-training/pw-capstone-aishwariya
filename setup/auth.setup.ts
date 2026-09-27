import 'dotenv/config';
import 'dotenv/config';
import { test as setup, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

const account1Email = process.env.ACCOUNT1_EMAIL;
const account1Password = process.env.ACCOUNT1_PASSWORD;

const account2Email = process.env.ACCOUNT2_EMAIL;
const account2Password = process.env.ACCOUNT2_PASSWORD;

if (!account1Email || !account1Password || !account2Email || !account2Password) {
  throw new Error('Account credentials are missing from .env');
}

async function createOrLoginAccount(
  page: Page,
  email: string,
  password: string,
  name: string,
) {
  const signupPage = new SignupPage(page);
  const loginPage = new LoginPage(page);

  await signupPage.navigateTo('/notes/app/register');

  await signupPage.register(email, name, password, password);

  const duplicateMessage = page.getByText(
    'An account already exists with the same email address',
  );

  if (await duplicateMessage.isVisible()) {
    console.log('Account already exists. Navigating to login.');
  } else {
    console.log('Account registration completed.');
  }

 await loginPage.navigateTo('/notes/app/login');

  await loginPage.login(email, password);
 
await expect(
  page.getByTestId('add-new-note'),
).toBeVisible({ timeout: 15000 });

}

setup('authenticate account 1', async ({ page }) => {
  await createOrLoginAccount(
    page,
    account1Email,
    account1Password,
    'Account One',
  );

  await page.context().storageState({
    path: '.auth/account1.json',
  });
});

setup('authenticate account 2', async ({ page }) => {
  await createOrLoginAccount(
    page,
    account2Email,
    account2Password,
    'Account Two',
  );

  await page.context().storageState({
    path: '.auth/account2.json',
  });
});
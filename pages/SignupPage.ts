import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly emailInput: Locator;
  readonly nameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByTestId('register-email');
    this.nameInput = page.getByTestId('register-name');
    this.passwordInput = page.getByTestId('register-password');
    this.confirmPasswordInput = page.getByTestId(
      'register-confirm-password',
    );
    this.registerButton = page.getByTestId('register-submit');
  }

  async register(
    email: string,
    name: string,
    password: string,
    confirmPassword: string,
  ) {
    await this.emailInput.fill(email);
    await this.nameInput.fill(name);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.registerButton.click();
  }
}
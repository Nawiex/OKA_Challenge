import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly navSignupButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitSignupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navSignupButton = page.locator('#signin2');
    this.usernameInput = page.locator('#sign-username');
    this.passwordInput = page.locator('#sign-password');
    this.submitSignupButton = page.getByRole('button', { name: 'Sign up' });
  }

  async register(username: string, password: string) {
    await this.navSignupButton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitSignupButton.click();
  }
}
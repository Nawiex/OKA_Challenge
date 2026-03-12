import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly navLoginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitLoginButton: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLoginButton = page.locator('#login2');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.submitLoginButton = page.getByRole('button', { name: 'Log in' });
    this.welcomeMessage = page.locator('#nameofuser');
  }

  async login(username: string, password: string) {
    await this.navLoginButton.click();
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitLoginButton.click();
  }
}
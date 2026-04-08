import { Page, expect } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  // — Locators —
  private usernameInput = this.page.locator('input[name="usernameRegisterPage"]');
  private emailInput = this.page.locator('input[name="emailRegisterPage"]');
  private passwordInput = this.page.locator('input[name="passwordRegisterPage"]');
  private confirmPasswordInput = this.page.locator('input[name="confirm_passwordRegisterPage"]');
  private iAgreeCheckbox = this.page.locator('input[name="i_agree"]');
  private registerButton = this.page.getByRole('button', { name: 'REGISTER' });
  private successCover = this.page.locator('#registerSuccessCover');
  private loggedInUsername = this.page.locator('span.hi-user').first();

  private generatedUsername = '';
  private readonly generatedPassword = process.env.TEST_PASSWORD!;

  // — Getters —
  getGeneratedUsername() { return this.generatedUsername; }
  getGeneratedPassword() { return this.generatedPassword; }

  // — Actions —
  async goto() {
    await this.page.goto('/#/register');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillRegistrationForm() {
    const suffix = Date.now().toString().slice(-4);
    const base = process.env.TEST_USERNAME!.slice(0, 10); // cap at 10 so base_XXXX ≤ 15
    this.generatedUsername = `${base}_${suffix}`;
    const [localPart, domain] = process.env.TEST_EMAIL!.split('@');
    const email = `${localPart}_${suffix}@${domain}`;
    const password = process.env.TEST_PASSWORD!;

    await this.usernameInput.fill(this.generatedUsername);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async acceptTerms() {
    await this.iAgreeCheckbox.check();
  }

  async submitRegistration() {
    await expect(this.registerButton).toBeEnabled();
    await this.registerButton.click();
  }

  // — Assertions —
  async verifyLoggedIn() {
    await expect(this.loggedInUsername).not.toHaveClass(/ng-hide/, { timeout: 10000 });
    await expect(this.loggedInUsername).toContainText(this.generatedUsername);
  }
}

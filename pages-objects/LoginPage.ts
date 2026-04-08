import { Page, expect } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  // — Locators —
  private modal = this.page
    .locator('.login-container, [class*="login"], form[name="loginForm"]')
    .first();
  private advantageLogo = this.page
    .locator('.login-container img, [class*="login"] img')
    .first();
  private facebookButton = this.page
    .locator('[class*="facebook"], [class*="social"]')
    .filter({ hasText: /SIGN IN WITH FACEBOOK/i });
  private orDivider = this.page.locator("text=OR").first();
  private usernameInput = this.page.locator('input[name="username"]');
  private passwordInput = this.page.locator('input[name="password"]');
  private rememberMeCheckbox = this.page.locator('input[name="remember_me"]');
  private signInButton = this.page.locator('#sign_in_btn');
  private forgotPasswordLink = this.page.getByRole("link", {
    name: "Forgot your password?",
  });
  private createAccountLink = this.page.getByRole("link", {
    name: "CREATE NEW ACCOUNT",
  });
  private loggedInUsername = this.page.locator("span.hi-user").first();
  private loginResultMessage = this.page.locator('#signInResultMessage');
  private closeButton = this.page.locator('.loginPopUpCloseBtn');

  // — Actions —
  async goto() {
    await this.page.goto("/#/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async openModal() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page
      .getByRole("link", { name: "UserMenu" })
      .click({ force: true });
    await this.usernameInput.waitFor({ state: "visible", timeout: 10000 });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async clickCreateAccount() {
    await this.createAccountLink.click();
  }

  async closeModal() {
    await this.closeButton.click();
    await this.usernameInput.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async signOut() {
    await this.page.evaluate(() => {
      const signOutEl = document.querySelector<HTMLElement>('[ng-click="signOut($event)"]');
      if (signOutEl) signOutEl.click();
    });
    await this.loggedInUsername.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async loginWithCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.page.evaluate(() => {
      (document.getElementById('sign_in_btn') as HTMLElement).click();
    });
  }

  // — Assertions —
  async verifyModalIsDisplayed() {
    await expect(this.usernameInput).toBeVisible();
  }

  async verifyAdvantageLogo() {
    await expect(this.advantageLogo).toBeVisible();
  }

  async verifyFacebookButton() {
    await expect(this.facebookButton).toBeVisible();
  }

  async verifyOrDivider() {
    await expect(this.orDivider).toBeVisible();
  }

  async verifyUsernameField() {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill("testuser");
    await expect(this.signInButton).toBeDisabled();
    await this.usernameInput.fill("");
  }

  async verifyPasswordField() {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill("testpass");
    await expect(this.signInButton).toBeDisabled();
    await this.passwordInput.fill("");
  }

  async verifyRememberMeCheckbox() {
    await expect(this.rememberMeCheckbox).toBeVisible();
    await expect(this.rememberMeCheckbox).not.toBeChecked();
  }

  async verifySignInButtonVisible() {
    await expect(this.signInButton).toBeVisible();
  }

  async verifySignInButtonDisabledWhenEmpty() {
    await expect(this.usernameInput).toHaveValue("");
    await expect(this.passwordInput).toHaveValue("");
    await expect(this.signInButton).toBeDisabled();
  }

  async verifyForgotPasswordLink() {
    await expect(this.forgotPasswordLink).toBeVisible();
  }

  async verifyCreateAccountLink() {
    await expect(this.createAccountLink).toBeVisible();
  }

  // Returns true if a login error message is displayed (credentials were rejected)
  async hasLoginError(): Promise<boolean> {
    try {
      await expect(this.loginResultMessage).not.toHaveText('OR', { timeout: 8000 });
      return true; // text changed away from "OR" → error appeared
    } catch {
      return false; // timeout or element gone → login succeeded / modal closed
    }
  }

  async verifyLoggedIn(username: string) {
    await expect(this.loggedInUsername).not.toHaveClass(/ng-hide/, { timeout: 10000 });
    await expect(this.loggedInUsername).toContainText(username);
  }
}

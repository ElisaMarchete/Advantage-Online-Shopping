/**
 * TC-117 — Verify "Remember Me" Checkbox Visibility and Functionality on Sign-In Modal
 * https://advantageonlineshopping.com
 *
 * Primary path : sign in with .env credentials + Remember Me checked,
 *                sign out, reopen modal, verify fields are pre-filled, sign in again.
 * Fallback path: if .env credentials are rejected, register a fresh account and
 *                repeat the same Remember Me flow with the new credentials.
 */
import { test } from "../fixtures/index";

test(
  'Verify "Remember Me" Checkbox Visibility and Functionality on Sign-In Modal',
  { timeout: 90000 },
  async ({ page, loginPage, registerPage, credentials }) => {
    // Step 1: Navigate to homepage and open the Sign-In modal
    await loginPage.goto();
    await loginPage.openModal();
    await loginPage.verifyModalIsDisplayed();

    // Step 2: Verify "Remember Me" checkbox is visible and unchecked by default
    await loginPage.verifyRememberMeCheckbox();

    // Step 3: Enter valid username and password
    await loginPage.fillBothFields(credentials.username, credentials.password);

    // Step 4: Check the "Remember Me" checkbox
    await loginPage.checkRememberMe();

    // Step 5: Click the "SIGN IN" button
    await loginPage.clickSignInButton();

    let activeUsername: string;

    if (await loginPage.hasLoginError()) {
      // Fallback: .env credentials rejected — register a fresh account
      await loginPage.closeModal();
      await page.reload();
      await page.waitForLoadState("domcontentloaded");

      await loginPage.openModal();
      await loginPage.clickCreateAccount();
      await page.waitForURL("**/register", { timeout: 10000 });

      await registerPage.fillRegistrationForm();
      await registerPage.acceptTerms();
      await registerPage.submitRegistration();
      await page.waitForURL("**/advantageonlineshopping.com/#/", {
        timeout: 15000,
      });

      // Sign out so we can exercise the Remember Me flow with the new account
      await loginPage.signOut();
      await loginPage.openModal();
      await loginPage.fillBothFields(
        registerPage.getGeneratedUsername(),
        registerPage.getGeneratedPassword(),
      );
      await loginPage.checkRememberMe();
      await loginPage.clickSignInButton();
      activeUsername = registerPage.getGeneratedUsername();
    } else {
      activeUsername = credentials.username;
    }

    // Step 6: Confirm the user is logged in
    await loginPage.verifyLoggedIn(activeUsername);

    // Step 7: Sign out
    await loginPage.signOut();

    // Step 8: Open the Sign-In modal again
    await loginPage.openModal();
    await loginPage.verifyModalIsDisplayed();

    // Step 9: Verify username and password fields are pre-filled (credentials were remembered)
    await loginPage.verifyCredentialsPreFilled(activeUsername);

    // Step 10: Click "SIGN IN" and confirm the user is logged in again
    await loginPage.clickSignInButton();
    await loginPage.verifyLoggedIn(activeUsername);
  },
);

/**
 * TC-115 — Verify Sign-In Functionality with Valid Credentials
 * https://advantageonlineshopping.com
 */
import { test } from "../fixtures/index";

test(
  "Verify Sign-In Functionality with Valid Credentials",
  { timeout: 60000 },
  async ({ page, loginPage, registerPage, credentials }) => {
    // Step 1: Navigate to homepage and open the Sign-In modal
    await loginPage.goto();
    await loginPage.openModal();
    await loginPage.verifyModalIsDisplayed();

    // Step 2: Attempt sign-in with credentials from fixture
    await loginPage.loginWithCredentials(
      credentials.username,
      credentials.password,
    );

    let activeUsername: string;

    if (await loginPage.hasLoginError()) {
      // Fallback: .env credentials were rejected — reset Angular state, then use TC-112 flow
      await loginPage.closeModal();
      await page.reload();
      await page.waitForLoadState("domcontentloaded");

      // Mirror TC-112: open modal → click CREATE NEW ACCOUNT → register
      await loginPage.openModal();
      await loginPage.clickCreateAccount();
      await page.waitForURL("**/register", { timeout: 10000 });

      await registerPage.fillRegistrationForm();
      await registerPage.acceptTerms();
      await registerPage.submitRegistration();
      await page.waitForURL("**/advantageonlineshopping.com/#/", {
        timeout: 15000,
      });

      // Sign out to exercise the sign-in flow with the newly created credentials
      await loginPage.signOut();
      await loginPage.openModal();
      await loginPage.loginWithCredentials(
        registerPage.getGeneratedUsername(),
        registerPage.getGeneratedPassword(),
      );
      activeUsername = registerPage.getGeneratedUsername();
    } else {
      // Primary path: .env credentials worked
      activeUsername = credentials.username;
    }

    // Step 3 & 4: Verify user is logged in and username appears in header
    await loginPage.verifyLoggedIn(activeUsername);
  },
);

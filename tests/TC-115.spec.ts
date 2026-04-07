/**
 * TC-115 — Verify Sign-In Functionality with Valid Credentials
 * https://advantageonlineshopping.com
 */
import { test } from '../fixtures/index';

test('Verify Sign-In Functionality with Valid Credentials', async ({ page, loginPage, registerPage }) => {
  // Setup: Register a fresh account using existing registration flow
  await loginPage.goto();
  await loginPage.openModal();
  await loginPage.clickCreateAccount();
  await page.waitForURL('**/register', { timeout: 10000 });
  await registerPage.fillRegistrationForm();
  await registerPage.acceptTerms();
  await registerPage.submitRegistration();
  await page.waitForURL('**/advantageonlineshopping.com/#/', { timeout: 15000 });

  // Sign out so we can test the sign-in flow
  await loginPage.signOut();

  // Step 1: Open the Sign-In modal
  await loginPage.openModal();
  await loginPage.verifyModalIsDisplayed();

  // Step 2: Enter valid credentials and sign in
  await loginPage.loginWithCredentials(
    registerPage.getGeneratedUsername(),
    registerPage.getGeneratedPassword()
  );

  // Step 3 & 4: Verify user is logged in and username appears in header
  await loginPage.verifyLoggedIn(registerPage.getGeneratedUsername());
});

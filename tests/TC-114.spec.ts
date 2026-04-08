/**
 * TC-114 — Validate State of "SIGN IN" Button Based on Input Fields
 * https://advantageonlineshopping.com
 */
import { test } from "../fixtures/index";

test('Validate State of "SIGN IN" Button Based on Input Fields', async ({
  loginPage,
  credentials,
}) => {
  // Step 1: Navigate to homepage and open the Sign-In modal
  await loginPage.goto();
  await loginPage.openModal();
  await loginPage.verifyModalIsDisplayed();

  // Step 2: Valid username, empty password → button must be disabled
  await loginPage.fillUsernameOnly(credentials.username);
  await loginPage.verifySignInButtonDisabled();

  // Step 3: Empty username, valid password → button must be disabled
  await loginPage.fillPasswordOnly(credentials.password);
  await loginPage.verifySignInButtonDisabled();

  // Step 4: Both fields filled with valid credentials → button must be enabled
  await loginPage.fillBothFields(credentials.username, credentials.password);
  await loginPage.verifySignInButtonEnabled();

  // Step 5: Click "CREATE NEW ACCOUNT" → redirected to registration page
  await loginPage.clickCreateAccount();
  await loginPage.verifyRedirectedToRegisterPage();
});

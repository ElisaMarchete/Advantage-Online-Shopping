/**
 * TC-113 — Verify Content and Elements of the Sign-In Modal
 * https://advantageonlineshopping.com
 */
import { test } from "../fixtures/index";

test("Verify Content and Elements of the Sign-In Modal", async ({
  loginPage,
}) => {
  await loginPage.goto();
  await loginPage.openModal();

  // Step 1: Clicking the user menu icon displays the sign-in modal
  await loginPage.verifyModalIsDisplayed();

  // Step 2: Advantage logo is displayed at the top of the modal
  await loginPage.verifyAdvantageLogo();

  // Step 3: "SIGN IN WITH FACEBOOK" button with Facebook logo is visible
  await loginPage.verifyFacebookButton();

  // Step 4: "OR" text is displayed below the Facebook sign-in button
  await loginPage.verifyOrDivider();

  // Step 5: Username input field is visible and marked as required
  await loginPage.verifyUsernameField();

  // Step 6: Password input field is visible and marked as required
  await loginPage.verifyPasswordField();

  // Step 7: "REMEMBER ME" checkbox is displayed and unchecked by default
  await loginPage.verifyRememberMeCheckbox();

  // Step 8: "SIGN IN" button is displayed
  await loginPage.verifySignInButtonVisible();

  // Step 9: "SIGN IN" button is disabled when no credentials are entered
  await loginPage.verifySignInButtonDisabledWhenEmpty();

  // Step 10: "Forgot your password?" link is displayed below the sign-in button
  await loginPage.verifyForgotPasswordLink();

  // Step 11: "CREATE NEW ACCOUNT" link is displayed at the bottom of the modal
  await loginPage.verifyCreateAccountLink();
});

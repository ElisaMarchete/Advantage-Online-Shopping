/**
 * TC-112 — User Registration: Create New Account
 * https://advantageonlineshopping.com
 */
import { test } from '../fixtures/index';

test('User Registration - Create New Account', async ({ page, loginPage, registerPage }) => {
  // Step 1: Navigate to homepage and open the Sign-In modal
  await loginPage.goto();
  await loginPage.openModal();
  await loginPage.verifyModalIsDisplayed();

  // Step 2: Click "CREATE NEW ACCOUNT" → redirected to registration page
  await loginPage.clickCreateAccount();
  await page.waitForURL('**/register', { timeout: 10000 });

  // Step 3: Fill in all required fields
  await registerPage.fillRegistrationForm();

  // Step 4: Accept terms and privacy policy
  await registerPage.acceptTerms();

  // Step 5: Click the REGISTER button
  await registerPage.submitRegistration();

  // Step 6: Account is created and user is auto-logged in — app redirects to homepage
  await page.waitForURL('**/advantageonlineshopping.com/#/', { timeout: 15000 });

  // Step 7: Verify the username is visible next to the user menu icon in the header
  await registerPage.verifyLoggedIn();
});

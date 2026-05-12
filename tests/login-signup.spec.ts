/**
 * Login and Sign Up — combined spec
 * Covers: TC-112, TC-113, TC-114, TC-115, TC-117
 * https://advantageonlineshopping.com
 */
import { test } from '../fixtures/index';

test.describe('Sign Up - User Registration and Sign In - Login Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.openModal();
    await loginPage.verifyModalIsDisplayed();
  });

    // TC-112
  test('User Registration - Create New Account', async ({ page, loginPage, registerPage }) => {
    // Click "CREATE NEW ACCOUNT" → redirected to registration page
    await loginPage.clickCreateAccount();
    await page.waitForURL('**/register', { timeout: 10000 });

    // Fill in all required fields
    await registerPage.fillRegistrationForm();

    // Accept terms and privacy policy
    await registerPage.acceptTerms();

    // Click the REGISTER button
    await registerPage.submitRegistration();

    // Account is created and user is auto-logged in — app redirects to homepage
    await page.waitForURL('**/advantageonlineshopping.com/#/', { timeout: 15000 });

    // Verify the username is visible next to the user menu icon in the header
    await registerPage.verifyLoggedIn();
  });

  // TC-113
  test('Verify Content and Elements of the Sign-In Modal', async ({ loginPage }) => {
    // Advantage logo is displayed at the top of the modal
    await loginPage.verifyAdvantageLogo();

    // "SIGN IN WITH FACEBOOK" button with Facebook logo is visible
    await loginPage.verifyFacebookButton();

    // "OR" text is displayed below the Facebook sign-in button
    await loginPage.verifyOrDivider();

    // Username input field is visible and marked as required
    await loginPage.verifyUsernameField();

    // Password input field is visible and marked as required
    await loginPage.verifyPasswordField();

    // "REMEMBER ME" checkbox is displayed and unchecked by default
    await loginPage.verifyRememberMeCheckbox();

    // "SIGN IN" button is displayed
    await loginPage.verifySignInButtonVisible();

    // "SIGN IN" button is disabled when no credentials are entered
    await loginPage.verifySignInButtonDisabledWhenEmpty();

    // "Forgot your password?" link is displayed below the sign-in button
    await loginPage.verifyForgotPasswordLink();

    // "CREATE NEW ACCOUNT" link is displayed at the bottom of the modal
    await loginPage.verifyCreateAccountLink();
  });

  // TC-114
  test('Validate State of "SIGN IN" Button Based on Input Fields', async ({ loginPage, credentials }) => {
    // Valid username, empty password → button must be disabled
    await loginPage.fillUsernameOnly(credentials.username);
    await loginPage.verifySignInButtonDisabled();

    // Empty username, valid password → button must be disabled
    await loginPage.fillPasswordOnly(credentials.password);
    await loginPage.verifySignInButtonDisabled();

    // Both fields filled with valid credentials → button must be enabled
    await loginPage.fillBothFields(credentials.username, credentials.password);
    await loginPage.verifySignInButtonEnabled();

    // Click "CREATE NEW ACCOUNT" → redirected to registration page
    await loginPage.clickCreateAccount();
    await loginPage.verifyRedirectedToRegisterPage();
  });

  // TC-115
  test(
    'Verify Sign-In Functionality with Valid Credentials',
    { timeout: 60000 },
    async ({ page, loginPage, registerPage, credentials }) => {
      // Attempt sign-in with credentials from fixture
      await loginPage.loginWithCredentials(credentials.username, credentials.password);

      let activeUsername: string;

      if (await loginPage.hasLoginError()) {
        // Fallback: .env credentials were rejected — reset Angular state, then use TC-112 flow
        await loginPage.closeModal();
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Open modal → click CREATE NEW ACCOUNT → register
        await loginPage.openModal();
        await loginPage.clickCreateAccount();
        await page.waitForURL('**/register', { timeout: 10000 });

        await registerPage.fillRegistrationForm();
        await registerPage.acceptTerms();
        await registerPage.submitRegistration();
        await page.waitForURL('**/advantageonlineshopping.com/#/', { timeout: 15000 });

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

      // Verify user is logged in and username appears in header
      await loginPage.verifyLoggedIn(activeUsername);
    },
  );

  // TC-117
  test(
    'Verify "Remember Me" Checkbox Visibility and Functionality on Sign-In Modal',
    { timeout: 90000 },
    async ({ page, loginPage, registerPage, credentials }) => {
      // Verify "Remember Me" checkbox is visible and unchecked by default
      await loginPage.verifyRememberMeCheckbox();

      // Enter valid username and password
      await loginPage.fillBothFields(credentials.username, credentials.password);

      // Check the "Remember Me" checkbox
      await loginPage.checkRememberMe();

      // Click the "SIGN IN" button
      await loginPage.clickSignInButton();

      let activeUsername: string;

      if (await loginPage.hasLoginError()) {
        // Fallback: .env credentials rejected — register a fresh account
        await loginPage.closeModal();
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        await loginPage.openModal();
        await loginPage.clickCreateAccount();
        await page.waitForURL('**/register', { timeout: 10000 });

        await registerPage.fillRegistrationForm();
        await registerPage.acceptTerms();
        await registerPage.submitRegistration();
        await page.waitForURL('**/advantageonlineshopping.com/#/', { timeout: 15000 });

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

      // Confirm the user is logged in
      await loginPage.verifyLoggedIn(activeUsername);

      // Sign out
      await loginPage.signOut();

      // Open the Sign-In modal again
      await loginPage.openModal();
      await loginPage.verifyModalIsDisplayed();

      // Verify username and password fields are pre-filled (credentials were remembered)
      await loginPage.verifyCredentialsPreFilled(activeUsername);

      // Click "SIGN IN" and confirm the user is logged in again
      await loginPage.clickSignInButton();
      await loginPage.verifyLoggedIn(activeUsername);
    },
  );
});

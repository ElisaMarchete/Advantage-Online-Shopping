import { test as base } from '@playwright/test';
import { LoginPage } from '../pages-objects/LoginPage';
import { RegisterPage } from '../pages-objects/RegisterPage';

type Credentials = {
  username: string;
  password: string;
};

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  credentials: Credentials;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  credentials: async ({}, use) => {
    await use({
      username: process.env.TEST_USERNAME!,
      password: process.env.TEST_PASSWORD!,
    });
  },
});

export { expect } from '@playwright/test';

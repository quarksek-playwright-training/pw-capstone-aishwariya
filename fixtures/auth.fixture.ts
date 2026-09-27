import { test as base, Page } from '@playwright/test';

type AuthFixtures = {
  account1Page: Page;
  account2Page: Page;
};

export const test = base.extend<AuthFixtures>({
  account1Page: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '.auth/account1.json',
    });

    const page = await context.newPage();

    await use(page);

    await context.close();
  },

  account2Page: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '.auth/account2.json',
    });

    const page = await context.newPage();

    await use(page);

    await context.close();
  },
});

export { expect } from '@playwright/test';
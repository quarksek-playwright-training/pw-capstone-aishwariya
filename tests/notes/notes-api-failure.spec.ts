import { test, expect } from '../../fixtures/auth.fixture';

test(
  'Shows a visible state when notes API fails',
  { tag: ['@regression', '@notes', '@negative'] },
  async ({ account1Page }) => {
    await account1Page.route('**/notes/api/notes', async route => {
      await route.abort();
    });

    await account1Page.goto('/notes/app', {
      waitUntil: 'commit',
      timeout: 15000,
    });

    await expect(
      account1Page.getByText('Loading...'),
    ).toBeVisible();
  },
);
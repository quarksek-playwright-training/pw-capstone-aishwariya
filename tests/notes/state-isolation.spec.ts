
import { test, expect } from '../../fixtures/auth.fixture';
import { NotesPage } from '../../pages/NotesPage';

let createdNoteId: string | undefined;
let authToken: string | undefined;

test.afterEach(async ({ account1Page }) => {
  if (!createdNoteId || !authToken) {
    return;
  }

  await account1Page.context().request.delete(
    `/notes/api/notes/${createdNoteId}`,
    {
      headers: {
        'x-auth-token': authToken,
      },
    },
  );

  createdNoteId = undefined;
  authToken = undefined;
});

test(
  'Account 1 note is not visible to Account 2',
  { tag: ['@regression', '@notes'] },
  async ({ account1Page, account2Page }) => {
    const notesPage = new NotesPage(account1Page);

    const noteTitle = `Account 1 Private Note ${Date.now()}`;

    await notesPage.navigateTo('/notes/app');

    authToken = await account1Page.evaluate(() => {
      return localStorage.getItem('token') ?? undefined;
    });

    await notesPage.openCreateNoteForm();

    const createResponsePromise = account1Page.waitForResponse(
      response =>
        response.request().method() === 'POST' &&
        response.url().includes('/notes/api/notes'),
    );

    await notesPage.createNote(
      noteTitle,
      'This note belongs to account 1',
      'Work',
    );

    const createResponse = await createResponsePromise;
    const responseBody = await createResponse.json();

    createdNoteId = responseBody.data.id;

    const account1Note = account1Page
      .getByTestId('note-card-title')
      .filter({ hasText: noteTitle });

    await expect(account1Note).toBeVisible({ timeout: 10000 });

    await account2Page.goto('/notes/app');

    await expect(
      account2Page
        .getByTestId('note-card-title')
        .filter({ hasText: noteTitle }),
    ).toHaveCount(0);
  },
);


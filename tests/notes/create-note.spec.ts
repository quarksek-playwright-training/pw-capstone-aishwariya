
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
  'Create a note and filter it by category',
  { tag: ['@smoke', '@notes'] },
  async ({ account1Page }) => {
    const notesPage = new NotesPage(account1Page);

    const noteTitle = `Playwright Test Note ${Date.now()}`;
    const noteDescription = 'This is a test note';

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
      noteDescription,
      'Work',
    );

    const createResponse = await createResponsePromise;
    const responseBody = await createResponse.json();

    createdNoteId = responseBody.data.id;

    await notesPage.filterByCategory('Work');

    // XPath is used because the note card does not have a unique test ID
    // that directly identifies the card by its title.
    const noteCard = account1Page.locator(
      `//div[@data-testid="note-card-title" and normalize-space()="${noteTitle}"]/..`,
    );

    await expect(noteCard).toContainText(noteTitle);

    // XPath with the sibling axis is used because the description is located
    // in the sibling card-body element of the note title element.
    const noteDescriptionLocator = account1Page.locator(
      `//div[@data-testid="note-card-title" and normalize-space()="${noteTitle}"]/following-sibling::div[contains(@class, "card-body")]//p[@data-testid="note-card-description"]`,
    );

    await expect(noteDescriptionLocator).toContainText(noteDescription);
  },
);

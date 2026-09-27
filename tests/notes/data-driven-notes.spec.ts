
import { test, expect } from '../../fixtures/auth.fixture';
import { NotesPage } from '../../pages/NotesPage';
import { notesData } from './data-driven-notes.data';

let createdNoteIds: string[] = [];
let authToken: string | undefined;

test.afterEach(async ({ account1Page }) => {
  if (!authToken || createdNoteIds.length === 0) {
    return;
  }

  for (const noteId of createdNoteIds) {
    await account1Page.context().request.delete(
      `/notes/api/notes/${noteId}`,
      {
        headers: {
          'x-auth-token': authToken,
        },
      },
    );
  }

  createdNoteIds = [];
  authToken = undefined;
});

test(
  'Create notes from data and verify category filters',
  { tag: ['@regression', '@notes'] },
  async ({ account1Page }) => {
    const notesPage = new NotesPage(account1Page);

    await notesPage.navigateTo('/notes/app');

    await expect(notesPage.addNoteButton).toBeVisible();

    authToken = await account1Page.evaluate(() => {
      return localStorage.getItem('token') ?? undefined;
    });

    for (const note of notesData) {
      await notesPage.openCreateNoteForm();

      await expect(notesPage.titleInput).toBeVisible();

      const createResponsePromise = account1Page.waitForResponse(
        response =>
          response.request().method() === 'POST' &&
          response.url().includes('/notes/api/notes'),
      );

      await notesPage.createNote(
        note.title,
        note.description,
        note.category,
      );

      const createResponse = await createResponsePromise;
      const responseBody = await createResponse.json();

      createdNoteIds.push(responseBody.data.id);
    }

    for (const note of notesData) {
      await notesPage.filterByCategory(note.category);

      const noteCard = account1Page
        .getByTestId('note-card-title')
        .filter({ hasText: note.title })
        .first()
        .locator('..');

      await expect(noteCard).toContainText(note.title);
      await expect(noteCard).toContainText(note.description);
    }
  },
);


import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NotesPage extends BasePage {
  readonly addNoteButton: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly completedCheckbox: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    super(page);

    this.addNoteButton = page.getByTestId('add-new-note');
    this.titleInput = page.getByTestId('note-title');
    this.descriptionInput = page.getByTestId('note-description');
    this.categorySelect = page.getByTestId('note-category');
    this.completedCheckbox = page.getByTestId('note-completed');
    this.createButton = page.getByTestId('note-submit');
  }

  async openCreateNoteForm() {
    await this.addNoteButton.click();
  }

  async createNote(
    title: string,
    description: string,
    category: string,
  ) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.categorySelect.selectOption(category);
    await this.createButton.click();
  }
  async filterByCategory(category: string) {
  await this.page.locator('span').filter({ hasText: category }).first().click();

  }
}
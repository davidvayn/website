import { expect, test } from '@playwright/test';

const selectAll = (page: import('@playwright/test').Page) =>
  page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');

test('repeated searches via the button update results each time', async ({
  page,
}) => {
  await page.goto('/');

  const searchBox = page.getByRole('textbox', { name: 'Search' });
  const searchButton = page.getByRole('button', { name: 'Search', exact: true });

  // First search.
  await searchBox.click();
  await selectAll(page);
  await searchBox.pressSequentially('python');
  await searchButton.click();
  await expect(page).toHaveURL(/\?q=python$/);

  // Second search via the button again.
  await searchBox.click();
  await selectAll(page);
  await searchBox.pressSequentially('react');
  await searchButton.click();
  await expect(page).toHaveURL(/\?q=react$/);
  await expect(searchBox).toHaveValue('react');
});

test('clicking into the box places the cursor without selecting the text', async ({
  page,
}) => {
  await page.goto('/');

  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await expect(searchBox).toHaveValue('David Vayntrub');

  // A single click must NOT select the existing text.
  await searchBox.click();
  const selectionLength = await searchBox.evaluate(
    (el: HTMLInputElement) =>
      (el.selectionEnd ?? 0) - (el.selectionStart ?? 0)
  );
  expect(selectionLength).toBe(0);
});

test('pressing search again with the same term keeps correct state', async ({
  page,
}) => {
  await page.goto('/');

  const searchBox = page.getByRole('textbox', { name: 'Search' });
  const searchButton = page.getByRole('button', { name: 'Search', exact: true });

  await searchBox.click();
  await selectAll(page);
  await searchBox.pressSequentially('typescript');
  await searchButton.click();
  await expect(page).toHaveURL(/\?q=typescript$/);

  // Re-press with the same term: must not corrupt the value or URL.
  await searchButton.click();
  await expect(page).toHaveURL(/\?q=typescript$/);
  await expect(searchBox).toHaveValue('typescript');
});

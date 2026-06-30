import { expect, test } from '@playwright/test';

const selectAll = (page: import('@playwright/test').Page) =>
  page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');

test('AI Overview renders the streamed answer for a user search', async ({
  page,
}) => {
  // Mock the API so the test never hits the real Gemini endpoint.
  await page.route('**/api/ai-search', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/plain; charset=utf-8',
      body: 'David built BitWizards at Cutie Hack 2025.',
    });
  });

  await page.goto('/');
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  const searchButton = page.getByRole('button', { name: 'Search', exact: true });

  await searchBox.click();
  await selectAll(page);
  await searchBox.pressSequentially('what hackathons has David done?');
  await searchButton.click();

  await expect(page.getByText('AI Overview')).toBeVisible();
  await expect(
    page.getByText('David built BitWizards at Cutie Hack 2025.'),
  ).toBeVisible();
});

test('AI Overview does NOT call the API on a plain homepage load', async ({
  page,
}) => {
  let calls = 0;
  await page.route('**/api/ai-search', async (route) => {
    calls += 1;
    await route.fulfill({ status: 200, contentType: 'text/plain', body: 'x' });
  });

  await page.goto('/');
  // Default seed query ("David Vayntrub") shows a static overview and must NOT
  // trigger a model call.
  await expect(page.getByText('AI Overview')).toBeVisible();
  await expect(
    page.getByText('David Vayntrub is a Computer Science student'),
  ).toBeVisible();
  await page.waitForTimeout(500);
  expect(calls).toBe(0);

  // A real search should trigger exactly one call.
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await searchBox.click();
  await selectAll(page);
  await searchBox.pressSequentially('projects');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect.poll(() => calls).toBeGreaterThan(0);
});

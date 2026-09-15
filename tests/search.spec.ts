import { expect, type Page, test } from '@playwright/test';

async function mockSpeechRecognition(page: Page, transcript: string) {
  await page.addInitScript((spokenTranscript) => {
    class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = 'en-US';
      onend: (() => void) | null = null;
      onerror: ((event: { error: string }) => void) | null = null;
      onresult: ((event: {
        results: {
          length: number;
          0: {
            isFinal: boolean;
            length: number;
            0: { transcript: string };
          };
        };
      }) => void) | null = null;

      abort() {
        this.onend?.();
      }

      start() {
        window.setTimeout(() => {
          this.onresult?.({
            results: {
              length: 1,
              0: {
                isFinal: true,
                length: 1,
                0: { transcript: spokenTranscript },
              },
            },
          });
          this.onend?.();
        }, 0);
      }
    }

    for (const property of ['SpeechRecognition', 'webkitSpeechRecognition']) {
      Object.defineProperty(window, property, {
        configurable: true,
        value: MockSpeechRecognition,
      });
    }
  }, transcript);
}

test('typed search updates results and URL state', async ({ page }) => {
  await page.goto('/');

  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await searchBox.click();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await searchBox.pressSequentially('python');
  await expect(searchBox).toHaveValue('python');
  await searchBox.press('Enter');

  await expect(page).toHaveURL(/\?q=python/);
  await expect(
    page
      .getByRole('link', {
        name: 'Analysis of Machine Learning Methods with Regression',
        exact: true,
      })
      .last(),
  ).toBeVisible();
});

test('voice search matches heard words to a site keyword', async ({ page }) => {
  await mockSpeechRecognition(page, 'machine lerning');

  await page.goto('/');
  await page.getByRole('button', { name: 'Search by voice' }).click();

  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue(
    'Analysis of Machine Learning Methods with Regression',
  );
  await expect(page).toHaveURL(
    /q=Analysis\+of\+Machine\+Learning\+Methods\+with\+Regression/,
  );
});

test('voice search does not add the site owner name to generic queries', async ({
  page,
}) => {
  await mockSpeechRecognition(page, 'projects');

  await page.goto('/');
  await page.getByRole('button', { name: 'Search by voice' }).click();

  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue(
    'projects'
  );
  await expect(page).toHaveURL(/\?q=projects/);
});

test('voice search keeps the spoken phrase when no close keyword matches', async ({
  page,
}) => {
  await mockSpeechRecognition(page, 'pizza near me');

  await page.goto('/');
  await page.getByRole('button', { name: 'Search by voice' }).click();

  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue(
    'pizza near me'
  );
  await expect(page).toHaveURL(/\?q=pizza\+near\+me/);
});

test('voice search is disabled when speech recognition is unavailable', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'SpeechRecognition', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      configurable: true,
      value: undefined,
    });
  });

  await page.goto('/');

  await expect(
    page.getByRole('button', {
      name: 'Voice search is not supported in this browser',
    })
  ).toBeDisabled();
});

test('updated resume achievements are searchable and the PDF is downloadable', async ({
  page,
}) => {
  await page.route('**/api/ai-search', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/plain; charset=utf-8',
      body: 'David built an open-source poker solver.',
    });
  });

  await page.goto('/?q=poker');

  await expect(
    page.getByRole('link', { name: 'Open Source Poker Solver', exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/95\.2% action-EV precision/)).toBeVisible();
  await expect(page.getByText(/100% policy-lookup coverage/)).toBeVisible();
  await expect(page.getByText(/114 automated tests/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Phone' })).toHaveAttribute(
    'href',
    'tel:+14154650222',
  );

  const resumeResponse = await page.request.get('/resume.pdf');
  expect(resumeResponse.ok()).toBe(true);
  expect(resumeResponse.headers()['content-type']).toContain('application/pdf');
});

test('PokerFly is searchable and uses its live product preview', async ({ page }) => {
  await page.route('**/api/ai-search', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/plain; charset=utf-8',
      body: 'David built PokerFly, a fly-inspired neural poker observatory.',
    });
  });

  await page.goto('/?q=connectome');

  const pokerFlyLink = page.getByRole('link', {
    name: 'PokerFly',
    exact: true,
  });
  await expect(pokerFlyLink.last()).toBeVisible();
  await expect(pokerFlyLink.last()).toHaveAttribute(
    'href',
    'https://pokerfly.vercel.app/',
  );
  await expect(page.getByText(/56,752-parameter/)).toBeVisible();
  await expect(page.getByText(/85\.5% teacher top-action agreement/)).toBeVisible();

  await page.getByRole('button', { name: 'Images' }).click();
  await expect(
    page.getByAltText(
      'PokerFly preview showing a luminous fly brain surrounded by poker cards',
    ),
  ).toBeVisible();
});

test('homepage displays projects in the expected order and updates KnowledgePanel title', async ({
  page,
}) => {
  await page.goto('/');

  // Verify KnowledgePanel title below name
  await expect(page.getByText('David Vayntrub', { exact: true })).toBeVisible();
  const knowledgePanel = page.locator('aside');
  await expect(knowledgePanel.getByText('Software Engineer', { exact: true })).toBeVisible();
  await expect(knowledgePanel.getByText('Software Engineer & CS Student')).not.toBeVisible();
  await expect(
    knowledgePanel.getByText(
      'UC Riverside Computer Science student building full-stack, AI/ML, and real-time systems with TypeScript, Python, and Rust.',
    ),
  ).toBeVisible();

  // Verify homepage result order
  const expectedOrder = [
    'Open Source Poker Solver',
    'Cofounding Engineer - StudySpot',
    'Software Engineer - ACM Riverside Forge',
    'Analysis of Machine Learning Methods with Regression',
    'PokerFly',
    'BitWizards',
    'Personal Website',
  ];

  // In the search results column, locate all h3 headers that represent organic results
  const resultHeadings = page.locator('main h3');
  const count = await resultHeadings.count();
  const actualTitles: string[] = [];
  for (let i = 0; i < count; i++) {
    const text = await resultHeadings.nth(i).innerText();
    const cleanText = text.trim();
    if (expectedOrder.includes(cleanText)) {
      actualTitles.push(cleanText);
    }
  }

  expect(actualTitles).toEqual(expectedOrder);
});

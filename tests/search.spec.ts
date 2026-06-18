import { expect, test } from '@playwright/test';

test('typed search updates results and URL state', async ({ page }) => {
  await page.goto('/');

  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await searchBox.click();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await searchBox.pressSequentially('python');
  await expect(searchBox).toHaveValue('python');
  await searchBox.press('Enter');

  await expect(page).toHaveURL(/\?q=python/);
  await expect(page.getByText('Analysis of Machine Learning Methods')).toBeVisible();
});

test('voice search matches heard words to a site keyword', async ({ page }) => {
  await page.addInitScript(() => {
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
                0: { transcript: 'machine lerning' },
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
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Search by voice' }).click();

  await expect(page.getByRole('textbox', { name: 'Search' })).toHaveValue(
    'Analysis of Machine Learning Methods'
  );
  await expect(page).toHaveURL(/q=Analysis\+of\+Machine\+Learning\+Methods/);
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

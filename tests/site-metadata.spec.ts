import { expect, test } from '@playwright/test';

test('phone link previews advertise the custom site icon', async ({ page }) => {
  await page.goto('/');

  const iconHrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((icons) => icons.map((icon) => (icon as HTMLLinkElement).href));

  expect(iconHrefs.length).toBeGreaterThan(0);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);

  for (const href of iconHrefs) {
    const isDavidIcon = await page.evaluate(async (iconHref) => {
      const image = new Image();
      image.src = iconHref;
      await image.decode();

      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (!context) return false;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let hasBlue = false;
      let hasWhite = false;

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];

        if (alpha > 128 && (red > 120 || green > 120 || blue > 120)) {
          const isGrayscale =
            Math.abs(red - green) < 20 &&
            Math.abs(green - blue) < 20 &&
            Math.abs(red - blue) < 20;

          if (!isGrayscale) hasBlue = true;
        }

        if (alpha > 128 && red > 240 && green > 240 && blue > 240) hasWhite = true;
      }

      const tilePixel = (8 * canvas.width + 8) * 4;
      const hasBlueTile =
        pixels[tilePixel + 3] > 200 &&
        pixels[tilePixel + 2] > 200 &&
        pixels[tilePixel + 2] > pixels[tilePixel];

      return hasBlue && hasWhite && hasBlueTile;
    }, href);

    expect(isDavidIcon, `${href} should contain the blue-and-white D icon`).toBe(true);
  }
});

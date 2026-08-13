import { expect, test } from '@playwright/test';

test('phone link previews advertise the custom site icon', async ({ page }) => {
  await page.goto('/');

  const iconHrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((icons) => icons.map((icon) => (icon as HTMLLinkElement).href));

  expect(iconHrefs.length).toBeGreaterThan(0);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);

  for (const href of iconHrefs) {
    const isDvaynD = await page.evaluate(async (iconHref) => {
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
      let bluePixelCount = 0;
      let visibleEdgePixelCount = 0;

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];
        const pixelNumber = index / 4;
        const x = pixelNumber % canvas.width;
        const y = Math.floor(pixelNumber / canvas.width);

        if (alpha > 128 && blue > 180 && blue > red * 2 && blue > green) {
          bluePixelCount += 1;
        }

        if (
          alpha > 32 &&
          (x === 0 || x === canvas.width - 1 || y === 0 || y === canvas.height - 1)
        ) {
          visibleEdgePixelCount += 1;
        }
      }

      const pixel = (x: number, y: number) => {
        const index = (y * canvas.width + x) * 4;
        return {
          red: pixels[index],
          green: pixels[index + 1],
          blue: pixels[index + 2],
          alpha: pixels[index + 3],
        };
      };

      const isBlue = ({ red, green, blue, alpha }: ReturnType<typeof pixel>) =>
        alpha > 200 && blue > 180 && blue > red * 2 && blue > green;
      const isTransparent = ({ alpha }: ReturnType<typeof pixel>) => alpha < 32;

      return (
        bluePixelCount > 1500 &&
        visibleEdgePixelCount === 0 &&
        isBlue(pixel(18, 32)) &&
        isBlue(pixel(47, 32)) &&
        isTransparent(pixel(32, 32)) &&
        isTransparent(pixel(4, 4))
      );
    }, href);

    expect(isDvaynD, `${href} should contain the big blue D from the Dvayn logo`).toBe(true);
  }
});

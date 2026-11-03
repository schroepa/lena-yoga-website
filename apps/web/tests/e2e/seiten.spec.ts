import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const seiten = ['/', '/kurse'];

for (const pfad of seiten) {
  test.describe(`Seite ${pfad}`, () => {
    test('hat Titel, Beschreibung, Sprache und eine Hauptüberschrift', async ({ page }) => {
      await page.goto(pfad);
      await expect(page).toHaveTitle(/Lena Yoga/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'de');
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    });

    test('hat keine Barrierefreiheitsfehler (axe, WCAG 2.2 AA)', async ({ page }) => {
      await page.goto(pfad);
      const ergebnis = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      expect(ergebnis.violations).toEqual([]);
    });

    test('läuft nicht horizontal über den Rand', async ({ page }) => {
      await page.goto(pfad);
      const breiter = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(breiter).toBe(false);
    });

    test('läuft auch bei 320 px nicht über den Rand und nichts ragt heraus', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(pfad);
      const ueberstand = await page.evaluate(() => {
        const breite = document.documentElement.clientWidth;
        const doc = document.documentElement.scrollWidth - breite;
        const texte = [...document.querySelectorAll('body *')].filter(
          (e) =>
            e.clientWidth > 0 &&
            e.scrollWidth > e.clientWidth + 1 &&
            getComputedStyle(e).overflow === 'visible',
        );
        return { doc, texte: texte.map((e) => e.tagName + '.' + e.className) };
      });
      expect(ueberstand).toEqual({ doc: 0, texte: [] });
    });

    test('lädt keine Ressourcen von fremden Servern', async ({ page, baseURL }) => {
      const fremde: string[] = [];
      page.on('request', (anfrage) => {
        const url = anfrage.url();
        if (!url.startsWith(baseURL ?? '') && !url.startsWith('data:')) fremde.push(url);
      });
      await page.goto(pfad, { waitUntil: 'networkidle' });
      expect(fremde).toEqual([]);
    });
  });
}

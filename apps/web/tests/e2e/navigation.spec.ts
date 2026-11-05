import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Navigation am Desktop', () => {
  test.beforeEach(({ viewport }) => {
    test.skip((viewport?.width ?? 0) < 768, 'nur Desktop');
  });

  test('zeigt fünf Links und die Hauptaktion offen im Kopf', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
    await expect(nav.getByRole('link')).toHaveCount(5);
    await expect(page.getByRole('link', { name: 'Probestunde wählen' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menü' })).toBeHidden();
  });

  test('alle Ziele im Kopf sind mindestens 44 px hoch', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
    for (const link of await nav.getByRole('link').all()) {
      const box = await link.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Mobiles Menü', () => {
  test.beforeEach(({ viewport }) => {
    test.skip((viewport?.width ?? 0) >= 768, 'nur mobil');
  });

  test('Kopf passt in die Breite, auch bei 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    const breiter = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(breiter).toBe(false);
    await expect(page.getByRole('button', { name: 'Menü' })).toBeVisible();
  });

  test('öffnet, zeigt Navigation und Hauptaktion, schließt mit Escape', async ({ page }) => {
    await page.goto('/');
    const knopf = page.getByRole('button', { name: 'Menü' });
    await expect(knopf).toHaveAttribute('aria-expanded', 'false');

    await knopf.click();
    const dialog = page.getByRole('dialog', { name: 'Menü' });
    await expect(dialog).toBeVisible();
    await expect(knopf).toHaveAttribute('aria-expanded', 'true');
    await expect(
      dialog.getByRole('navigation', { name: 'Mobile Hauptnavigation' }).getByRole('link'),
    ).toHaveCount(5);
    await expect(dialog.getByRole('link', { name: 'Probestunde wählen' })).toBeVisible();

    // Vollbild: Breite und Höhe des Fensters
    const box = await dialog.boundingBox();
    const fenster = page.viewportSize();
    expect(Math.round(box?.width ?? 0)).toBe(fenster?.width);
    expect(Math.round(box?.height ?? 0)).toBe(fenster?.height);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(knopf).toHaveAttribute('aria-expanded', 'false');
    await expect(knopf).toBeFocused();
  });

  test('Schließen-Button schließt das Menü und gibt den Fokus zurück', async ({ page }) => {
    await page.goto('/');
    const knopf = page.getByRole('button', { name: 'Menü' });
    await knopf.click();
    await page.getByRole('button', { name: 'Schließen' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(knopf).toBeFocused();
  });

  test('offenes Menü hat keine Barrierefreiheitsfehler', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menü' }).click();
    const dialog = page.getByRole('dialog', { name: 'Menü' });
    await expect(dialog).toBeVisible();
    // Erst nach Ende der Einblendung messen, sonst verfälscht die Transparenz den Kontrast.
    await expect(dialog).toHaveCSS('opacity', '1');
    const ergebnis = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    expect(ergebnis.violations).toEqual([]);
  });

  test('Navigation bleibt ohne JavaScript erreichbar', async ({ browser, baseURL }) => {
    const kontext = await browser.newContext({ javaScriptEnabled: false, baseURL: baseURL ?? '' });
    const seite = await kontext.newPage();
    await seite.goto('/');
    await expect(
      seite.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link'),
    ).toHaveCount(5);
    await kontext.close();
  });
});

test('Footer enthält die Servicelinks mit ausreichend großen Zielen', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('navigation', { name: 'Service' });
  await expect(footer.getByRole('link')).toHaveCount(6);
  for (const link of await footer.getByRole('link').all()) {
    const box = await link.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

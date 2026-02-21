import { test, expect } from '@playwright/test';

test('verify settings guide link', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  // Wait for sidebar and click Settings (Sistem Ayarları)
  await page.click('button:has-text("SİSTEM AYARLARI")');

  // Check for the text and link
  const guideText = page.locator('text=Render dashboard üzerinden');
  await expect(guideText).toBeVisible();

  const guideLink = page.locator('a[href="https://render.com/docs/environment-variables"]');
  await expect(guideLink).toBeVisible();
  await expect(guideLink).toHaveText('Detaylı Rehber için Tıklayın');

  await page.screenshot({ path: 'verification/settings_guide_updated.png', fullPage: true });
});

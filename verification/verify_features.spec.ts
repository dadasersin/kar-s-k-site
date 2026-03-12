import { test, expect } from '@playwright/test';

test('verify home dashboard metrics', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input[type="password"]', '0000');
  await page.click('button:has-text("Giriş Yap")');

  await expect(page.locator('h1')).toContainText('NEXUS');
  await expect(page.locator('text=Sistem Sağlığı ve Analiz')).toBeVisible();

  // Check if metrics are present
  await expect(page.locator('text=OTURUM SÜRESİ')).toBeVisible();
  await expect(page.locator('text=SİNİR SİSTEMİ')).toBeVisible();
  await expect(page.locator('text=MANTIK MOTORU')).toBeVisible();

  await page.screenshot({ path: '/home/jules/verification/home_final.png', fullPage: true });
});

test('verify suno music custom generation', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input[type="password"]', '0000');
  await page.click('button:has-text("Giriş Yap")');

  // Go to Suno
  await page.click('text=Suno Müzik AI');
  await page.click('button:has-text("ÖZEL SÖZLER")');

  await page.fill('textarea', 'Test lyrics for verification');
  await page.fill('input[placeholder="Örn: Turkish Pop, Rock..."]', 'Cyberpunk Synthwave');

  await page.click('button:has-text("ŞARKIYI OLUŞTUR")');

  // Wait for results
  await page.waitForSelector('text=SONUÇLAR', { timeout: 15000 });
  await page.screenshot({ path: '/home/jules/verification/suno_final.png' });
});

test('verify audio beste generation', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input[type="password"]', '0000');
  await page.click('button:has-text("Giriş Yap")');

  await page.click('text=Ses & Remix');

  await page.click('button:has-text("BESTE")');
  await page.fill('textarea', 'Beste için test sözleri');
  await page.click('button:has-text("BESTEYİ OLUŞTUR")');

  await page.waitForSelector('text=DOSYAYI İNDİR', { timeout: 15000 });
  await page.screenshot({ path: '/home/jules/verification/audio_final.png' });
});

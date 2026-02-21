import { test, expect } from '@playwright/test';

test('verify android studio and ip address', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Verify IP address in sidebar
  const ipText = page.locator('p.text-mono'); // The userIp has text-mono class
  // Wait for IP to load (or at least the placeholder)
  await expect(ipText).toBeVisible();

  // Click Android Studio in sidebar
  await page.click('button:has-text("ANDROID STUDIO")');

  // Verify Android Studio view
  await expect(page.locator('text=Android Studio Portal')).toBeVisible();
  await expect(page.locator('text=Project Explorer')).toBeVisible();
  await expect(page.locator('text=MainActivity.kt')).toBeVisible();

  // Test "Run" button
  await page.click('button >> .lucide-play');
  await expect(page.locator('text=Gradle build started...')).toBeVisible();

  // Wait for "device" to be online
  await page.waitForTimeout(3000);
  await expect(page.locator('text=Portal Android Sistemi Başarıyla Başlatıldı.')).toBeVisible();

  await page.screenshot({ path: 'verification/android_studio_emulator.png', fullPage: true });
});

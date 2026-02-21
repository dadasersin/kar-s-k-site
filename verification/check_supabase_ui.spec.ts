import { test, expect } from '@playwright/test';

test('verify supabase ui configuration', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Go to settings
  await page.click('button:has-text("SİSTEM AYARLARI")');

  // Check for the new inputs
  const urlInput = page.locator('input[placeholder="https://xyz.supabase.co"]');
  const keyInput = page.locator('input[placeholder="eyJhbGci..."]');

  await expect(urlInput).toBeVisible();
  await expect(keyInput).toBeVisible();

  // Fill them
  await urlInput.fill('https://test.supabase.co');
  await keyInput.fill('testkey123');

  // Click save
  // Note: This will trigger an alert and reload in the actual app
  // In playwright we can just check if the values are there

  await page.screenshot({ path: 'verification/supabase_settings_ui.png', fullPage: true });
});

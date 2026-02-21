import { test, expect } from '@playwright/test';

test('verify dynamic module addition', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Go to Live Editor
  await page.click('button:has-text("AI GELİŞTİRİCİ")');

  // Fill prompt
  await page.fill('textarea', 'Hava Durumu Widgetı');

  // Click Generate (this would call AI, so we simulate the merge part if AI fails or takes too long)
  // But since we want to test the SYSTEM, we can just manually set localStorage and dispatch event
  await page.evaluate(() => {
    const mod = {
      id: 'comp_test_123',
      name: 'TEST MODÜLÜ',
      description: 'Test açıklaması',
      code: 'console.log("hello")'
    };
    localStorage.setItem('dynamic_modules', JSON.stringify([mod]));
    window.dispatchEvent(new CustomEvent('dynamic-module-added'));
  });

  // Check if new nav item appears
  const dynamicItem = page.locator('button:has-text("TEST MODÜLÜ")');
  await expect(dynamicItem).toBeVisible();

  // Click it
  await dynamicItem.click();

  // Verify view content
  await expect(page.locator('h1:has-text("TEST MODÜLÜ")')).toBeVisible();
  await expect(page.locator('text=AI Üretimi Modül')).toBeVisible();

  await page.screenshot({ path: 'verification/dynamic_module_success.png', fullPage: true });
});

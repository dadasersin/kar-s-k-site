import { test, expect } from '@playwright/test';

test('verify home dashboard after login', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Login
  await page.click('button:has-text("0")');
  await page.click('button:has-text("0")');
  await page.click('button:has-text("0")');
  await page.click('button:has-text("0")');
  await page.click('button:has-text("GİRİŞ")');

  // Wait for transition
  await page.waitForSelector('h1:has-text("NEXUS")', { timeout: 10000 });

  // Take screenshot of the home dashboard
  await page.screenshot({ path: 'home_dashboard.png', fullPage: true });

  // Verify that the "AKTİF" or "DOLU" status is visible in API keys pool
  const status = page.locator('span:has-text("AKTİF"), span:has-text("DOLU")');
  await expect(status.first()).toBeVisible();
});

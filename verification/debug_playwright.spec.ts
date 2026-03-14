import { test, expect } from '@playwright/test';

test('debug login', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.screenshot({ path: 'login_initial.png' });

  // Wait for shield icon to be sure it loaded
  await page.waitForSelector('.fa-shield, .lucide-shield', { timeout: 5000 }).catch(() => console.log('Shield not found'));

  // Try to find ANY button
  const buttons = await page.locator('button').all();
  console.log('Found buttons:', buttons.length);
  for (const b of buttons) {
    console.log('Button text:', await b.innerText());
  }

  // Look for the "0" button specifically
  const zeroBtn = page.locator('button:has-text("0")');
  if (await zeroBtn.count() > 0) {
     console.log('Found 0 button');
     await zeroBtn.click();
     await zeroBtn.click();
     await zeroBtn.click();
     await zeroBtn.click();
     await page.click('button:has-text("GİRİŞ")');
  } else {
     console.log('0 button NOT found');
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'after_login_attempt.png' });
});

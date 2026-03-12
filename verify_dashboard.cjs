const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Login
    await page.click('button:has-text("0")');
    await page.click('button:has-text("0")');
    await page.click('button:has-text("0")');
    await page.click('button:has-text("0")');
    await page.click('button:has-text("GİRİŞ")');

    await page.waitForTimeout(3000); // Wait for home page

    await page.screenshot({ path: '/home/jules/verification/dashboard_view.png', fullPage: true });
    console.log('Dashboard screenshot taken');

    // Check for "Sistem Sağlığı ve Analiz" text
    const healthText = await page.textContent('body');
    if (healthText.includes('Sistem Sağlığı ve Analiz')) {
      console.log('Dashboard text verified');
    } else {
      console.log('Dashboard text NOT found');
    }

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
})();

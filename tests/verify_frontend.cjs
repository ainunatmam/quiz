const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Viewport size for desktop
  await page.setViewportSize({ width: 1280, height: 800 });

  // Home page
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(3000); // Wait for animations
  await page.screenshot({ path: 'home.png' });
  console.log('Saved home.png');

  // Projects page
  await page.goto('http://localhost:3000/projects');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'projects.png' });
  console.log('Saved projects.png');

  // Project Detail (Click first project card)
  // Click the first child in the grid
  await page.click('.grid > div:first-child');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'project_detail.png' });
  console.log('Saved project_detail.png');

  // Contact page
  await page.goto('http://localhost:3000/contact');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'contact.png' });
  console.log('Saved contact.png');

  await browser.close();
})();

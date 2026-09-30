import { chromium } from 'playwright';

async function capture(prefix) {
  const browser = await chromium.launch();
  
  // Desktop Light
  const desktopContextLight = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPageLight = await desktopContextLight.newPage();
  await desktopPageLight.emulateMedia({ colorScheme: 'light' });
  await desktopPageLight.goto('http://localhost:3000');
  await desktopPageLight.evaluate(() => { localStorage.setItem('theme', 'light'); document.documentElement.setAttribute('data-theme', 'light'); });
  await desktopPageLight.waitForTimeout(2000);
  await desktopPageLight.screenshot({ path: `C:/Users/hp/.gemini/antigravity-ide/brain/63f0f306-f20f-4abe-8b33-5fb8ffb28271/scratch/${prefix}_desktop_light.png`, fullPage: true });

  // Desktop Dark
  const desktopContextDark = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPageDark = await desktopContextDark.newPage();
  await desktopPageDark.emulateMedia({ colorScheme: 'dark' });
  await desktopPageDark.goto('http://localhost:3000');
  await desktopPageDark.evaluate(() => { localStorage.setItem('theme', 'dark'); document.documentElement.setAttribute('data-theme', 'dark'); });
  await desktopPageDark.waitForTimeout(2000);
  await desktopPageDark.screenshot({ path: `C:/Users/hp/.gemini/antigravity-ide/brain/63f0f306-f20f-4abe-8b33-5fb8ffb28271/scratch/${prefix}_desktop_dark.png`, fullPage: true });

  // Mobile Light
  const mobileContextLight = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true });
  const mobilePageLight = await mobileContextLight.newPage();
  await mobilePageLight.emulateMedia({ colorScheme: 'light' });
  await mobilePageLight.goto('http://localhost:3000');
  await mobilePageLight.evaluate(() => { localStorage.setItem('theme', 'light'); document.documentElement.setAttribute('data-theme', 'light'); });
  await mobilePageLight.waitForTimeout(2000);
  await mobilePageLight.screenshot({ path: `C:/Users/hp/.gemini/antigravity-ide/brain/63f0f306-f20f-4abe-8b33-5fb8ffb28271/scratch/${prefix}_mobile_light.png`, fullPage: true });

  // Mobile Dark
  const mobileContextDark = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true });
  const mobilePageDark = await mobileContextDark.newPage();
  await mobilePageDark.emulateMedia({ colorScheme: 'dark' });
  await mobilePageDark.goto('http://localhost:3000');
  await mobilePageDark.evaluate(() => { localStorage.setItem('theme', 'dark'); document.documentElement.setAttribute('data-theme', 'dark'); });
  await mobilePageDark.waitForTimeout(2000);
  await mobilePageDark.screenshot({ path: `C:/Users/hp/.gemini/antigravity-ide/brain/63f0f306-f20f-4abe-8b33-5fb8ffb28271/scratch/${prefix}_mobile_dark.png`, fullPage: true });

  await browser.close();
}

async function run() {
  const prefix = process.argv[2];
  if (!prefix) {
    console.error("Please provide a prefix (before or after)");
    process.exit(1);
  }
  await capture(prefix);
}

run().catch(console.error);

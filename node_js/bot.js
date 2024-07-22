const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const runBot = async (proxies, url, numRequests) => {
  const fingerprints = [
    {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      platform: 'Win32',
      language: 'en-US,en;q=0.9',
    },
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
      viewport: { width: 1440, height: 900 },
      platform: 'MacIntel',
      language: 'en-US,en;q=0.9',
    },
  ];

  for (let i = 0; i < numRequests; i++) {
    const proxyUrl = proxies[i % proxies.length];
    const fingerprint = fingerprints[i % fingerprints.length];

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--proxy-server=${proxyUrl}`,
        `--user-agent=${fingerprint.userAgent}`
      ]
    });

    const page = await browser.newPage();

    await page.setViewport(fingerprint.viewport);
    await page.evaluateOnNewDocument(fingerprint => {
      Object.defineProperty(navigator, 'platform', {
        get: () => fingerprint.platform
      });
      Object.defineProperty(navigator, 'language', {
        get: () => fingerprint.language
      });
      Object.defineProperty(navigator, 'languages', {
        get: () => [fingerprint.language]
      });
    }, fingerprint);

    await page.goto(url);

    await page.evaluate(async () => {
      const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const scrollStep = getRandomInt(200, 600);
      const scrollInterval = getRandomInt(1000, 3000);

      const scroll = async () => {
        for (let y = 0; y < document.body.scrollHeight; y += scrollStep) {
          window.scrollBy(0, scrollStep);
          await new Promise(resolve => setTimeout(resolve, scrollInterval));

          if (Math.random() < 0.3) {
            const pauseTime = getRandomInt(3000, 7000);
            await new Promise(resolve => setTimeout(resolve, pauseTime));
          }
        }
      };

      await scroll();
    });

    const randomWaitTime = Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;
    await new Promise(resolve => setTimeout(resolve, randomWaitTime));

    await browser.close();
    console.log(`Request ${i + 1}: Completed using proxy ${proxyUrl}`);
  }
}

module.exports = runBot;

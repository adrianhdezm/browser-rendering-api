import { Browser, BrowserContext, chromium } from "playwright";

export class BrowserService {
  private browser!: Browser;
  private context!: BrowserContext;

  constructor() {}

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      viewport: { width: 1024, height: 1280 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      locale: "en-US",
    });
  }

  async getContent(url: string): Promise<{ url: string; value: string }> {
    const page = await this.context.newPage();

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page.mouse.wheel(0, 2000);
      await page.waitForTimeout(2000);

      const html = await page.content();

      return {
        url: page.url(),
        value: html,
      };
    } finally {
      await this.context.close();
    }
  }

  async getScreenshot(url: string): Promise<Buffer> {
    const page = await this.context.newPage();

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page.mouse.wheel(0, 2000);
      await page.waitForTimeout(2000);

      return await page.screenshot({
        type: "png",
        fullPage: true,
      });
    } finally {
      await this.context.close();
    }
  }

  async close(): Promise<void> {
    await this.browser.close();
  }
}

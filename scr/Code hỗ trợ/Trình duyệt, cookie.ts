import * as log from "@std/log";
import puppeteer, { Browser, Page } from "puppeteer";

const args = ["--window-size=1920,1080"];
export const minimal_args = [
  "--disable-speech-api", // 	Disables the Web Speech API (both speech recognition and synthesis)
  "--disable-background-networking", // Disable several subsystems which run network requests in the background. This is for use 									  // when doing network performance testing to avoid noise in the measurements. ↪
  "--disable-background-timer-throttling", // Disable task throttling of timer tasks from background pages.
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];

async function ghiCookie(page: puppeteer.Page, cookiesPath: string) {
  const cookies = await page.cookies();
  await Deno.writeTextFile(cookiesPath, JSON.stringify(cookies, null, 2));
  console.log("Session has been saved to " + cookiesPath);
}

export async function đọcCookie(page: Page) {
  const cookiesPath = "cookies.json";
  try {
    await Deno.lstat(cookiesPath);
    console.log("Cookie exists!");
    const content = await Deno.readTextFile(cookiesPath);
    const cookies = JSON.parse(content);
    if (cookies.length !== 0) {
      await page.setCookie(...cookies);
      console.log("Session has been loaded in the browser");
    } else {
      throw new Deno.errors.NotFound();
    }
  } catch (error) {
    log.debug(error);
    // console.error(error);
    console.log("Cookie not exists!");
    await ghiCookie(page, cookiesPath);
  }
}

export async function mởTrìnhDuyệt(debug = false) {
  log.info("Mở trình duyệt");
  const thiếtLậpTrìnhDuyệt = {
    executablePath: "C:/Users/ganuo/.cache/puppeteer/chrome/win64-125.0.6422.60/chrome-win64/chrome.exe",
    headless: !debug,
    userDataDir: "./user_data",
    devtools: debug ? true : false,
    // dumpio: true,
    args: minimal_args.concat(args),
  };

  return await puppeteer.launch(thiếtLậpTrìnhDuyệt);
}

export async function mởTrangMới(url: string, browser: Browser) {
  log.info(`Mở ${url}`);
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1800,
    height: 1200,
    deviceScaleFactor: 1,
    isMobile: false,
  });
  await đọcCookie(page);
  return page;
}

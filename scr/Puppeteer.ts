import * as log from "jsr:@std/log";
import puppeteer, { KnownDevices, Page } from "npm:puppeteer";

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

async function writeCookie(page: puppeteer.Page, cookiesPath: string) {
  const cookies = await page.cookies();
  await Deno.writeTextFile(cookiesPath, JSON.stringify(cookies, null, 2));
  console.log("Session has been saved to " + cookiesPath);
}

export async function readCookie(page: Page) {
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
    await writeCookie(page, cookiesPath);
  }
}

export async function openBrowser(url: string) {
  log.info(`Start browser. Open ${url}`);

  const browser = await puppeteer.launch({
    executablePath: "C:/Users/ganuo/.cache/puppeteer/chrome/win64-125.0.6422.60/chrome-win64/chrome.exe",
    // headless: false,
    userDataDir: "./user_data",
    // devtools: true,
    // dumpio: true,
    args: minimal_args.concat(args),
  });
  const page = await browser.newPage();
  await page.goto(url);

  await readCookie(page);
  return page;
}

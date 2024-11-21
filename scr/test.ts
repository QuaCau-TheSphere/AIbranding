console.log("start");
import puppeteer, { KnownDevices, Page } from "npm:puppeteer";
import { minimal_args, readCookie } from "./Puppeteer.ts";
import { getEnv } from "./utils.ts";

const browser = await puppeteer.launch({
  executablePath: "C:/Users/ganuo/.cache/puppeteer/chrome/win64-125.0.6422.60/chrome-win64/chrome.exe",
  headless: false,
  // userDataDir: "./user_data",
  // devtools: true,
  dumpio: true,
  args: minimal_args,
});

const page = await browser.newPage();
const url = getEnv("FACEBOOK_PROFILE_URL");
// const url = "https://stackoverflow.com/questions/55225525/how-to-draw-a-bounding-box-on-an-element-with-puppeteer";
await page.goto(url);

await readCookie(page);

const selector = "::-p-text(Photo)";
const element = page.locator(selector);
await element.click();

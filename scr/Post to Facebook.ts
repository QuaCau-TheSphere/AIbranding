import puppeteer, { KnownDevices, Page } from "npm:puppeteer";

async function writeCookie(page: puppeteer.Page, cookiesPath: string) {
  const cookiesObject = await page.cookies();
  await Deno.writeTextFile(cookiesPath, JSON.stringify(cookiesObject, null, 2));
  console.log("Session has been saved to " + cookiesPath);
}

async function readCookie(page: Page) {
  const cookiesPath = "cookies.json";
  try {
    await Deno.lstat(cookiesPath);
    console.log("Cookie exists!");
    const content = await Deno.readTextFile(cookiesPath);
    const cookiesArr = JSON.parse(content);
    if (cookiesArr.length !== 0) {
      for (const cookie of cookiesArr) {
        await page.setCookie(cookie);
      }
      console.log("Session has been loaded in the browser");
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
    console.log("Cookie not exists!");
    await writeCookie(page, cookiesPath);
  }
}

export async function postToFacebook(text: string, pathToImage = "Fetched content/a.jpg") {
  const url = Deno.env.get("FACEBOOK_PROFILE_URL");
  if (!url) throw new Error("No Facebook URL. Skip posting to Facebook");

  const browser = await puppeteer.launch({
    executablePath: "C:/Users/ganuo/.cache/puppeteer/chrome/win64-125.0.6422.60/chrome-win64/chrome.exe",
    headless: false,
    userDataDir: "./user_data",
  });
  const page = await browser.newPage();
  await page.emulate(KnownDevices["iPhone 15 Pro"]);
  await page.goto(url);

  await readCookie(page);

  const photoSelector = "#mbasic-composer-form > div:nth-child(15) > span > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > input";
  await Promise.all([
    page.locator(photoSelector).click(),
    page.waitForNavigation(),
  ]);

  const chooseFileSelector = "#root > table > tbody > tr > td > form > div.z > div > input:nth-child(1)";
  const a = await page.$(chooseFileSelector);
  await a!.uploadFile(pathToImage);

  const nextSelector = "#root > table > tbody > tr > td > form > div.ba > input.bg.bh.bi.bj.bk";
  await Promise.all([
    page.locator(nextSelector).click(),
    page.waitForNavigation(),
  ]);

  for (let i = 1; i <= 5; i++) {
    await page.keyboard.press("Tab");
  }
  await page.keyboard.type(text);

  const postSelector = "#composer_form > input.bh.cn.co.cp.cq";
  await page.locator(postSelector).click();
}

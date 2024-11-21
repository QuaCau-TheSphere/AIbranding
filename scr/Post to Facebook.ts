import * as log from "jsr:@std/log";
import { openBrowser } from "./Puppeteer.ts";
import { Page } from "npm:puppeteer";
import { getEnv } from "./utils.ts";

async function login(page: Page) {
  const loginSelector = "::-p-text(login)";
  const needsLogin = await page.$(loginSelector);

  if (needsLogin) {
    log.info("Login to Facebook");

    const email = getEnv("FACEBOOK_PROFILE_EMAIL");
    const password = getEnv("FACEBOOK_PROFILE_PASSWORD");

    await page.keyboard.type(email);
    page.keyboard.press("Tab");
    await page.keyboard.type(password);
    page.keyboard.press("Enter");
  }
}

async function createPost(page: Page, text: string) {
  log.info("Open post dialog");
  await page.locator("::-p-text(What's on your mind)").click();
  await page.keyboard.type(text);
}

async function uploadPhoto(page: Page, imagePaths: (string | undefined)[]) {
  if (imagePaths.length > 0) {
    log.info("Select photo button");
    await page.locator('*[aria-label="Photo/video"][role="button"]').click();
    const inputElement = await page.$('input[accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"]');
    await inputElement?.uploadFile(imagePaths[0]!);
  }
}

export async function postToFacebook(text: string, imagePaths: Array<string | undefined>) {
  const url = getEnv("FACEBOOK_PROFILE_URL");
  const page = await openBrowser(url);

  await login(page);
  await createPost(page, text);
  await uploadPhoto(page, imagePaths);

  log.info("Click next");
  const nextButtonSelector = '*[aria-label="Next"][role="button"]';
  await (await page.$(nextButtonSelector))!.click();
  // await page.locator(nextButtonSelector).click();

  log.info("Click post");
  await page.locator('*[aria-label="Post"][role="button"]').click();
}

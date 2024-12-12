import * as log from "@std/log";
import { Browser, Page } from "puppeteer";
import { lấyEnv } from "../Code hỗ trợ/env và hằng.ts";
import { ghiCookie, mởTrangMới } from "../Code hỗ trợ/Trình duyệt, cookie.ts";

async function login(page: Page) {
  const loginSelector = "::-p-text(login)";
  const cầnLogin = await page.$(loginSelector);

  if (cầnLogin) {
    console.info("Đăng nhập vào Facebook");

    const email = lấyEnv("FACEBOOK_EMAIL");
    const password = lấyEnv("FACEBOOK_PASSWORD");

    await page.keyboard.type(email);
    page.keyboard.press("Tab");
    await page.keyboard.type(password);
    page.keyboard.press("Enter");
  }
}

async function tạoBàiViết(page: Page, đườngDẫnTớiBài: string) {
  console.info("Mở ô nhập bài");
  const text = await Deno.readTextFile(đườngDẫnTớiBài);
  await page.locator("::-p-text(What's on your mind)").click();
  console.info("Gõ văn bản");
  await page.keyboard.type(text);
}

async function đăngẢnh(page: Page, imagePaths: (string | undefined)[]) {
  if (imagePaths.length > 0) {
    console.info("Chọn nút ảnh");
    await page.locator('*[aria-label="Photo/video"][role="button"]').click();
    const inputElement = await page.$('input[accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"]');
    await inputElement?.uploadFile(imagePaths[0]!);
  }
}
async function chọnTrangĐểĐăngCùng(page: Page) {
  console.info("Bấm next");
  const nextButtonSelector = '*[aria-label="Next"][role="button"]';
  // await (await page.$(nextButtonSelector))!.click();
  await page.locator(nextButtonSelector).click();

  console.info("Bấm post");
  await page.locator('*[aria-label="Post"][role="button"]').click();
}

export async function đăngLênFacebook(đườngDẫnTớiBài: string | undefined, dsĐườngDẫnTớiẢnh: Array<string | undefined>, trìnhDuyệt: Browser) {
  log.info("Đăng lên Facebook");

  const url = "https://facebook.com/";
  const page = await mởTrangMới(url, trìnhDuyệt);

  await login(page);
  const html = await page.content();
  console.log("🚀 ~ đăngLênFacebook ~ html:", html);
  const cầnXácThực2Lớp = await page.$("::-p-text(verify)");
  if (cầnXácThực2Lớp) {
    log.warn("Bị yêu cầu phải xác thực 2 lớp");
  } else if (đườngDẫnTớiBài) {
    try {
      await tạoBàiViết(page, đườngDẫnTớiBài);
      await đăngẢnh(page, dsĐườngDẫnTớiẢnh);
      await chọnTrangĐểĐăngCùng(page);
      log.info("Đã đăng lên Facebook");
      await ghiCookie(page);
    } catch (error) {
      const { name } = error as Error;
      if (name === "TimeoutError") throw name;
      console.error(name);
    }
  } else console.info("Không có bài nào. Bỏ qua phần đăng bài");
}

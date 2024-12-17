import { Browser, Page } from "puppeteer";
import { thiếtLập } from "../Code hỗ trợ/env và hằng.ts";
import { ghiCookie, mởTrangMới } from "../Code hỗ trợ/Trình duyệt, cookie.ts";

async function login(page: Page) {
  const cầnLogin = page.url().includes("login");

  if (cầnLogin) {
    const { Email: email, Password: password } = thiếtLập.Facebook;
    console.info(`Đăng nhập vào Facebook bằng email ${email}`);

    await page.keyboard.type(email);
    page.keyboard.press("Tab");
    await page.keyboard.type(password);
    page.keyboard.press("Enter");
    await page.waitForNavigation();
  }
}

async function xácThực2lớp(page: Page) {
  let cầnXácThực2Lớp = page.url().includes("two_step_verification");

  if (cầnXácThực2Lớp) {
    console.warn("Bị yêu cầu phải xác thực 2 lớp. Chờ xác thực");
    await page.waitForNavigation();
    cầnXácThực2Lớp = page.url().includes("two_step_verification");
    await xácThực2lớp(page);
  }
}

const selector = "::-p-text(What's on your mind)";
const nextButtonSelector = '*[aria-label="Next"][role="button"]';
const selectorẢnh = '*[aria-label="Photo/video"][role="button"]';

async function tạoBàiViết(page: Page, đườngDẫnTớiBài: string) {
  console.info("Mở ô nhập bài");
  await page.locator(selector).click();
  // await page.waitForSelector(selectorẢnh);

  const text = await Deno.readTextFile(đườngDẫnTớiBài);
  console.info(`Gõ ${text.length} ký tự`);
  await page.keyboard.type(text);
  console.info("Đã gõ xong");
}

async function đăngẢnh(page: Page, imagePaths: (string | undefined)[]) {
  if (imagePaths.length > 0) {
    console.info("Chọn nút ảnh");
    await page.locator(selectorẢnh).click();
    const inputElement = await page.$('input[accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"]');
    await inputElement?.uploadFile(imagePaths[0]!);
  }
}
async function chọnTrangĐểĐăngCùng(page: Page) {
  console.info("Bấm next");
  await page.locator(nextButtonSelector).click();

  console.info("Bấm post");
  await page.locator('*[aria-label="Post"][role="button"]').click();
}

export async function đăngLênFacebook(đườngDẫnTớiBài: string | undefined, dsĐườngDẫnTớiẢnh: Array<string | undefined>, trìnhDuyệt: Browser) {
  const page = await mởTrangMới("https://facebook.com/", trìnhDuyệt);
  await login(page);
  await xácThực2lớp(page);
  if (đườngDẫnTớiBài) {
    try {
      await tạoBàiViết(page, đườngDẫnTớiBài);
      await đăngẢnh(page, dsĐườngDẫnTớiẢnh);
      await chọnTrangĐểĐăngCùng(page);
      console.info("Đã đăng lên Facebook");
      await ghiCookie(page);
    } catch (error) {
      const { name, message, cause } = error as Error;
      if (name === "TimeoutError") throw error;
      console.error(message);
      console.error(cause);
    }
  } else console.warn("Không có bài nào. Bỏ qua phần đăng bài");
}

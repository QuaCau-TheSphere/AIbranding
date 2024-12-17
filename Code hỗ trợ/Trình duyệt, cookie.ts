import * as log from "@std/log";
import { resolve } from "@std/path/resolve";
import { ensureDir } from "@std/fs/ensure-dir";
import puppeteer, { Browser, Page } from "puppeteer";
import { flags, ĐƯỜNG_DẪN_TỚI_COOKIE, ĐƯỜNG_DẪN_TỚI_DỮ_LIỆU_NGƯỜI_DÙNG, ĐƯỜNG_DẪN_TỚI_XÁC_THỰC_ĐĂNG_NHẬP } from "./env và hằng.ts";

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

export async function ghiCookie(page: puppeteer.Page) {
  const cookies = await page.cookies();
  await ensureDir(resolve(ĐƯỜNG_DẪN_TỚI_XÁC_THỰC_ĐĂNG_NHẬP, "Cookie"));
  await Deno.writeTextFile(ĐƯỜNG_DẪN_TỚI_COOKIE, JSON.stringify(cookies, null, 2));
  console.log("Lưu cookie");
}

export async function đọcCookie(page: Page) {
  try {
    const cookies = JSON.parse(await Deno.readTextFile(ĐƯỜNG_DẪN_TỚI_COOKIE));
    if (cookies.length !== 0) {
      console.log("Nạp cookie");
      await page.setCookie(...cookies);
    } else {
      throw new Deno.errors.NotFound();
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.log("Chưa có cookie");
    } else {
      log.error("Có lỗi khi nạp cookie");
      console.error((error as Error).message);
    }
  }
}

export async function mởTrìnhDuyệt() {
  const headful = flags.headful;
  log.info(`Mở trình duyệt chế độ ${headful ? "headful" : "headless"}`);

  let thiếtLậpTrìnhDuyệt;
  switch (Deno.build.os) {
    case "windows":
      thiếtLậpTrìnhDuyệt = {
        executablePath: "C:/Users/ganuo/.cache/puppeteer/chrome/win64-125.0.6422.60/chrome-win64/chrome.exe",
        headless: !headful,
        userDataDir: ĐƯỜNG_DẪN_TỚI_DỮ_LIỆU_NGƯỜI_DÙNG,
        devtools: headful,
        // dumpio: true,
        args: minimal_args.concat(args),
      };
      break;

    default:
      log.info("Linux");
      thiếtLậpTrìnhDuyệt = {
        executablePath: "/home/runner/.cache/puppeteer/chrome/linux-131.0.6778.108/chrome-linux64/chrome",
        userDataDir: ĐƯỜNG_DẪN_TỚI_DỮ_LIỆU_NGƯỜI_DÙNG,
        // dumpio: true,
        args: minimal_args.concat(args),
      };
      break;
  }

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
  // await đọcCookie(page);
  return page;
}

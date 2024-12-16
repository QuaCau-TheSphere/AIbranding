import * as log from "@std/log";
import { ensureDir } from "@std/fs/ensure-dir";
import { basename, extname } from "@std/path";
import { NƠI_LƯU } from "./Code hỗ trợ/env và hằng.ts";
import { truyVấnFibery, tảiBàiVàẢnh } from "./1. Kéo bài/Fibery.ts";
import { mởTrìnhDuyệt } from "./Code hỗ trợ/Trình duyệt, cookie.ts";
import { đăngLênFacebook } from "./2. Đăng bài/Trang chủ Facebook.ts";

async function kéoBàiTừCácNguồn() {
  log.info("Kéo bài từ các nguồn");
  await ensureDir(NƠI_LƯU);
  const dsBài = [...await truyVấnFibery()];
  return dsBài;
}

try {
  const trìnhDuyệt = await mởTrìnhDuyệt();
  const dsBài = await kéoBàiTừCácNguồn();
  for (const bài of dsBài) {
    const { đườngDẫnTớiBài, dsĐườngDẫnTớiẢnh } = await tảiBàiVàẢnh(bài);
    log.info(`Đăng bài ${basename(đườngDẫnTớiBài, extname(đườngDẫnTớiBài))}`);
    await đăngLênFacebook(đườngDẫnTớiBài, dsĐườngDẫnTớiẢnh, trìnhDuyệt);
    // await đăngLênFacebook(undefined, [], trìnhDuyệt);
    break;
  }

  await trìnhDuyệt.close();
  log.info("Đã chạy xong");
} catch (error) {
  const { name } = error as Error;
  switch (name) {
    case "TargetCloseError":
      console.error(name);
      break;
    case "TimeoutError":
      break;

    default:
      log.error(name);
  }
}

log.setup({
  handlers: {
    console: new log.ConsoleHandler("DEBUG"),
  },
});

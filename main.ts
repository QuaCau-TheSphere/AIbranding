import * as log from "@std/log";
import { ensureDir } from "@std/fs/ensure-dir";
import { NƠI_LƯU } from "./scr/Code hỗ trợ/env và hằng.ts";
import { truyVấnFibery, tảiBàiVàẢnh } from "./scr/1. Kéo bài/Fibery.ts";
import { mởTrìnhDuyệt } from "./scr/Code hỗ trợ/Trình duyệt, cookie.ts";
import { đăngLênFacebook } from "./scr/2. Đăng bài/Trang chủ Facebook.ts";

// const debug = false;
const debug = true;

async function kéoBàiTừCácNguồn() {
  log.info("Kéo bài từ các nguồn");
  await ensureDir(NƠI_LƯU);
  const dsBài = [...await truyVấnFibery()];
  return dsBài;
}

try {
  const trìnhDuyệt = await mởTrìnhDuyệt(debug);
  const dsBài = await kéoBàiTừCácNguồn();
  for (const bài of dsBài) {
    const { đườngDẫnTớiBài, dsĐườngDẫnTớiẢnh } = await tảiBàiVàẢnh(bài);
    await đăngLênFacebook(đườngDẫnTớiBài, dsĐườngDẫnTớiẢnh, trìnhDuyệt);
    // await đăngLênFacebook(undefined, [], trìnhDuyệt);
    break;
  }

  await trìnhDuyệt.close();
  log.info("Đã xong");
} catch (error) {
  const { name } = error as Error;
  switch (name) {
    case "TargetCloseError":
      console.error(name);
      break;
    case "TimeoutError":
      log.error(name);
      throw "";

    default:
      log.error(name);
  }
}

log.setup({
  handlers: {
    console: new log.ConsoleHandler("DEBUG"),
    file: new log.FileHandler("WARN", {
      filename: "./log.txt",
      // you can change format of output message using any keys in `LogRecord`.
      formatter: (record) => `${record.levelName} ${record.msg}`,
    }),
  },
});

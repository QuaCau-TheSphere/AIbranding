import * as log from "@std/log";
import { đăngLênFacebook } from "./scr/2. Đăng bài/Trang chủ Facebook.ts";
import { mởTrìnhDuyệt } from "./scr/Code hỗ trợ/Trình duyệt, cookie.ts";
import { truyVấnFibery, tảiBàiVàẢnh } from "./scr/1. Kéo bài/Fibery.ts";
import { ensureDir } from "@std/fs/ensure-dir";
import { NƠI_LƯU } from "./scr/Code hỗ trợ/env và hằng.ts";

const debug = true;
try {
  log.info("Kéo bài từ các nguồn");

  await ensureDir(NƠI_LƯU);
  const dsBài = [...await truyVấnFibery()];
  for (const bài of dsBài) {
    const { đườngDẫnTớiBài, dsĐườngDẫnTớiẢnh } = await tảiBàiVàẢnh(bài);
  }

  // const trìnhDuyệt = await mởTrìnhDuyệt(debug);
  // await đăngLênFacebook(article, [imagePaths], trìnhDuyệt);
  // await trìnhDuyệt.close();
} catch (error) {
  console.error(error);
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

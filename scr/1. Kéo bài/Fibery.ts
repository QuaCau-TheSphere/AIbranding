import * as log from "@std/log";
import { resolve } from "@std/path/resolve";
import { NƠI_LƯU, thiếtLập } from "../Code hỗ trợ/env và hằng.ts";
import { BàiTrênFibery, dsNodeẢnh, header, tạoQueryBody, tảiẢnh } from "../Code hỗ trợ/Fibery/Code hỗ trợ cho Fibery.ts";

export async function truyVấnFibery(): Promise<BàiTrênFibery[] | never[]> {
  const { Host: host, Database: database, Space: space } = thiếtLập.Fibery;
  const fiberyEndPoint = `${host}/api/graphql/space/${space}`;

  log.info("Lấy dữ liệu trên Fibery");
  const queryBody = await tạoQueryBody("scr/Code hỗ trợ/Fibery/query.graphql");
  const kếtQuả = await (await fetch(fiberyEndPoint, {
    method: "POST",
    body: queryBody,
    headers: header(),
  })).json();
  if (!kếtQuả.data) {
    log.error(`Phản hồi từ Fibery: "${kếtQuả.message}"`);
    return [];
  }
  return kếtQuả.data[`find${database}`];
}

async function tảiTấtCảẢnh(md: string) {
  const dsĐườngDẫnTớiẢnh: Array<string | undefined> = [];
  for (const nodeẢnh of dsNodeẢnh(md)) {
    dsĐườngDẫnTớiẢnh.push(await tảiẢnh(nodeẢnh));
  }
  return dsĐườngDẫnTớiẢnh;
}

async function tảiBài(name: string, md: string) {
  const đườngDẫnTớiBài = resolve(NƠI_LƯU, `${name}.md`.replace(/[/\\?%*:|"<>]/g, "-"));
  await Deno.writeTextFile(đườngDẫnTớiBài, md);
  return đườngDẫnTớiBài;
}

export async function tảiBàiVàẢnh(article: BàiTrênFibery) {
  const { name, content: { md }, creationDate } = article;
  console.log(creationDate, name);

  const đườngDẫnTớiBài = await tảiBài(name, md);
  const dsĐườngDẫnTớiẢnh: Array<string | undefined> = await tảiTấtCảẢnh(md);
  return {
    đườngDẫnTớiBài: đườngDẫnTớiBài,
    dsĐườngDẫnTớiẢnh: dsĐườngDẫnTớiẢnh,
  };
}

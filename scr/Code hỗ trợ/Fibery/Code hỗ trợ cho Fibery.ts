import { Image } from "mdast";
import * as log from "@std/log";
import { visit } from "unist-util-visit";
import { resolve } from "@std/path/resolve";
import { lấyEnv, NƠI_LƯU } from "../env và hằng.ts";
import { fromMarkdown } from "mdast-util-from-markdown";
import { Destination, download } from "download";

export async function tạoQueryBody(path: string) {
  return JSON.stringify({ query: await Deno.readTextFile(path) }, null, 2);
}

export function header(): HeadersInit | undefined {
  const FIBERY_TOKEN = lấyEnv("FIBERY_TOKEN");
  return {
    "Content-Type": `application/json`,
    Authorization: `Token ${FIBERY_TOKEN}`,
  };
}

export function dsNodeẢnh(md: BàiTrênFibery["content"]["md"]) {
  const dsNodeẢnh: Image[] = [];
  const tree = fromMarkdown(md);
  visit(tree, function (node) {
    if (node.type === "image") {
      dsNodeẢnh.push(node);
    }
  });
  return dsNodeẢnh;
}

export async function tảiẢnh(imageNode: Image) {
  const FIBERY_HOST = lấyEnv("FIBERY_HOST");
  const url = `${FIBERY_HOST}${imageNode.url}`;
  try {
    const tênẢnh = imageNode.alt;
    const nơiLưu: Destination = {
      dir: NƠI_LƯU,
      file: tênẢnh,
    };
    const reqInit: RequestInit = {
      method: "GET",
      headers: header(),
    };
    await download(url, nơiLưu, reqInit);
    return resolve(NƠI_LƯU, tênẢnh);
  } catch (err) {
    log.error(err);
  }
}

export interface BàiTrênFibery {
  name: string;
  publicId: string;
  content: {
    md: string;
  };
  creationDate: string;
  date: string;
  description: {
    text: string;
  };
  seoTitle: string;
  seoDescription: {
    text: string;
  };
  slug: string;
  author: {
    name: string;
    authorTitle: string;
    avatars: {
      name: string;
      secret: string;
      contentType: string;
    };
  };
  files: {
    secret: string;
    name: string;
    contentType: string;
  };
}

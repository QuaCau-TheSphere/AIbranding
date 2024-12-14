import { Image } from "mdast";
import * as log from "@std/log";
import { visit } from "unist-util-visit";
import { resolve } from "@std/path/resolve";
import { NƠI_LƯU, thiếtLập } from "../env và hằng.ts";
import { fromMarkdown } from "mdast-util-from-markdown";
import { Destination, download } from "download";

export async function tạoQueryBody(path: string) {
  return JSON.stringify({ query: await Deno.readTextFile(path) }, null, 2);
}

const { Host: host, Token: token } = thiếtLập.Fibery;
export function header(): HeadersInit | undefined {
  return {
    "Content-Type": `application/json`,
    Authorization: `Token ${token}`,
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
  const url = `${host}${imageNode.url}`;
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

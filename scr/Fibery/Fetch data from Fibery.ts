import * as log from "jsr:@std/log";
import { FiberyArticle } from "./types.ts";
import { resolve } from "jsr:@std/path/resolve";
import { ensureDir } from "jsr:@std/fs/ensure-dir";
import { createQueryBody, getEnv, header } from "../utils.ts";

import { Image } from "npm:mdast";
import { visit } from "npm:unist-util-visit";
import { fromMarkdown } from "npm:mdast-util-from-markdown";
import { Destination, download } from "https://deno.land/x/download/mod.ts";

export async function getFiberyArticles(): Promise<FiberyArticle[] | never[]> {
  const FIBERY_HOST = getEnv("FIBERY_HOST");
  const FIBERY_ARTICLE_DATABASE = getEnv("FIBERY_ARTICLE_DATABASE");
  const FIBERY_ARTICLE_SPACE = getEnv("FIBERY_ARTICLE_SPACE");
  const fiberyEndPoint = `${FIBERY_HOST}/api/graphql/space/${FIBERY_ARTICLE_SPACE}`;

  log.info("Get Fibery data...");
  // console.info("Get Fibery data...");
  const queryBody = await createQueryBody("scr/Fibery/query.graphql");
  const result = await (await fetch(fiberyEndPoint, {
    method: "POST",
    body: queryBody,
    headers: header(),
  })).json();
  if (!result.data) {
    log.error(`Fibery API returns message: "${result.message}"`);
    return [];
  }
  return result.data[`find${FIBERY_ARTICLE_DATABASE}`];
}

async function downloadImage(imageNode: Image) {
  const FIBERY_HOST = getEnv("FIBERY_HOST");
  const url = `${FIBERY_HOST}${imageNode.url}`;
  try {
    const fetchedDir = "./Fetched content/";
    const imageName = imageNode.alt;
    const destination: Destination = {
      dir: fetchedDir,
      file: imageName,
    };
    const reqInit: RequestInit = {
      method: "GET",
      headers: header(),
    };
    await download(url, destination, reqInit);
    return resolve(fetchedDir, imageName);
  } catch (err) {
    log.error(err);
  }
}

export async function downloadArticleAndImages(article: FiberyArticle) {
  log.info("Download article and images");
  const { name, content, creationDate } = article;
  console.log(creationDate, name);

  ensureDir("Fetched content");
  const articlePath = resolve("Fetched content", `${name}.md`.replace(/[/\\?%*:|"<>]/g, "-"));
  await Deno.writeTextFile(articlePath, content.md);

  const imageNodes: Image[] = [];
  const tree = fromMarkdown(content.md);
  visit(tree, function (node) {
    if (node.type === "image") {
      imageNodes.push(node);
    }
  });
  const imagePaths: Array<string | undefined> = [];
  for (const imageNode of imageNodes) {
    imagePaths.push(await downloadImage(imageNode));
  }
  return {
    articlePath: articlePath,
    imagePaths: imagePaths,
  };
}

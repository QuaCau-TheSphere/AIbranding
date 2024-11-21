import * as log from "jsr:@std/log";
log.info("Start program");

import { downloadArticleAndImages, getFiberyArticles } from "./scr/Fibery/Fetch data from Fibery.ts";
import { postToFacebook } from "./scr/Post to Facebook.ts";

try {
  // const articles = await getFiberyArticles();
  // const { articlePath, imagePaths } = await downloadArticleAndImages(articles[0]);

  const articlePath = "D:/QC supplements/Code/Apps/Xây nhân hiệu tự động/Fetched content/test.md";
  const article = await Deno.readTextFile(articlePath);
  const imagePaths = "D:/QC supplements/Code/Apps/Xây nhân hiệu tự động/Fetched content/LinhRab.jpg";
  await postToFacebook(article, [imagePaths]);
  log.info("Done");
} catch (error) {
  console.error(error);
}

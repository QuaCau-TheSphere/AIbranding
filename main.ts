import { resolve } from "jsr:@std/path/resolve";
import { ensureDir } from "jsr:@std/fs/ensure-dir";

import { getFiberyArticles } from "./scr/Fibery/Fetch data from Fibery.ts";
import { postToFacebook } from "./scr/Post to Facebook.ts";

for (const article of await getFiberyArticles()) {
  const { name, content, creationDate } = article;
  console.log(creationDate, name);

  ensureDir("Fetched content");
  const fetchedPath = resolve("Fetched content", `${name}.md`);
  await Deno.writeTextFile(fetchedPath, content.md);
}

// await postToFacebook(content.md);

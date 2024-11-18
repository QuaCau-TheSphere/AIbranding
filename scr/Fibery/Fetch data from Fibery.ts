import * as log from "jsr:@std/log";
import "jsr:@std/dotenv/load";
import { FiberyArticle } from "./types.ts";
import { getEnv } from "../utils.ts";

export async function getFiberyArticles(): Promise<FiberyArticle[] | never[]> {
  const FIBERY_TOKEN = getEnv("FIBERY_TOKEN");
  const FIBERY_HOST = getEnv("FIBERY_HOST");
  const FIBERY_ARTICLE_DATABASE = getEnv("FIBERY_ARTICLE_DATABASE");
  const FIBERY_ARTICLE_SPACE = getEnv("FIBERY_ARTICLE_SPACE");
  const fiberyEndPoint = `${FIBERY_HOST}/api/graphql/space/${FIBERY_ARTICLE_SPACE}`;

  const queryBody = JSON.stringify({ query: await Deno.readTextFile("scr/Fibery/query.graphql") });
  const result = await (await fetch(fiberyEndPoint, {
    method: "POST",
    body: queryBody,
    headers: {
      "Content-Type": `application/json`,
      Authorization: `Token ${FIBERY_TOKEN}`,
    },
  })).json();
  if (!result.data) {
    log.error(`Fibery API returns message: "${result.message}"`);
    return [];
  }
  return result.data[`find${FIBERY_ARTICLE_DATABASE}`];
}

// function compare(a: FiberyArticle, b: FiberyArticle) {
//   if (a.creationDate < b.creationDate) return -1;
//   if (a.creationDate > b.creationDate) return 1;
//   return 0;
// }

// export async function loadAvatar(author, avatarsCache, assetsDir) {
//   const avatars = author?.avatars;
//   if (avatars?.length) {
//     const avatar = avatars[0];
//     const secret = avatar.secret;
//     const name = avatar.name;
//     const ext = extname(name);
//     const fileName = secret + ext;
//     const cached = avatarsCache.get(secret);
//     if (cached) {
//       return fileName;
//     }
//     await downloadImage(`/api/files/${secret}`, assetsDir + "/" + fileName);
//     avatarsCache.set(secret, fileName);
//     return fileName;
//   }
//   return `fiberylogo.png`;
// }
// export async function downloadFeaturedAndSocialImage(files, articleDir) {
//   let featuredImage;
//   let socialImage;
//   for (const { name, secret } of files) {
//     const ext = extname(name);
//     const nameWithoutExt = basename(name, ext);
//     if (nameWithoutExt === "featuredImage" && !featuredImage) {
//       featuredImage = secret + ext;
//       await downloadImage(
//         `/api/files/${secret}`,
//         articleDir + "/" + featuredImage,
//       );
//     }
//     if (nameWithoutExt === "socialImage" && !socialImage) {
//       socialImage = secret + ext;
//       await downloadImage(
//         `/api/files/${secret}`,
//         articleDir + "/" + featuredImage,
//       );
//     }
//   }
//   if (!featuredImage && files[0]) {
//     const { name, secret } = files[0];
//     const ext = extname(name);
//     featuredImage = secret + ext;
//     await downloadImage(
//       `/api/files/${secret}`,
//       articleDir + "/" + featuredImage,
//     );
//   }
//   return {
//     featuredImage: featuredImage || socialImage,
//     socialImage: socialImage || featuredImage,
//   };
// }

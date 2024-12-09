import { unified } from "npm:unified";
import remarkParse from "npm:remark-parse";
import { visit } from "npm:unist-util-visit";
import { toMarkdown } from "npm:mdast-util-to-markdown";

export function articleTemplate({
  content,
  title,
  description,
  seoTitle,
  seoDescription,
  date,
  author,
  avatar,
  authorTitle,
  category,
  tags,
  purpose,
  featuredImage = ``,
  socialImage = ``,
  questions = [],
}) {
  const faq = questions.length
    ? `faq:
  ${
      questions.map(({ name, answer }) =>
        `- question: ${JSON.stringify(name)}
    answer: ${JSON.stringify(answer.text)}`
      ).join("\n  ")
    }
`
    : ``;
  return `---
title: "${title}"
description: "${description}"
date: ${JSON.stringify(date)}
author: ${author}
avatar: ${avatar}
authorTitle: ${authorTitle}
category: ${category}
tags: ${JSON.stringify(tags)}
purpose: ${JSON.stringify(purpose)}
featuredImage: ${featuredImage}
socialImage: ${socialImage}
seoTitle: "${seoTitle}"
seoDescription: "${seoDescription}"
${faq}
---
${content}
`;
}
export async function getFileSourceSlugs() {
  return new Set(
    (await readdir("content/blog", { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name),
  );
}
export async function validateArticles(articles) {
  const slugs = await getFileSourceSlugs();
  const slugsMap = new Map([]);
  for (const article of articles) {
    if (!article.slug) {
      throw new Error(
        `Article ${article.name} with publicId ${article.name} does not have a slug. This article will not be created. Please add a slug to the article in Fibery`,
      );
    }
    if (slugs.has(article.slug)) {
      throw new Error(
        `Duplicate ${article.name} with publicId ${article.name} and slug ${article.slug}. This article already exists in the blog file system.`,
      );
    }
    if (slugsMap.has(article.slug)) {
      const origin = slugsMap.get(article.slug);
      throw new Error(
        `Duplicate ${article.name} with publicId ${article.name} and slug ${article.slug}. This article already exists in Fibery. Origin: ${origin.name} with publicId ${origin.publicId}. Please remove the duplicate in Fibery.`,
      );
    }
    slugsMap.set(article.slug, {
      publicId: article.publicId,
      name: article.name,
    });
  }
}

// const assetsDir = `content/fibery-source-assets`
// const avatarsCache = new Map()
// await validateArticles(articles)
// for (const article of articles) {
//     const { md } = article.content
//     if (!article.slug) {
//         continue
//     }
//     const articleDir = `content/fibery-source-blog/${article.slug}`
//     try {
//         await mkdir(articleDir, { recursive: true })
//     } catch (err) {
//         console.error(err)
//     }
//     const contentAST = unified().use(remarkParse).parse(md)
//     const files = []
//     visit(contentAST, "image", async (node) => {
//         const url = node.url
//         if (url.startsWith("/api/files/")) {
//             const urlObject = new URL(url, FIBERY_HOST)
//             const ext = extname(node.alt)
//             const imageName = urlObject.pathname.replace("/api/files/", "") + ext
//             files.push({ url, name: imageName })
//             node.url = "./" + imageName
//             node.alt = node.title ? node.title : ""
//         }
//     })
//     visit(contentAST, "link", async (node) => {
//         const url = node.url
//         if (url.startsWith("https://") && url.endsWith(".mp4")) {
//             node.type = `html`
//             node.value = `<video autoPlay controls loop muted playsInline style={{width: "100%", maxWidth: 700}}>
//     <source src="${node.url}" type="video/mp4" />
// </video>`
//         }
//     })
//     for (const file of files) {
//         await downloadImage(file.url, articleDir + "/" + file.name, FIBERY_HOST)
//     }
//     const { featuredImage, socialImage } = await downloadFeaturedAndSocialImage(
//         article.files,
//         articleDir
//     )
//     await writeFile(
//         articleDir + "/index.md",
//         articleTemplate({
//             content: toMarkdown(contentAST, { resourceLink: true }),
//             title: article.name,
//             tags: article.tags ? article.tags.map(({ name }) => name) : [],
//             purpose: article.purpose
//                 ? article.purpose.map(({ value }) => value)
//                 : [4],
//             author: article.author?.name || "Fibery",
//             authorTitle: article.author?.authorTitle || "Mr. Robot",
//             avatar: await loadAvatar(article.author, avatarsCache, assetsDir ),
//             category: article.category?.name || "uncategorized",
//             description: article.description.text.replaceAll("\n", " "),
//             seoDescription: article.seoDescription.text.replaceAll("\n", " ").substring(0, 160),
//             seoTitle: article.seoTitle ?? "",
//             date: article.date || article.creationDate,
//             featuredImage,
//             socialImage,
//             questions: article.questions,
//         })
//     )
// }

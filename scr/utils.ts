import "jsr:@std/dotenv/load";
import { visit } from "npm:unist-util-visit";
import { Image } from "npm:mdast";

export function getEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not set in env`);
  return value;
}

export async function createQueryBody(path: string) {
  return JSON.stringify({ query: await Deno.readTextFile(path) }, null, 2);
}

export function header(): HeadersInit | undefined {
  const FIBERY_TOKEN = getEnv("FIBERY_TOKEN");
  return {
    "Content-Type": `application/json`,
    Authorization: `Token ${FIBERY_TOKEN}`,
  };
}

// export async function visitAsync(tree, matcher, asyncVisitor) {
//   const matches = [];
//   visit(tree, matcher, (...args) => {
//     matches.push(args);
//     return tree;
//   });

//   const promises = matches.map((match) => asyncVisitor(...match));
//   await Promise.all(promises);

//   return tree;
// }

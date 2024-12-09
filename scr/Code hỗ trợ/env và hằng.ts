import "jsr:@std/dotenv/load";

export function lấyEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} không được thiết lập trong env`);
  return value;
}
export const NƠI_LƯU = "Bài viết";

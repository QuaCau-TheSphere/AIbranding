import { parseAll } from "@std/yaml";
import { resolve } from "@std/path/resolve";
import { parseArgs } from "@std/cli/parse-args";

interface ThiếtLập {
  Fibery: {
    Host: string;
    Token: string;
    Database: string;
    Space: string;
  };
  Facebook: {
    "Profile url": string;
    Email: string;
    Password: string;
  };
}
export const flags = parseArgs(Deno.args, {
  boolean: ["headful"],
  string: ["email"],
  default: { headful: false, email: "kendykangta99@gmail.com" },
});

const dsThiếtLập = parseAll(await Deno.readTextFile("./Thiết lập.yaml"), { schema: "core" }) as ThiếtLập[];
export const thiếtLập = dsThiếtLập.find((thiếtLập) => thiếtLập.Facebook.Email === flags.email) || dsThiếtLập[0];

export const NƠI_LƯU = "Bài viết";

export const ĐƯỜNG_DẪN_TỚI_QUERY_FIBERY = resolve("Code hỗ trợ", "Fibery", "query.graphql");

export const ĐƯỜNG_DẪN_TỚI_XÁC_THỰC_ĐĂNG_NHẬP = "Xác thực đăng nhập";
export const ĐƯỜNG_DẪN_TỚI_COOKIE = resolve(ĐƯỜNG_DẪN_TỚI_XÁC_THỰC_ĐĂNG_NHẬP, "Cookie", `${flags.email}.json`);
export const ĐƯỜNG_DẪN_TỚI_DỮ_LIỆU_NGƯỜI_DÙNG = resolve(ĐƯỜNG_DẪN_TỚI_XÁC_THỰC_ĐĂNG_NHẬP, "Dữ liệu người dùng", `${flags.email}`);

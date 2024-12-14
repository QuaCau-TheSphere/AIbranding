import { parse } from "@std/yaml";

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

export const thiếtLập = parse(await Deno.readTextFile("./Thiết lập.yaml")) as ThiếtLập;

export const NƠI_LƯU = "Bài viết";
export const ĐƯỜNG_DẪN_TỚI_COOKIE = "cookies.json";

import { readFile } from "fs/promises";
import { isFile } from "./isFile.js";
import { resolvePath } from "../path/resolvePath.js";

async function fk_readFile(filePath: string) {
  // check that file exists
  if (!isFile(filePath)) {
    return false;
  }

  // read file
  try {
    return await readFile(resolvePath(filePath), "utf8");
  } catch {
    return false;
  }
}

export { fk_readFile as readFile };

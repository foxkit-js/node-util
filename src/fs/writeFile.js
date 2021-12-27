import fs from "fs/promises";
import { dirname } from "path";
import { dirExists } from "./dirExists.js";
import { makeDir } from "./makeDir.js";
import { resolvePath } from "../path/resolvePath.js";

export async function writeFile(filePath, content) {
  if (content === undefined || content === null) return false;

  // prep directory
  const dirPath = dirname(filePath);
  if (!(await dirExists(dirPath))) {
    await makeDir(dirPath);
  }

  // write File
  const fullPath = resolvePath(filePath);
  if (typeof content === "object") {
    // write objects as stringified json
    await fs.writeFile(fullPath, JSON.stringify(content), "utf8");
    return;
  }

  await fs.writeFile(fullPath, `${content}`, "utf8");
}

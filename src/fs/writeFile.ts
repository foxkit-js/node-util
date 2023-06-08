import { writeFile } from "fs/promises";
import { dirname } from "path";
import { dirExists } from "./dirExists";
import { makeDir } from "./makeDir";
import { resolvePath } from "../path/resolvePath";

async function fk_writeFile(filePath: string, content: any) {
  if (content === undefined || content === null) return;

  // prep directory
  const dirPath = dirname(filePath);
  if (!(await dirExists(dirPath))) {
    await makeDir(dirPath);
  }

  // write File
  const fullPath = resolvePath(filePath);
  if (typeof content === "object") {
    // write objects as stringified json
    await writeFile(fullPath, JSON.stringify(content), "utf8");
    return;
  }

  await writeFile(fullPath, `${content}`, "utf8");
}

export { fk_writeFile as writeFile };

import { writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { isDirectory } from "./isDirectory";
import { resolvePath } from "../path/resolvePath";

async function fk_writeFile(filePath: string, content: unknown) {
  if (content === undefined || content === null) return;

  // prep directory
  const dirPath = dirname(filePath);
  if (!(await isDirectory(dirPath))) {
    await mkdir(dirPath, { recursive: true });
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

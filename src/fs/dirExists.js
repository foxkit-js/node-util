import fs from "fs/promises";
import { resolvePath } from "../path/resolvePath.js";

export async function dirExists(filePath) {
  const fullPath = resolvePath(filePath);
  try {
    const dirStat = await fs.stat(fullPath);
    return dirStat.isDirectory();
  } catch {
    return false;
  }
}

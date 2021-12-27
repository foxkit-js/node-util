import fs from "fs/promises";
import { resolvePath } from "../path/resolvePath.js";

export async function fileExists(filePath) {
  const fullPath = resolvePath(filePath);
  try {
    const fileStat = await fs.stat(fullPath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

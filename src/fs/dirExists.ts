import { stat } from "fs/promises";
import { resolvePath } from "../path/resolvePath";

export async function dirExists(filePath: string) {
  const fullPath = resolvePath(filePath);
  try {
    const dirStat = await stat(fullPath);
    return dirStat.isDirectory();
  } catch {
    return false;
  }
}

import { stat } from "fs/promises";
import { resolvePath } from "../path/resolvePath";

export async function fileExists(filePath: string) {
  const fullPath = resolvePath(filePath);
  try {
    const fileStat = await stat(fullPath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

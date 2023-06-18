import { stat } from "fs/promises";

/**
 * Checks if there is a directory at a given path
 * @param dirPath Absolute or relative path to the directory
 * @returns boolean - true if there is a directory at the path
 */
export async function isDirectory(dirPath: string) {
  try {
    const dirStat = await stat(dirPath);
    return dirStat.isDirectory();
  } catch {
    return false;
  }
}

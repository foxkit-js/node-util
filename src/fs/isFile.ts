import { stat } from "fs/promises";

/**
 * Checks if there is a file at a given path
 * @param filePath Absolute or relative path to the file
 * @returns boolean- true if there is a file at the path
 */
export async function isFile(filePath: string) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

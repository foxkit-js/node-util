import { writeFile as fsWriteFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { isDirectory } from "./isDirectory";

/**
 * Writes string to file
 * @param filePath Absolute or relative path to file
 * @param content Content to be written to file, non-string values should be stringified first.
 * @returns `true` or `false` depending on whether the write completed successfully.
 */
export async function writeFile(filePath: string, content: string) {
  try {
    // prep directory
    const dirPath = dirname(filePath);
    if (!(await isDirectory(dirPath))) {
      await mkdir(dirPath, { recursive: true });
    }

    // write File
    await fsWriteFile(filePath, content, "utf-8");
    return true;
  } catch {
    return false;
  }
}

import { readFile as fsReadFile } from "fs/promises";
import { isFile } from "./isFile.js";

/**
 * Reads content of a file as string
 * @param filePath Absolute or relative path to file
 * @returns File content as string or undefined if the file could not be read
 */
export async function readFile(filePath: string) {
  // check that file exists
  if (!(await isFile(filePath))) {
    return;
  }

  // read file
  try {
    return await fsReadFile(filePath, "utf-8");
  } catch {
    return;
  }
}

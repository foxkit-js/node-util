import { basename, extname } from "path";

/**
 * Extracts file name from a given path
 * @param filePath Absolute or relative path to a file
 * @param withExt Whether to include the file extension
 * @returns File name as string
 */
export function getFileName(filePath: string, withExt = true) {
  if (withExt) return basename(filePath);
  return basename(filePath, extname(filePath));
}

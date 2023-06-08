import { basename, extname } from "path";

export function getFileName(filePath: string, withExt: boolean = true) {
  if (withExt) return basename(filePath);
  return basename(filePath, extname(filePath));
}

import { isAbsolute } from "path";

export function toRelativePath(filePath) {
  if (!isAbsolute(filePath)) return filePath;

  return filePath.substring(process.cwd().length);
}

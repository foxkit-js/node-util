import { isAbsolute } from "path";

export function toRelativePath(filePath: string) {
  if (!isAbsolute(filePath)) return filePath;

  return filePath.substring(process.cwd().length);
}

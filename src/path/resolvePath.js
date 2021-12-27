import { join, isAbsolute } from "path";

export function resolvePath(filePath, ...morePaths) {
  if (morePaths.length > 0) {
    const basePath = resolvePath(filePath);
    return join(basePath, ...morePaths);
  }

  if (!isAbsolute(filePath)) {
    return join(process.cwd(), filePath, ...morePaths);
  }

  return filePath;
}

import { readFile } from "./readFile";

export async function readFileJson<FileType = unknown>(
  filePath: string
): Promise<false | FileType> {
  try {
    const fileContent = await readFile(filePath);
    if (!fileContent) return false;
    return JSON.parse(fileContent) as FileType;
  } catch {
    return false;
  }
}

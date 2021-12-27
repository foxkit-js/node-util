import { readFile } from "./readFile.js";

export async function readFileJson(filePath) {
  try {
    const fileContent = await readFile(filePath);
    if (!fileContent) return false;
    return JSON.parse(fileContent);
  } catch {
    return false;
  }
}

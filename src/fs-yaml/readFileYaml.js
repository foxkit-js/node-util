import YAML from "yaml";
import { readFile } from "../fs/readFile.js";

export async function readFileYaml(filePath) {
  try {
    const fileContent = await readFile(filePath);
    if (!fileContent) return false;
    return YAML.parse(fileContent);
  } catch {
    return false;
  }
}

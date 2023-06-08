import YAML from "yaml";
import { readFile } from "../fs/readFile";

export async function readFileYaml<FileType>(
  filePath: string
): Promise<false | FileType> {
  try {
    const fileContent = await readFile(filePath);
    if (!fileContent) return false;
    return YAML.parse(fileContent) as FileType;
  } catch {
    return false;
  }
}

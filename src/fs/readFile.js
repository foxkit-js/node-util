import fs from "fs/promises";
import { fileExists } from "./fileExists.js";
import { resolvePath } from "../path/resolvePath.js";

export async function readFile(filePath) {
  // check that file exists
  if (!fileExists(filePath)) {
    return false;
  }

  // read file
  try {
    return await fs.readFile(resolvePath(filePath), "utf8");
  } catch {
    return false;
  }
}

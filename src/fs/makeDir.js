import fs from "fs/promises";
import { resolvePath } from "../path/resolvePath.js";

export async function makeDir(dirPath) {
  await fs.mkdir(resolvePath(dirPath), { recursive: true });
}

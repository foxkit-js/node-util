import { mkdir } from "fs/promises";
import { resolvePath } from "../path/resolvePath";

export async function makeDir(dirPath: string) {
  await mkdir(resolvePath(dirPath), { recursive: true });
}

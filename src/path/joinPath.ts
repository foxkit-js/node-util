import { join } from "path";

export function joinPath(...pieces: string[]) {
  return join(...pieces);
}

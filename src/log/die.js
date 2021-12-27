import { log } from "./log.js";

export function die(text) {
  if (text) log.error(text);
  process.exit(1);
}

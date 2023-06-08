import { log } from "./log";

export function die(text?: string) {
  if (text) log.error(text);
  process.exit(1);
}

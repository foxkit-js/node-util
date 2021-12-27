import { fetch } from "./fetch.js";

export async function fetchJson(url) {
  try {
    const resContent = await fetch(url);
    if (!resContent) return false;
    return await resContent.json();
  } catch {
    return false;
  }
}

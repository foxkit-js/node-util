import nodeFetch from "node-fetch";

export async function fetch(url, headers) {
  try {
    const res = await nodeFetch(url, headers);
    if (!res.ok) return false;
    return res;
  } catch {
    return false;
  }
}

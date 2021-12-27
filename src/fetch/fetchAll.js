import { fetch } from "./fetch.js";
import { fetchJson } from "./fetchJson.js";

function handleReq(req) {
  if (typeof req === "string") {
    return fetch(req);
  }
  const [url, init] = req;

  return fetch(url, init);
}

function handleReqJson(req) {
  if (typeof req === "string") {
    return fetchJson(req);
  }
  const [url, init] = req;

  return fetchJson(url, init);
}

export async function fetchAll(req, { limit = false, json = false }) {
  const safeLimit = isNaN(+limit) ? 0 : +limit;
  const handler = json ? handleReqJson : handleReq;

  if (!limit || req.length < safeLimit) {
    return await Promise.all(req.map(handler));
  }

  const res = new Array();

  for (let i = 0; i < req.length; i += safeLimit) {
    const these = await Promise.all(req.slice(i, +limit + i).map(handler));
    res.push(...these);
  }

  return res;
}

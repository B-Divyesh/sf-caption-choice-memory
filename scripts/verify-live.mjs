import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const baseUrl = (process.env.LIVE_BASE_URL ?? "https://caption-choice-memory.sociobot.in").replace(/\/$/, "");
const zipPath = "dist/site/downloads/caption-choice-memory.zip";
const workerPath = "dist/site/service-worker.js";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: { "cache-control": "no-cache" }
  });
  const body = Buffer.from(await response.arrayBuffer());
  return { response, body };
}

const localZip = await readFile(zipPath);
const liveZip = await get("/downloads/caption-choice-memory.zip");
if (!liveZip.response.ok) throw new Error(`Live extension ZIP returned HTTP ${liveZip.response.status}`);
if (!/^(application\/zip|application\/octet-stream)(?:;|$)/i.test(liveZip.response.headers.get("content-type") ?? "")) {
  throw new Error(`Live extension ZIP has unexpected content type: ${liveZip.response.headers.get("content-type")}`);
}
if (liveZip.body.subarray(0, 2).toString() !== "PK") throw new Error("Live extension download is not a ZIP file");
if (!liveZip.body.equals(localZip)) {
  throw new Error(`Live ZIP identity mismatch: local ${digest(localZip)}, live ${digest(liveZip.body)}`);
}

const localWorker = await readFile(workerPath);
const liveWorker = await get("/service-worker.js");
if (!liveWorker.response.ok) throw new Error(`Live service worker returned HTTP ${liveWorker.response.status}`);
if (!liveWorker.body.equals(localWorker)) {
  throw new Error(`Live service-worker identity mismatch: local ${digest(localWorker)}, live ${digest(liveWorker.body)}`);
}
if (!/\bno-cache\b/i.test(liveWorker.response.headers.get("cache-control") ?? "")) {
  throw new Error(`Live service worker is missing Cache-Control: no-cache`);
}

console.log(`Live ZIP matches candidate: ${liveZip.body.byteLength} bytes, sha256 ${digest(localZip)}`);
console.log(`Live service worker matches candidate: ${liveWorker.body.byteLength} bytes, sha256 ${digest(localWorker)}`);

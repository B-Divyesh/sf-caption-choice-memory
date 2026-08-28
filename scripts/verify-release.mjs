import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const zipPath = "dist/site/downloads/caption-choice-memory.zip";
const workerPath = "dist/site/service-worker.js";

await access(zipPath);
const zip = await readFile(zipPath);
if (zip.subarray(0, 2).toString() !== "PK" || zip.byteLength < 10_000) {
  throw new Error(`${zipPath} is not a valid non-empty ZIP package`);
}
const archiveTest = spawnSync("unzip", ["-t", zipPath], { encoding: "utf8" });
if (archiveTest.status !== 0) throw new Error(`The extension archive failed unzip validation: ${archiveTest.stderr}`);
const manifestResult = spawnSync("unzip", ["-p", zipPath, "manifest.json"], { encoding: "utf8" });
if (manifestResult.status !== 0) throw new Error("The extension archive has no root manifest.json");
const manifest = JSON.parse(manifestResult.stdout);
if (manifest.manifest_version !== 3 || !manifest.background?.service_worker) {
  throw new Error("The extension archive is not a service-worker-based MV3 package");
}

const worker = await readFile(workerPath, "utf8");
if (!/const BUILT_ASSETS = \[(?=[^\]]*\/assets\/index-[^"]+\.css)(?=[^\]]*\/assets\/index-[^"]+\.js)[^\]]+\];/.test(worker)) {
  throw new Error(`${workerPath} does not contain the candidate CSS and JS precache entries`);
}

const index = await readFile("dist/site/index.html", "utf8");
const scriptPath = index.match(/<script[^>]+src="([^"]+)"/)?.[1];
if (!scriptPath) throw new Error("The production landing page has no application script");
const applicationScript = await readFile(`dist/site${scriptPath}`, "utf8");
if (!applicationScript.includes("/downloads/caption-choice-memory.zip")) {
  throw new Error("The production landing page does not link to the packaged extension");
}

console.log(`Verified deployable site: ${zip.byteLength} byte ZIP and generated service worker`);

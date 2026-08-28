import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = ".output";
const downloadDirectory = "dist/site/downloads";
const files = await readdir(outputDirectory);
const extensionArchive = files.find((file) => file.endsWith("-chrome.zip"));

if (!extensionArchive) {
  throw new Error("The extension archive was not created. Run npm run build:extension first.");
}

await mkdir(downloadDirectory, { recursive: true });
await copyFile(join(outputDirectory, extensionArchive), join(downloadDirectory, "caption-choice-memory.zip"));

const siteIndex = await readFile("dist/site/index.html", "utf8");
const builtAssets = [...siteIndex.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((match) => match[1]);
const serviceWorkerPath = "dist/site/service-worker.js";
const serviceWorker = await readFile(serviceWorkerPath, "utf8");
await writeFile(
  serviceWorkerPath,
  serviceWorker.replace("const BUILT_ASSETS = [];", `const BUILT_ASSETS = ${JSON.stringify(builtAssets)};`)
);

const sourceMapDirectory = "dist/site/assets";
for (const file of await readdir(sourceMapDirectory)) {
  if (file.endsWith(".map")) await rm(join(sourceMapDirectory, file));
}

console.log("Packaged dist/site/downloads/caption-choice-memory.zip");

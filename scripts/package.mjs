import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
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

const sourceMapDirectory = "dist/site/assets";
for (const file of await readdir(sourceMapDirectory)) {
  if (file.endsWith(".map")) await rm(join(sourceMapDirectory, file));
}

console.log("Packaged dist/site/downloads/caption-choice-memory.zip");

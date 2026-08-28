import { chromium, expect, test } from "@playwright/test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

test("the built extension applies its default to a real HTML5 track", async () => {
  const profile = await mkdtemp(`${tmpdir()}/caption-choice-memory-test-`);
  const extensionPath = resolve(".output/chrome-mv3");
  const context = await chromium.launchPersistentContext(profile, {
    channel: "chromium",
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent("serviceworker");
    await worker.evaluate(async () => {
      const extensionApi = (globalThis as typeof globalThis & { chrome: { storage: { local: { set: (value: object) => Promise<void> } } } }).chrome;
      await extensionApi.storage.local.set({
        "site:127.0.0.1": {
          site: "127.0.0.1",
          configured: true,
          enabled: true,
          defaultState: "on",
          languages: ["en", "es"],
          updatedAt: Date.now()
        }
      });
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/extension-fixture.html");
    await expect.poll(() => page.evaluate(() => {
      const video = document.querySelector("video");
      return video?.textTracks[0]?.mode;
    })).toBe("showing");
    expect(await page.evaluate(() => document.querySelector("video")?.textTracks[1]?.mode)).toBe("disabled");
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});

import { chromium, expect, test } from "@playwright/test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

async function withExtension(testBody: (context: Awaited<ReturnType<typeof chromium.launchPersistentContext>>, extensionId: string) => Promise<void>): Promise<void> {
  const profile = await mkdtemp(`${tmpdir()}/caption-choice-memory-claim-`);
  const extensionPath = resolve(".output/chrome-mv3");
  const context = await chromium.launchPersistentContext(profile, {
    channel: "chromium",
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent("serviceworker");
    await testBody(context, new URL(worker.url()).host);
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
}

async function makeFixtureActive(context: Awaited<ReturnType<typeof chromium.launchPersistentContext>>): Promise<void> {
  const worker = context.serviceWorkers()[0]!;
  await worker.evaluate(async () => {
    const extensionApi = globalThis as typeof globalThis & {
      chrome: { tabs: { query: (query: object) => Promise<Array<{ id?: number; url?: string }>>; update: (id: number, update: object) => Promise<unknown> } };
    };
    const [fixture] = (await extensionApi.chrome.tabs.query({})).filter((tab) => tab.url?.includes("127.0.0.1:4173/extension-fixture.html"));
    if (!fixture?.id) throw new Error("Extension fixture tab was not available");
    await extensionApi.chrome.tabs.update(fixture.id, { active: true });
  });
}

test("@claim:one-action applies a saved caption choice in one action", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Apply caption choice" }).click();
  await expect(page.locator("#demo-result strong")).toHaveText("English captions are on");
  await expect(page.locator("#sample-caption")).toBeVisible();
});

test("@claim:site-memory keeps each site's ordered choice in extension storage", async () => {
  await withExtension(async (context, extensionId) => {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/extension-fixture.html");
    const popup = await context.newPage();
    await makeFixtureActive(context);
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(popup.locator("#site-heading")).toHaveText("127.0.0.1");
    await popup.locator("#language-list select").nth(0).selectOption("es");
    await popup.getByRole("button", { name: "Apply caption choice" }).click();
    const worker = context.serviceWorkers()[0]!;
    const saved = await worker.evaluate(async () => {
      const extensionApi = globalThis as typeof globalThis & { chrome: { storage: { local: { get: (key: string) => Promise<unknown> } } } };
      return extensionApi.chrome.storage.local.get("site:127.0.0.1");
    });
    expect(saved).toMatchObject({
      "site:127.0.0.1": { site: "127.0.0.1", configured: true, languages: ["es"] }
    });
  });
});

test("@claim:offline-action applies a caption choice without network access", async ({ page, context }) => {
  await page.goto("/demo");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Apply your saved captions");
  await page.locator("#demo-language-one").selectOption("es");
  await page.getByRole("button", { name: "Apply caption choice" }).click();
  await expect(page.locator("#demo-result strong")).toHaveText("Spanish captions are on");
  await expect(page.locator("#sample-caption")).toHaveText("La marea cambia antes de la lluvia.");
});

test("@claim:private-requests keeps extension preference actions local", async () => {
  const outgoing: string[] = [];
  await withExtension(async (context, extensionId) => {
    context.on("request", (request) => outgoing.push(request.url()));
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/extension-fixture.html");
    const popup = await context.newPage();
    await makeFixtureActive(context);
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await popup.getByRole("button", { name: "Apply caption choice" }).click();
  });
  expect(outgoing.length).toBeGreaterThan(0);
  expect(outgoing.filter((url) => !(new URL(url).origin === "http://127.0.0.1:4173" || url.startsWith("chrome-extension://")))).toEqual([]);
});

test("@claim:unsupported-notice explains an unsupported player", async ({ page }) => {
  await page.goto("/demo");
  await page.locator("#demo-player").selectOption("unsupported");
  await page.getByRole("button", { name: "Apply caption choice" }).click();
  await expect(page.locator("#demo-result strong")).toHaveText("Player not supported");
  await expect(page.locator("#demo-result span")).toContainText("caption menu");
});

test("@claim:keyboard-shortcut applies the saved choice from the keyboard", async ({ page }) => {
  await page.goto("/demo");
  await page.locator("#demo-language-one").selectOption("fr");
  await page.keyboard.press("Alt+Shift+C");
  await expect(page.locator("#demo-result strong")).toHaveText("French captions are on");
  await expect(page.locator("#sample-caption")).toHaveText("La marée tourne avant la pluie.");
  await page.locator("#demo-language-one").selectOption("es");
  await page.keyboard.press("Alt+Shift+C");
  await expect(page.locator("#demo-result strong")).toHaveText("Spanish captions are on");
});

test("@claim:download-package serves a packaged MV3 extension", async ({ request }) => {
  const response = await request.get("/downloads/caption-choice-memory.zip");
  expect(response.ok()).toBe(true);
  const body = await response.body();
  expect(body.subarray(0, 2).toString()).toBe("PK");
  expect(body.byteLength).toBeGreaterThan(10_000);
  const serviceWorker = await request.get("/service-worker.js");
  await expect(serviceWorker).toBeOK();
  expect(await serviceWorker.text()).toMatch(/const BUILT_ASSETS = \[(?=[^\]]*\/assets\/index-[^"]+\.css)(?=[^\]]*\/assets\/index-[^"]+\.js)[^\]]+\];/);
});

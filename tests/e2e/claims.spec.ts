import { expect, test } from "@playwright/test";

test("@claim:one-action applies a saved caption choice in one action", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Apply caption choice" }).click();
  await expect(page.locator("#demo-result strong")).toHaveText("English captions are on");
  await expect(page.locator("#sample-caption")).toBeVisible();
});

test("@claim:site-memory keeps the sample site's ordered choice in its sandbox", async ({ page }) => {
  await page.goto("/demo");
  await page.locator("#demo-language-one").selectOption("es");
  await page.getByRole("button", { name: "Apply caption choice" }).click();
  await page.reload();
  await expect(page.locator("#demo-language-one")).toHaveValue("es");
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toEqual(["demo:caption-choice-memory:preference"]);
});

test("@claim:offline-action applies a caption choice without network access", async ({ page, context }) => {
  await page.goto("/demo");
  await context.setOffline(true);
  await page.locator("#demo-language-one").selectOption("es");
  await page.getByRole("button", { name: "Apply caption choice" }).click();
  await expect(page.locator("#demo-result strong")).toHaveText("Spanish captions are on");
  await expect(page.locator("#sample-caption")).toHaveText("La marea cambia antes de la lluvia.");
});

test("@claim:private-requests sends no demo preference to another origin", async ({ page }) => {
  const outgoing: string[] = [];
  page.on("request", (request) => outgoing.push(request.url()));
  await page.goto("/demo");
  await page.locator("#demo-language-one").selectOption("fr");
  await page.getByRole("button", { name: "Apply caption choice" }).click();
  expect(outgoing.length).toBeGreaterThan(0);
  expect(outgoing.every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
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
});

test("@claim:download-package serves a packaged MV3 extension", async ({ request }) => {
  const response = await request.get("/downloads/caption-choice-memory.zip");
  expect(response.ok()).toBe(true);
  const body = await response.body();
  expect(body.subarray(0, 2).toString()).toBe("PK");
  expect(body.byteLength).toBeGreaterThan(10_000);
});

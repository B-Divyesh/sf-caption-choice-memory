import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const route of ["/", "/demo", "/privacy", "/terms", "/404.html"]) {
  test(`${route} has one clear page heading and no serious accessibility issues`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Caption Choice Memory/);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
    expect(serious).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test("the first screen works at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Try it with sample data" })).toBeVisible();
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(390);
});

test("every directly operated demo control has a 44px by 44px mobile touch target", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo");
  for (const locator of [
    page.getByRole("button", { name: "Reset demo" }),
    page.getByRole("link", { name: "Install the extension" }),
    page.getByRole("link", { name: "Demo", exact: true }),
    page.getByRole("switch", { name: "Use on this site Visible per-site off switch" }),
    page.getByRole("radio", { name: "Turn captions on" }),
    page.getByRole("radio", { name: "Keep captions off" }),
    page.getByLabel("First preferred language"),
    page.getByLabel("Second preferred language"),
    page.getByLabel("Sample player state"),
    page.getByRole("button", { name: "Apply caption choice" }),
    page.getByLabel("Footer navigation").getByRole("link", { name: "Privacy", exact: true }),
    page.getByLabel("Footer navigation").getByRole("link", { name: "Terms", exact: true })
  ]) {
    const box = await locator.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test("static deployment rules preserve known routes, real 404s, immutable assets, and service-worker updates", async () => {
  const config = await import("node:fs/promises").then(({ readFile }) => readFile("site/public/staticwebapp.config.json", "utf8"));
  expect(config).toContain('"route": "/demo", "rewrite": "/index.html"');
  expect(config).toContain('"route": "/privacy", "rewrite": "/index.html"');
  expect(config).toContain('"route": "/terms", "rewrite": "/index.html"');
  expect(config).not.toContain("navigationFallback");
  expect(config).toContain('"rewrite": "/404.html"');
  expect(config).toContain("max-age=31536000, immutable");
  expect(config).toContain('"route": "/service-worker.js"');
  expect(config).toContain('"Cache-Control": "no-cache"');
});

test("the static 404 includes the product shell and route metadata", async () => {
  const page = await import("node:fs/promises").then(({ readFile }) => readFile("site/public/404.html", "utf8"));
  expect(page).toContain('<meta name="description"');
  expect(page).toContain('rel="canonical"');
  expect(page).toContain('property="og:title"');
  expect(page).toContain('name="twitter:card"');
  expect(page).toContain('apple-touch-icon');
  expect(page).toContain('<header class="site-header">');
  expect(page).toContain('<footer class="site-footer">');
  expect(page).toContain('<h1>Page not found</h1>');
});

test("internal navigation updates history, title, and focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Demo", exact: true }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page).toHaveTitle("Demo — Caption Choice Memory");
  await expect(page.locator("h1")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("h1")).toHaveText("Keep caption choices one action away");
});

test("the one-click query demo route loads the isolated demo", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page).toHaveTitle("Demo — Caption Choice Memory");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.locator("h1")).toHaveText("Apply your saved captions");
});

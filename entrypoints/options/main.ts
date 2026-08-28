import { browser } from "wxt/browser";
import { parseChoiceExport, preferenceKey, type ChoiceExport, type SitePreference } from "../../shared/preferences";
import "./style.css";

const exportButton = document.querySelector<HTMLButtonElement>("#export-choices")!;
const importFile = document.querySelector<HTMLInputElement>("#import-file")!;
const preview = document.querySelector<HTMLElement>("#import-preview")!;
const confirmButton = document.querySelector<HTMLButtonElement>("#confirm-import")!;
const result = document.querySelector<HTMLElement>("#result")!;
let pendingImport: ChoiceExport | undefined;

function announce(message: string): void {
  result.hidden = false;
  result.textContent = message;
}

async function savedChoices(): Promise<SitePreference[]> {
  const all = await browser.storage.local.get();
  return Object.entries(all)
    .filter(([key, value]) => key.startsWith("site:") && value && typeof value === "object")
    .map(([, value]) => value as SitePreference)
    .sort((left, right) => left.site.localeCompare(right.site));
}

exportButton.addEventListener("click", async () => {
  const backup: ChoiceExport = { version: 1, choices: await savedChoices() };
  const blob = new Blob([`${JSON.stringify(backup, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "caption-choice-memory-choices.json";
  link.click();
  URL.revokeObjectURL(url);
  announce(`Exported ${backup.choices.length} caption choice${backup.choices.length === 1 ? "" : "s"}.`);
});

importFile.addEventListener("change", async () => {
  pendingImport = undefined;
  confirmButton.disabled = true;
  const file = importFile.files?.[0];
  if (!file) return;
  try {
    const backup = parseChoiceExport(await file.text());
    const existing = new Set((await savedChoices()).map((choice) => choice.site));
    const conflicts = backup.choices.filter((choice) => existing.has(choice.site));
    pendingImport = backup;
    preview.hidden = false;
    preview.textContent = `${backup.choices.length} choice${backup.choices.length === 1 ? "" : "s"} ready. ${conflicts.length} existing site${conflicts.length === 1 ? " will" : "s will"} be replaced.`;
    confirmButton.disabled = false;
  } catch (error) {
    preview.hidden = false;
    preview.textContent = error instanceof Error ? error.message : "This file could not be read.";
  }
});

confirmButton.addEventListener("click", async () => {
  if (!pendingImport) return;
  const entries = Object.fromEntries(pendingImport.choices.map((choice) => [preferenceKey(choice.site), choice]));
  await browser.storage.local.set(entries);
  announce(`Imported ${pendingImport.choices.length} caption choice${pendingImport.choices.length === 1 ? "" : "s"}.`);
  pendingImport = undefined;
  confirmButton.disabled = true;
  preview.hidden = true;
  importFile.value = "";
});

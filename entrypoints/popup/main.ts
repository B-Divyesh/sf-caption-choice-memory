import { browser } from "wxt/browser";
import {
  cleanLanguages,
  DEFAULT_PREFERENCE,
  LANGUAGE_OPTIONS,
  preferenceKey,
  type ApplyResult,
  type SitePreference
} from "../../shared/preferences";
import "./style.css";

const form = document.querySelector<HTMLFormElement>("#preference-form")!;
const enabledInput = document.querySelector<HTMLInputElement>("#site-enabled")!;
const languageList = document.querySelector<HTMLOListElement>("#language-list")!;
const addButton = document.querySelector<HTMLButtonElement>("#add-language")!;
const languageSection = document.querySelector<HTMLElement>("#language-section")!;
const fields = document.querySelector<HTMLFieldSetElement>("#preference-fields")!;
const result = document.querySelector<HTMLElement>("#result")!;
const notice = document.querySelector<HTMLElement>("#page-notice")!;
let activeTabId: number | undefined;
let activeSite = "";

function setInteractiveState(): void {
  fields.disabled = !enabledInput.checked;
  languageSection.toggleAttribute("inert", !enabledInput.checked);
  languageSection.classList.toggle("is-disabled", !enabledInput.checked);
}

function makeLanguageRow(value: string): HTMLLIElement {
  const row = document.createElement("li");
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Preferred caption language");
  for (const [code, name] of LANGUAGE_OPTIONS) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    option.selected = code === value;
    select.append(option);
  }
  const controls = document.createElement("div");
  controls.className = "row-controls";
  const up = document.createElement("button");
  up.type = "button";
  up.className = "icon-button";
  up.setAttribute("aria-label", "Move language up");
  up.textContent = "↑";
  up.addEventListener("click", () => {
    const previous = row.previousElementSibling;
    if (previous) languageList.insertBefore(row, previous);
  });
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "icon-button remove";
  remove.setAttribute("aria-label", "Remove language");
  remove.textContent = "×";
  remove.addEventListener("click", () => {
    row.remove();
    addButton.disabled = languageList.children.length >= 4;
  });
  controls.append(up, remove);
  row.append(select, controls);
  return row;
}

function renderLanguages(languages: string[]): void {
  languageList.replaceChildren(...languages.map(makeLanguageRow));
  addButton.disabled = languages.length >= 4;
}

function showResult(message: ApplyResult): void {
  result.hidden = false;
  result.dataset.kind = message.kind;
  document.querySelector("#result-title")!.textContent = message.title;
  document.querySelector("#result-detail")!.textContent = message.detail;
}

function readPreference(): SitePreference {
  const selected = form.querySelector<HTMLInputElement>("input[name='default-state']:checked")!;
  const languages = Array.from(languageList.querySelectorAll("select")).map((select) => select.value);
  return {
    site: activeSite,
    configured: true,
    enabled: enabledInput.checked,
    defaultState: selected.value as SitePreference["defaultState"],
    languages: cleanLanguages(languages),
    updatedAt: Date.now()
  };
}

async function save(preference: SitePreference): Promise<void> {
  await browser.storage.local.set({ [preferenceKey(activeSite)]: preference });
}

enabledInput.addEventListener("change", async () => {
  setInteractiveState();
  if (activeSite) await save(readPreference());
  showResult(
    enabledInput.checked
      ? { kind: "applied", title: "Site switch is on", detail: "Apply the choice to the current video." }
      : { kind: "disabled", title: "Off on this site", detail: "Caption Choice Memory will not change this site's players." }
  );
});

addButton.addEventListener("click", () => {
  const used = new Set(Array.from(languageList.querySelectorAll("select")).map((select) => select.value));
  const next = LANGUAGE_OPTIONS.find(([code]) => !used.has(code))?.[0] ?? "en";
  languageList.append(makeLanguageRow(next));
  addButton.disabled = languageList.children.length >= 4;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = document.querySelector<HTMLButtonElement>("#apply-button")!;
  button.disabled = true;
  button.textContent = "Applying…";
  const preference = readPreference();
  await save(preference);
  try {
    if (!activeTabId) throw new Error("No tab");
    const message = await browser.tabs.sendMessage(activeTabId, { type: "APPLY_CAPTION_CHOICE" }) as ApplyResult;
    showResult(message);
  } catch {
    showResult({
      kind: "unsupported",
      title: "This page cannot be changed",
      detail: "Open a normal video page, then apply your caption choice again."
    });
  } finally {
    button.disabled = false;
    button.textContent = "Apply caption choice";
  }
});

async function start(): Promise<void> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  activeTabId = tab?.id;
  try {
    const url = new URL(tab?.url ?? "");
    if (!/^https?:$/.test(url.protocol)) throw new Error("Unsupported URL");
    activeSite = url.hostname;
    document.querySelector("#site-heading")!.textContent = activeSite;
  } catch {
    document.querySelector("#site-heading")!.textContent = "This browser page";
    notice.hidden = false;
    notice.textContent = "Open a website with a video to save a caption choice.";
    form.hidden = true;
    return;
  }

  const key = preferenceKey(activeSite);
  const stored = await browser.storage.local.get(key);
  const savedPreference = stored[key] as SitePreference | undefined;
  const preference = savedPreference ?? DEFAULT_PREFERENCE(activeSite);
  enabledInput.checked = preference.enabled;
  const radio = form.querySelector<HTMLInputElement>(`input[value="${preference.defaultState}"]`);
  if (radio) radio.checked = true;
  renderLanguages(preference.languages.length ? preference.languages : ["en"]);
  setInteractiveState();
  if (!savedPreference) {
    showResult({
      kind: "disabled",
      title: "No choice saved for this site",
      detail: "Choose a rule, then apply it to the current video."
    });
  }
}

void start();

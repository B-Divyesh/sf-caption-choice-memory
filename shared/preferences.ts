export type CaptionDefault = "on" | "off";

export interface SitePreference {
  site: string;
  configured: boolean;
  enabled: boolean;
  defaultState: CaptionDefault;
  languages: string[];
  updatedAt: number;
}

export interface ApplyResult {
  kind: "applied" | "unsupported" | "disabled" | "error";
  title: string;
  detail: string;
}

export const STORAGE_PREFIX = "site:";

export const LANGUAGE_OPTIONS = [
  ["en", "English"],
  ["en-GB", "English (UK)"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["hi", "Hindi"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["pt", "Portuguese"],
  ["zh", "Chinese"]
] as const;

export const DEFAULT_PREFERENCE = (site: string): SitePreference => ({
  site,
  configured: false,
  enabled: true,
  defaultState: "on",
  languages: ["en"],
  updatedAt: Date.now()
});

export function preferenceKey(site: string): string {
  return `${STORAGE_PREFIX}${site}`;
}

export function normalizeLanguage(code: string): string {
  return code.trim().replace("_", "-").toLowerCase();
}

export function languageMatches(candidate: string, preferred: string): boolean {
  const left = normalizeLanguage(candidate);
  const right = normalizeLanguage(preferred);
  return left === right || left.startsWith(`${right}-`) || right.startsWith(`${left}-`);
}

export function cleanLanguages(languages: string[]): string[] {
  return [...new Set(languages.map((code) => code.trim()).filter(Boolean))].slice(0, 4);
}

export interface ChoiceExport {
  version: 1;
  choices: SitePreference[];
}

export function isSitePreference(value: unknown): value is SitePreference {
  if (!value || typeof value !== "object") return false;
  const preference = value as Partial<SitePreference>;
  return typeof preference.site === "string" && preference.site.length > 0
    && typeof preference.configured === "boolean"
    && typeof preference.enabled === "boolean"
    && (preference.defaultState === "on" || preference.defaultState === "off")
    && Array.isArray(preference.languages)
    && preference.languages.every((language) => typeof language === "string")
    && preference.languages.length <= 4
    && typeof preference.updatedAt === "number";
}

export function parseChoiceExport(text: string): ChoiceExport {
  const parsed: unknown = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new Error("Choose a Caption Choice Memory backup file.");
  const backup = parsed as Partial<ChoiceExport>;
  if (backup.version !== 1 || !Array.isArray(backup.choices) || !backup.choices.every(isSitePreference)) {
    throw new Error("This file is not a valid Caption Choice Memory backup.");
  }
  const sites = new Set<string>();
  for (const choice of backup.choices) {
    if (sites.has(choice.site)) throw new Error("This backup has the same site more than once.");
    sites.add(choice.site);
  }
  return { version: 1, choices: backup.choices.map((choice) => ({ ...choice, languages: cleanLanguages(choice.languages) })) };
}

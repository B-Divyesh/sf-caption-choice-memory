export type CaptionDefault = "on" | "off";

export interface SitePreference {
  site: string;
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

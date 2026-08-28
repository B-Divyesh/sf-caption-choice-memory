// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { applyCaptionChoice } from "../../shared/player";
import { cleanLanguages, languageMatches, parseChoiceExport, type SitePreference } from "../../shared/preferences";

const preference: SitePreference = {
  site: "watch.example",
  configured: true,
  enabled: true,
  defaultState: "on",
  languages: ["en", "es"],
  updatedAt: 1
};

describe("caption player rules", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("matches regional language codes", () => {
    expect(languageMatches("en-US", "en")).toBe(true);
    expect(languageMatches("fr", "en")).toBe(false);
  });

  it("@claim:language-limit keeps the first four unique language choices in order", () => {
    expect(cleanLanguages(["es", "en", "fr", "es", "de", "ja"])).toEqual(["es", "en", "fr", "de"]);
  });

  it("@claim:free-no-account is configured as a free local extension", () => {
    const brief = JSON.parse(readFileSync(".factory/brief.json", "utf8")) as { monetization: string };
    const manifest = readFileSync("wxt.config.ts", "utf8");
    expect(brief.monetization).toBe("free");
    expect(manifest).not.toMatch(/billing|payment|sign.?in/i);
  });

  it("@claim:mit-license ships the MIT permission grant", () => {
    const license = readFileSync("LICENSE", "utf8");
    expect(license).toContain("MIT License");
    expect(license).toContain("Permission is hereby granted, free of charge");
  });

  it("@claim:native-caption-tracks applies the first preferred exposed track", async () => {
    const video = document.createElement("video");
    const tracks = [
      { language: "es", label: "Español", kind: "subtitles", mode: "disabled" },
      { language: "en-GB", label: "English", kind: "captions", mode: "disabled" }
    ];
    Object.defineProperty(video, "textTracks", { value: tracks });
    document.body.append(video);

    const result = await applyCaptionChoice(preference);
    expect(result.kind).toBe("applied");
    expect(result.title).toBe("English captions are on");
    expect(tracks[1]!.mode).toBe("showing");
    expect(tracks[0]!.mode).toBe("disabled");
  });

  it("turns every exposed track off", async () => {
    const video = document.createElement("video");
    const tracks = [{ language: "en", label: "English", kind: "captions", mode: "showing" }];
    Object.defineProperty(video, "textTracks", { value: tracks });
    document.body.append(video);
    const result = await applyCaptionChoice({ ...preference, defaultState: "off" });
    expect(result.title).toBe("Captions are off");
    expect(tracks[0]!.mode).toBe("disabled");
  });

  it("@claim:youtube-caption-controls uses the documented YouTube caption controls", async () => {
    const toggle = document.createElement("button");
    toggle.className = "ytp-subtitles-button";
    toggle.setAttribute("aria-pressed", "false");
    toggle.addEventListener("click", () => toggle.setAttribute("aria-pressed", "true"));
    const settings = document.createElement("button");
    settings.className = "ytp-settings-button";
    const captionMenu = document.createElement("button");
    captionMenu.className = "ytp-menuitem";
    captionMenu.textContent = "Subtitles/CC";
    const language = document.createElement("button");
    language.className = "ytp-menuitem";
    language.textContent = "English";
    let selectedLanguage = false;
    Object.defineProperty(language, "click", { value: () => { selectedLanguage = true; } });
    document.body.append(toggle, settings, captionMenu, language);
    const result = await applyCaptionChoice(preference);
    expect(result.title).toBe("Captions are on");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(selectedLanguage).toBe(true);
  });

  it("rejects malformed backups before storage", () => {
    expect(() => parseChoiceExport('{"version":1,"choices":[{"site":"x"}]}')).toThrow("not a valid");
    expect(parseChoiceExport(JSON.stringify({ version: 1, choices: [preference] }))).toMatchObject({ version: 1, choices: [{ site: "watch.example" }] });
  });
});

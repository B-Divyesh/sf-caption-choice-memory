// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { applyCaptionChoice } from "../../shared/player";
import { languageMatches, type SitePreference } from "../../shared/preferences";

const preference: SitePreference = {
  site: "watch.example",
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

  it("@claim:player-controls applies the first preferred exposed track", async () => {
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
});

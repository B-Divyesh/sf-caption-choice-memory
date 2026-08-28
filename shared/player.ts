import {
  LANGUAGE_OPTIONS,
  languageMatches,
  type ApplyResult,
  type SitePreference
} from "./preferences";

function applyNativeTracks(video: HTMLVideoElement, preference: SitePreference): ApplyResult | null {
  const tracks = Array.from(video.textTracks ?? []);
  if (tracks.length === 0) return null;

  if (preference.defaultState === "off") {
    for (const track of tracks) track.mode = "disabled";
    return {
      kind: "applied",
      title: "Captions are off",
      detail: "Applied this site's saved caption choice."
    };
  }

  const chosen = preference.languages
    .map((code) => tracks.find((track) => languageMatches(track.language, code)))
    .find(Boolean) ?? tracks.find((track) => track.kind === "captions" || track.kind === "subtitles") ?? tracks[0];

  for (const track of tracks) track.mode = track === chosen ? "showing" : "disabled";
  if (!chosen) return null;
  const label = chosen.label || chosen.language || "the first available language";
  return {
    kind: "applied",
    title: `${label} captions are on`,
    detail: "Applied this site's saved caption choice."
  };
}

function isPressed(button: HTMLElement): boolean {
  const pressed = button.getAttribute("aria-pressed");
  if (pressed !== null) return pressed === "true";
  const title = `${button.getAttribute("aria-label") ?? ""} ${button.getAttribute("title") ?? ""}`;
  return /turn off|disable|hide/i.test(title);
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function chooseYouTubeLanguage(preference: SitePreference): Promise<boolean> {
  const settings = document.querySelector<HTMLElement>(".ytp-settings-button");
  if (!settings || preference.languages.length === 0) return false;
  settings.click();
  await wait(120);

  const captionMenu = Array.from(document.querySelectorAll<HTMLElement>(".ytp-menuitem")).find((item) =>
    /subtitles|captions|cc/i.test(item.textContent ?? "")
  );
  if (!captionMenu) {
    settings.click();
    return false;
  }
  captionMenu.click();
  await wait(120);

  const preferredNames = preference.languages.flatMap((code) => {
    const option = LANGUAGE_OPTIONS.find(([value]) => languageMatches(value, code));
    return [code, option?.[1] ?? ""].filter(Boolean);
  });
  const languageItem = Array.from(document.querySelectorAll<HTMLElement>(".ytp-menuitem")).find((item) =>
    preferredNames.some((name) => (item.textContent ?? "").toLowerCase().includes(name.toLowerCase()))
  );
  if (!languageItem) {
    settings.click();
    return false;
  }
  languageItem.click();
  return true;
}

async function applyYouTube(preference: SitePreference): Promise<ApplyResult | null> {
  const button = document.querySelector<HTMLElement>(".ytp-subtitles-button");
  if (!button) return null;
  const shouldBeOn = preference.defaultState === "on";
  if (isPressed(button) !== shouldBeOn) button.click();

  if (!shouldBeOn) {
    return { kind: "applied", title: "Captions are off", detail: "Applied this site's saved caption choice." };
  }
  const languageChosen = await chooseYouTubeLanguage(preference);
  return {
    kind: "applied",
    title: "Captions are on",
    detail: languageChosen
      ? "Used the first preferred language available."
      : "This player kept its current caption language."
  };
}

export async function applyCaptionChoice(preference: SitePreference): Promise<ApplyResult> {
  if (!preference.enabled) {
    return { kind: "disabled", title: "Off on this site", detail: "Turn the site switch on to apply a caption choice." };
  }

  try {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
    for (const video of videos) {
      const result = applyNativeTracks(video, preference);
      if (result) return result;
    }

    const youtubeResult = await applyYouTube(preference);
    if (youtubeResult) return youtubeResult;

    if (videos.length > 0) {
      return {
        kind: "unsupported",
        title: "Player not supported",
        detail: "This video does not expose caption tracks or a supported caption control. Use the player's caption menu."
      };
    }
    return {
      kind: "unsupported",
      title: "No video found",
      detail: "Start a video, then apply your caption choice again."
    };
  } catch {
    return {
      kind: "error",
      title: "Caption choice was not applied",
      detail: "The player changed its controls. Use its caption menu for this video."
    };
  }
}

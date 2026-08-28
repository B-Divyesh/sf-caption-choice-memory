import { browser } from "wxt/browser";
import { applyCaptionChoice } from "../shared/player";
import { DEFAULT_PREFERENCE, preferenceKey, type SitePreference } from "../shared/preferences";

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  runAt: "document_idle",
  main() {
    const site = location.hostname;

    async function getPreference(): Promise<SitePreference> {
      const key = preferenceKey(site);
      const saved = await browser.storage.local.get(key);
      return (saved[key] as SitePreference | undefined) ?? DEFAULT_PREFERENCE(site);
    }

    async function apply() {
      const preference = await getPreference();
      return applyCaptionChoice(preference);
    }

    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === "APPLY_CAPTION_CHOICE") return apply();
      if (message?.type === "GET_CAPTION_STATUS") {
        return Promise.resolve({ hasVideo: Boolean(document.querySelector("video, .html5-video-player")) });
      }
      return undefined;
    });

    void getPreference().then((preference) => {
      if (preference.enabled && document.querySelector("video, .html5-video-player")) void applyCaptionChoice(preference);
    });
  }
});

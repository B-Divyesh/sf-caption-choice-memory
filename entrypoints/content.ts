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
      if (!preference.configured) {
        return { kind: "disabled", title: "No choice saved", detail: "Open the extension and save this site's caption choice." };
      }
      return applyCaptionChoice(preference);
    }

    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === "APPLY_CAPTION_CHOICE") return apply();
      if (message?.type === "GET_CAPTION_STATUS") {
        return Promise.resolve({ hasVideo: Boolean(document.querySelector("video, .html5-video-player")) });
      }
      return undefined;
    });

    let pendingApply: number | undefined;
    const scheduleApply = (delay = 180) => {
      window.clearTimeout(pendingApply);
      pendingApply = window.setTimeout(() => {
        void getPreference().then((preference) => {
          if (preference.configured && preference.enabled) void applyCaptionChoice(preference);
        });
      }, delay);
    };

    if (document.querySelector("video, .html5-video-player")) {
      scheduleApply(0);
      scheduleApply(1200);
    }

    document.addEventListener("loadedmetadata", () => scheduleApply(), true);
    const observer = new MutationObserver((mutations) => {
      const addedPlayer = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some((node) =>
          node instanceof Element && (node.matches("video, .html5-video-player") || Boolean(node.querySelector("video, .html5-video-player")))
        )
      );
      if (addedPlayer) scheduleApply();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
});

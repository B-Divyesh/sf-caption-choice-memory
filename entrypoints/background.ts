import { browser } from "wxt/browser";

export default defineBackground(() => {
  browser.commands.onCommand.addListener(async (command) => {
    if (command !== "apply-caption-choice") return;
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    await browser.tabs.sendMessage(tab.id, { type: "APPLY_CAPTION_CHOICE" }).catch(() => undefined);
  });
});

import { defineConfig } from "wxt";

export default defineConfig({
  outDir: ".output",
  srcDir: ".",
  manifest: {
    name: "Caption Choice Memory",
    short_name: "Caption Memory",
    description: "Keep each site's caption language and on/off choice one action away.",
    version: "1.0.0",
    permissions: ["storage", "activeTab", "tabs"],
    host_permissions: ["http://*/*", "https://*/*"],
    action: {
      default_title: "Caption Choice Memory"
    },
    options_ui: {
      page: "options.html",
      open_in_tab: true
    },
    commands: {
      "apply-caption-choice": {
        suggested_key: {
          default: "Alt+Shift+C",
          mac: "Command+Shift+C"
        },
        description: "Apply the saved caption choice on this site"
      }
    },
    icons: {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  }
});

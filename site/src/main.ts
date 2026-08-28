import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
const DEMO_KEY = "demo:caption-choice-memory:preference";
const BUILD_ID = "v1.0.0";
let demoKeyboardAbort: AbortController | undefined;

type Route = "/" | "/demo" | "/privacy" | "/terms" | "/404";
type DemoState = {
  enabled: boolean;
  policy: "on" | "off";
  primaryLanguage: "en" | "es" | "fr";
  secondLanguage: "en" | "es" | "fr";
  player: "supported" | "unsupported" | "empty";
};

const DEFAULT_DEMO: DemoState = {
  enabled: true,
  policy: "on",
  primaryLanguage: "en",
  secondLanguage: "es",
  player: "supported"
};

const TITLES: Record<Route, string> = {
  "/": "Caption Choice Memory — save caption choices",
  "/demo": "Demo — Caption Choice Memory",
  "/privacy": "Privacy — Caption Choice Memory",
  "/terms": "Terms — Caption Choice Memory",
  "/404": "Page not found — Caption Choice Memory"
};

function header(): string {
  return `
    <header class="site-header">
      <a class="wordmark" href="/" data-link aria-label="Caption Choice Memory home">
        <span class="wordmark-icon" aria-hidden="true">CC</span>
        <span>Caption Choice<br />Memory</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/demo" data-link>Demo</a>
        <a href="/#how-it-works" data-link>How it works</a>
        <a href="/privacy" data-link>Privacy</a>
      </nav>
    </header>`;
}

function footer(): string {
  return `
    <footer class="site-footer">
      <p>Keep each site's caption choice one action away.</p>
      <nav aria-label="Footer navigation">
        <a href="/privacy" data-link>Privacy</a>
        <a href="/terms" data-link>Terms</a>
        <a href="https://hello-factory.sociobot.in" rel="external">Built by Param Factory <span class="visually-hidden">(external site)</span></a>
      </nav>
      <p class="build-id">${BUILD_ID}</p>
    </footer>`;
}

function landing(): string {
  return `
    ${header()}
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <h1 id="hero-title" tabindex="-1">Keep caption choices one action away</h1>
          <p class="lede">For viewers who choose the same caption language and on/off setting across video sites.</p>
          <div class="action-row">
            <a class="button primary" href="/?demo=1" data-link>Try it with sample data</a>
            <p>Then apply English captions to a sample player.</p>
          </div>
          <ul class="plain-facts" aria-label="Product facts">
            <li>Caption choices stay in this browser.</li>
            <li>Caption choices work offline.</li>
            <li>Free. No account.</li>
          </ul>
        </div>
        <figure class="hero-art">
          <span class="figure-label">Saved caption choice</span>
          <picture>
            <source media="(max-width: 720px)" srcset="/assets/hero-control-board-768.webp" />
            <img src="/assets/hero-control-board.webp" width="1280" height="853" alt="A paper caption control board with one blue key and stacked choice cards." decoding="async" fetchpriority="high" />
          </picture>
          <figcaption>The extension remembers an ordered language list for each site.</figcaption>
        </figure>
      </section>

      <section class="product-preview" aria-labelledby="preview-heading">
        <div class="section-number" aria-hidden="true">01</div>
        <div class="preview-copy">
          <p class="kicker">The extension</p>
          <h2 id="preview-heading">Save a caption choice for each site</h2>
          <p>Choose whether captions start on or off, then save up to four languages for each site.</p>
          <a class="text-link" href="/demo" data-link>Open the working demo <span aria-hidden="true">→</span></a>
        </div>
        <div class="extension-card" aria-label="Preview of the extension controls">
          <div class="mini-site"><span class="status-square"></span><strong>watch.example</strong><span>ON</span></div>
          <p class="mini-label">When a video starts</p>
          <div class="mini-policy"><span>● Turn captions on</span><span>○ Keep captions off</span></div>
          <p class="mini-label">Preferred languages</p>
          <ol class="mini-languages"><li><span>1</span> English</li><li><span>2</span> Spanish</li></ol>
          <span class="button primary preview-button">Apply caption choice</span>
        </div>
      </section>

      <section id="how-it-works" class="steps" aria-labelledby="steps-heading">
        <h2 id="steps-heading">How it works</h2>
        <ol>
          <li><span class="step-number">1</span><div><h3>Open the extension</h3><p>It saves a caption choice for the current site.</p></div></li>
          <li><span class="step-number">2</span><div><h3>Rank preferred languages</h3><p>Pick captions on or off, then rank your languages.</p></div></li>
          <li><span class="step-number">3</span><div><h3>Apply the choice</h3><p>Saved choices apply when a supported video appears. Apply again with the button or shortcut.</p></div></li>
        </ol>
      </section>

      <section class="limits" aria-labelledby="limits-heading">
        <div>
          <p class="kicker">Clear limits</p>
          <h2 id="limits-heading">It works only with available caption controls</h2>
        </div>
        <ul>
          <li>Supported players: native HTML5 caption tracks and YouTube caption controls.</li>
          <li>Unsupported players get a clear notice.</li>
        </ul>
        <p>It uses captions that the player makes available. Caption choices stay in this browser.</p>
      </section>

      <section id="download" class="download" aria-labelledby="download-heading">
        <span class="memory-tab">Free · choices stay in Chrome</span>
        <div>
          <p class="kicker">Version 1.0</p>
          <h2 id="download-heading">Install the Chrome extension</h2>
          <p>Download the ZIP, unzip it, then choose Load unpacked in Chrome's extension settings.</p>
        </div>
        <a class="button primary inverse" href="/downloads/caption-choice-memory.zip" download>Download extension (.zip)</a>
      </section>
    </main>
    ${footer()}`;
}

function readDemo(): DemoState {
  try {
    return { ...DEFAULT_DEMO, ...JSON.parse(localStorage.getItem(DEMO_KEY) ?? "{}") };
  } catch {
    return { ...DEFAULT_DEMO };
  }
}

function demo(): string {
  const state = readDemo();
  return `
    <div class="demo-banner" role="status">
      <strong>Demo — sample data, nothing is saved</strong>
      <div><button type="button" id="reset-demo" class="text-button">Reset demo</button><a href="/#download" data-link id="start-real">Install the extension</a></div>
    </div>
    ${header()}
    <main id="main" class="demo-main">
      <section class="demo-intro">
        <p class="kicker">WatchRoom.example / sample</p>
        <h1 tabindex="-1">Apply your saved captions</h1>
      <p class="lede">Change the sample choice, then apply it to the player in one action.</p>
      </section>

      <section class="demo-workbench" aria-label="Caption choice demo">
        <div class="sample-player" data-player-state="${state.player}">
          <div class="player-top"><span>FIELD NOTES / EPISODE 04</span><span class="player-badge">SAMPLE VIDEO</span></div>
          <div class="player-scene" role="img" aria-label="Abstract sample video frame with a river and two hills">
            <span class="sun"></span><span class="hill hill-one"></span><span class="hill hill-two"></span><span class="river"></span>
            <p id="sample-caption" class="sample-caption">The tide turns before the rain.</p>
            <div id="empty-player" class="empty-player" hidden><strong>No video found</strong><span>Choose a player with a video.</span></div>
          </div>
          <div class="player-controls"><span class="play" aria-hidden="true">▶</span><span class="timeline"></span><span class="cc-chip">CC</span></div>
        </div>

        <form id="demo-form" class="demo-controls">
          <div class="control-heading"><span class="status-square"></span><div><p class="mini-label">Current site</p><h2>watchroom.example</h2></div></div>
          <label class="switch-row"><span><strong>Use on this site</strong><small>Visible per-site off switch</small></span><input id="demo-enabled" type="checkbox" role="switch" ${state.enabled ? "checked" : ""} /></label>
          <fieldset>
            <legend>When a video starts</legend>
            <label class="radio-row"><input type="radio" name="demo-policy" value="on" ${state.policy === "on" ? "checked" : ""} /> Turn captions on</label>
            <label class="radio-row"><input type="radio" name="demo-policy" value="off" ${state.policy === "off" ? "checked" : ""} /> Keep captions off</label>
          </fieldset>
          <fieldset>
            <legend>Preferred languages</legend>
            <label class="select-row"><span>1</span><select id="demo-language-one" aria-label="First preferred language">${languageOptions(state.primaryLanguage)}</select></label>
            <label class="select-row"><span>2</span><select id="demo-language-two" aria-label="Second preferred language">${languageOptions(state.secondLanguage)}</select></label>
          </fieldset>
          <label class="player-select">Sample player state<select id="demo-player">${playerOptions(state.player)}</select></label>
          <button class="button primary full" type="submit">Apply caption choice</button>
          <p class="shortcut-note"><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> applies the same choice.</p>
          <div id="demo-result" class="demo-result" role="status" aria-live="polite"><strong>English captions are on</strong><span>Sample caption choice loaded.</span></div>
        </form>
      </section>
    </main>
    ${footer()}`;
}

function languageOptions(selected: string): string {
  return [["en", "English"], ["es", "Spanish"], ["fr", "French"]]
    .map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`).join("");
}

function playerOptions(selected: string): string {
  return [["supported", "Supported player"], ["unsupported", "Player without exposed captions"], ["empty", "Page without a video"]]
    .map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`).join("");
}

function privacy(): string {
  return `
    ${header()}
    <main id="main" class="legal-page">
      <p class="kicker">Privacy / plain terms</p>
      <h1 tabindex="-1">Your caption choices stay in your browser</h1>
      <p class="lede">Caption Choice Memory has no account, analytics, ads, or remote database.</p>
      <section><h2>What the extension stores</h2><p>Chrome stores each site's name, on or off setting, and ordered language list on this device.</p></section>
      <section><h2>What the extension reads</h2><p>It reads the current site's name and available video caption controls.</p></section>
      <section><h2>What leaves your device</h2><p>No caption preference leaves your device.</p></section>
      <section><h2>Delete demo data</h2><p>Reset demo removes its sample data and restores the English-first sample.</p></section>
      <p class="legal-date">Effective 28 August 2026.</p>
    </main>
    ${footer()}`;
}

function terms(): string {
  return `
    ${header()}
    <main id="main" class="legal-page">
      <p class="kicker">Terms / version 1.0</p>
      <h1 tabindex="-1">Use the extension with supported players</h1>
      <p class="lede">Caption Choice Memory is available under the MIT License.</p>
      <section><h2>What it does</h2><p>The extension asks available caption controls to apply your saved caption choice. A player may change and stop responding.</p></section>
      <section><h2>Your responsibility</h2><p>Use the extension lawfully. Do not use it to bypass access controls or site rules.</p></section>
      <section><h2>No warranty</h2><p>The software is provided as is, without warranty. The full MIT License ships with the source.</p></section>
      <section><h2>Changes</h2><p>New versions may update these terms. The effective date will change when the terms change.</p></section>
      <p class="legal-date">Effective 28 August 2026.</p>
    </main>
    ${footer()}`;
}

function notFound(): string {
  return `
    ${header()}
    <main id="main" class="missing-page">
      <p class="kicker">404</p>
      <h1 tabindex="-1">Page not found</h1>
      <p>The address may be wrong. Return to the product page.</p>
      <a class="button primary" href="/" data-link>Return home</a>
    </main>
    ${footer()}`;
}

function currentRoute(): Route {
  if (location.search === "?demo=1") return "/demo";
  const path = location.pathname.replace(/\/$/, "") || "/";
  return (["/", "/demo", "/privacy", "/terms"] as Route[]).includes(path as Route) ? path as Route : "/404";
}

function updateMetadata(route: Route): void {
  document.title = TITLES[route];
  const canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
  if (canonical) canonical.href = `https://caption-choice-memory.sociobot.in${route === "/404" ? "/404" : route}`;
  const descriptions: Record<Route, string> = {
    "/": "Remember each site's caption language and on/off choice in Chrome.",
    "/demo": "Try Caption Choice Memory with isolated sample data.",
    "/privacy": "Read how Caption Choice Memory stores caption choices locally.",
    "/terms": "Read the terms for Caption Choice Memory.",
    "/404": "The requested Caption Choice Memory page was not found."
  };
  document.querySelector('meta[name="description"]')?.setAttribute("content", descriptions[route]);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", descriptions[route]);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", descriptions[route]);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", TITLES[route]);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", TITLES[route]);
}

function render(options: { focus?: boolean } = {}): void {
  demoKeyboardAbort?.abort();
  demoKeyboardAbort = undefined;
  const route = currentRoute();
  updateMetadata(route);
  app.innerHTML = route === "/" ? landing() : route === "/demo" ? demo() : route === "/privacy" ? privacy() : route === "/terms" ? terms() : notFound();
  bindLinks();
  if (route === "/demo") bindDemo();
  if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
  else scrollTo({ top: 0, behavior: "instant" });
  const heading = document.querySelector<HTMLElement>("h1");
  if (options.focus) heading?.focus();
  document.querySelector("#route-status")!.textContent = heading?.textContent ?? "Page loaded";
}

function bindLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>("a[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      event.preventDefault();
      history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      render({ focus: !url.hash });
    });
  });
}

function bindDemo(): void {
  const form = document.querySelector<HTMLFormElement>("#demo-form")!;
  const reset = document.querySelector<HTMLButtonElement>("#reset-demo")!;
  const startReal = document.querySelector<HTMLAnchorElement>("#start-real")!;
  const playerSelect = document.querySelector<HTMLSelectElement>("#demo-player")!;
  const samplePlayer = document.querySelector<HTMLElement>(".sample-player")!;
  const emptyPlayer = document.querySelector<HTMLElement>("#empty-player")!;

  const updatePlayerPreview = () => {
    samplePlayer.dataset.playerState = playerSelect.value;
    emptyPlayer.hidden = playerSelect.value !== "empty";
  };
  playerSelect.addEventListener("change", updatePlayerPreview);
  updatePlayerPreview();

  const apply = (persist = true, automatic = false) => {
    const enabled = document.querySelector<HTMLInputElement>("#demo-enabled")!.checked;
    const policy = document.querySelector<HTMLInputElement>("input[name='demo-policy']:checked")!.value as "on" | "off";
    const primaryLanguage = document.querySelector<HTMLSelectElement>("#demo-language-one")!.value as DemoState["primaryLanguage"];
    const secondLanguage = document.querySelector<HTMLSelectElement>("#demo-language-two")!.value as DemoState["secondLanguage"];
    const player = playerSelect.value as DemoState["player"];
    const state: DemoState = { enabled, policy, primaryLanguage, secondLanguage, player };
    if (persist) localStorage.setItem(DEMO_KEY, JSON.stringify(state));

    const caption = document.querySelector<HTMLElement>("#sample-caption")!;
    const result = document.querySelector<HTMLElement>("#demo-result")!;
    const title = result.querySelector("strong")!;
    const detail = result.querySelector("span")!;
    result.dataset.kind = "applied";
    if (!enabled) {
      caption.hidden = true;
      title.textContent = "Off on this site";
      detail.textContent = "Turn the site switch on to apply a caption choice.";
    } else if (player === "empty") {
      caption.hidden = true;
      result.dataset.kind = "unsupported";
      title.textContent = "No video found";
      detail.textContent = "Choose a player with a video, then apply the choice again.";
    } else if (player === "unsupported") {
      caption.hidden = true;
      result.dataset.kind = "unsupported";
      title.textContent = "Player not supported";
      detail.textContent = "Use this player's caption menu for the sample video.";
    } else if (policy === "off") {
      caption.hidden = true;
      title.textContent = "Captions are off";
      detail.textContent = automatic ? "Saved choice applied when this sample video appeared." : "Applied this site's saved caption choice.";
    } else {
      const captions = { en: "The tide turns before the rain.", es: "La marea cambia antes de la lluvia.", fr: "La marée tourne avant la pluie." };
      const names = { en: "English", es: "Spanish", fr: "French" };
      caption.textContent = captions[primaryLanguage];
      caption.hidden = false;
      title.textContent = `${names[primaryLanguage]} captions are on`;
      detail.textContent = "Applied this site's saved caption choice.";
    }
  };

  form.addEventListener("submit", (event) => { event.preventDefault(); apply(); });
  demoKeyboardAbort = new AbortController();
  document.addEventListener("keydown", demoShortcut, { signal: demoKeyboardAbort.signal });
  function demoShortcut(event: KeyboardEvent) {
    if (event.altKey && event.shiftKey && event.code === "KeyC") {
      event.preventDefault();
      apply();
    }
  }
  reset.addEventListener("click", () => { localStorage.removeItem(DEMO_KEY); render({ focus: true }); });
  startReal.addEventListener("click", () => localStorage.removeItem(DEMO_KEY));
  if (localStorage.getItem(DEMO_KEY)) apply(false, true);
}

window.addEventListener("popstate", () => render({ focus: true }));
render();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/service-worker.js"));
}

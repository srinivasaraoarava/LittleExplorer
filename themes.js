// Profile themes — original palettes inspired by kids' favourite worlds
(function () {
  const THEMES = [
    {
      id: "explorer",
      name: "Explorer",
      emoji: "🌍",
      dark: false,
      sprites: ["🌟", "🎈", "🦋", "🌈", "🚀", "🐢", "✨", "🪐"],
      bgFrom: "#fff9ee",
      bgTo: "#fff2f8",
      blob1: "#ffd0a3",
      blob2: "#ffc1e1",
      blob3: "#bde3ff",
      blob4: "#cff5c2",
      accent: "#ff8a3d",
      accent2: "#7c3aed"
    },
    {
      id: "bluey",
      name: "Bluey",
      emoji: "🐾",
      dark: false,
      sprites: ["🐾", "💛", "🦴", "🏡", "🐕", "💙", "✨", "🌈"],
      bgFrom: "#6ec8ea",
      bgTo: "#f7e08a",
      blob1: "#8ed4f0",
      blob2: "#f4c56a",
      blob3: "#f0b090",
      blob4: "#fff4cc",
      accent: "#2b7eb8",
      accent2: "#e8b84a"
    },
    {
      id: "peppa",
      name: "Peppa Pig",
      emoji: "🐷",
      dark: false,
      sprites: ["🐷", "💧", "🌳", "☀️", "🦋", "🌸", "🏡", "🌈"],
      bgFrom: "#f7a8c0",
      bgTo: "#8ed4c8",
      blob1: "#ffc2d4",
      blob2: "#9fe0d6",
      blob3: "#ffe08a",
      blob4: "#c9e8a8",
      accent: "#e86a92",
      accent2: "#3cb8a8"
    },
    {
      id: "elsa",
      name: "Elsa",
      emoji: "❄️",
      dark: false,
      sprites: ["❄️", "✨", "💎", "🌨️", "👑", "💙", "🌟", "🧊"],
      bgFrom: "#c5e8fb",
      bgTo: "#e8d9fb",
      blob1: "#d8f0ff",
      blob2: "#c9c4f5",
      blob3: "#f4fbff",
      blob4: "#b8e0f5",
      accent: "#5b9fd4",
      accent2: "#9b7ed9"
    },
    {
      id: "cinderella",
      name: "Cinderella",
      emoji: "👠",
      dark: false,
      sprites: ["👠", "✨", "🎃", "🐭", "👑", "💙", "🌟", "🕊️"],
      bgFrom: "#9bc4ea",
      bgTo: "#f3e4b0",
      blob1: "#b7d6f5",
      blob2: "#f5e6b8",
      blob3: "#dce8f8",
      blob4: "#c9b8e8",
      accent: "#4a7ab8",
      accent2: "#d4b45a"
    },
    {
      id: "rapunzel",
      name: "Rapunzel",
      emoji: "🌸",
      dark: false,
      sprites: ["🌸", "💜", "☀️", "🎨", "🦎", "✨", "🏰", "🌼"],
      bgFrom: "#d9b3f0",
      bgTo: "#f6d56a",
      blob1: "#e4c4f5",
      blob2: "#f8dc7a",
      blob3: "#f5b8d0",
      blob4: "#c9a0e8",
      accent: "#9b59c9",
      accent2: "#e0b000"
    },
    {
      id: "ariel",
      name: "Ariel",
      emoji: "🧜‍♀️",
      dark: true,
      sprites: ["🧜‍♀️", "🐚", "🐠", "🌊", "⭐", "🪸", "🫧", "🦀"],
      bgFrom: "#14b8a6",
      bgTo: "#fb7185",
      blob1: "#5eead4",
      blob2: "#fda4af",
      blob3: "#7dd3fc",
      blob4: "#fde68a",
      accent: "#0f766e",
      accent2: "#e11d48"
    },
    {
      id: "toystory",
      name: "Toy Story",
      emoji: "🤠",
      dark: false,
      sprites: ["🤠", "🚀", "🧸", "⭐", "🦖", "☁️", "🎯", "🟣"],
      bgFrom: "#5dade2",
      bgTo: "#f4d03f",
      blob1: "#85c1e9",
      blob2: "#f7dc6f",
      blob3: "#c39bd3",
      blob4: "#f5cba7",
      accent: "#2471a3",
      accent2: "#af7ac5"
    },
    {
      id: "paws",
      name: "Paws",
      emoji: "🐾",
      dark: true,
      sprites: ["🐾", "🦴", "🚓", "⭐", "🚒", "🧢", "🐕", "💛"],
      bgFrom: "#3b82f6",
      bgTo: "#ef4444",
      blob1: "#93c5fd",
      blob2: "#fca5a5",
      blob3: "#fde047",
      blob4: "#67e8f9",
      accent: "#1d4ed8",
      accent2: "#dc2626"
    },
    {
      id: "hulk",
      name: "Hulk",
      emoji: "💪",
      dark: true,
      sprites: ["💪", "💚", "👊", "⚡", "🧪", "🟣", "💥", "🌿"],
      bgFrom: "#145a32",
      bgTo: "#6c3483",
      blob1: "#1e8449",
      blob2: "#7d3c98",
      blob3: "#52be80",
      blob4: "#5b2c6f",
      accent: "#2ecc71",
      accent2: "#af7ac5"
    },
    {
      id: "spiderman",
      name: "Spider-Man",
      emoji: "🕷️",
      dark: true,
      sprites: ["🕷️", "🕸️", "🏙️", "❤️", "💙", "⭐", "💥", "🦸"],
      bgFrom: "#b91c1c",
      bgTo: "#1e3a8a",
      blob1: "#ef4444",
      blob2: "#1d4ed8",
      blob3: "#0f172a",
      blob4: "#f87171",
      accent: "#facc15",
      accent2: "#60a5fa"
    },
    {
      id: "ironman",
      name: "Iron Man",
      emoji: "🤖",
      dark: true,
      sprites: ["🤖", "💛", "❤️", "⚡", "🛡️", "✨", "🚀", "🔧"],
      bgFrom: "#9b1c1c",
      bgTo: "#b45309",
      blob1: "#dc2626",
      blob2: "#fbbf24",
      blob3: "#38bdf8",
      blob4: "#7f1d1d",
      accent: "#f59e0b",
      accent2: "#38bdf8"
    },
    {
      id: "aviation",
      name: "Aviation",
      emoji: "✈️",
      dark: false,
      sprites: ["✈️", "☁️", "🛫", "🌤️", "🗺️", "⭐", "🧳", "🛰️"],
      bgFrom: "#7dd3fc",
      bgTo: "#fde68a",
      blob1: "#bae6fd",
      blob2: "#fef3c7",
      blob3: "#e2e8f0",
      blob4: "#fdba74",
      accent: "#0369a1",
      accent2: "#d97706"
    },
    {
      id: "construction",
      name: "Construction",
      emoji: "🚧",
      dark: false,
      sprites: ["🚧", "🚜", "🧱", "🔨", "🦺", "⚠️", "🏗️", "🚚"],
      bgFrom: "#facc15",
      bgTo: "#f97316",
      blob1: "#fde047",
      blob2: "#fdba74",
      blob3: "#94a3b8",
      blob4: "#fef3c7",
      accent: "#b45309",
      accent2: "#334155"
    },
    {
      id: "nature",
      name: "Nature",
      emoji: "🌿",
      dark: true,
      sprites: ["🌿", "🌸", "🦋", "🌳", "🍃", "🐞", "☀️", "🦉"],
      bgFrom: "#16a34a",
      bgTo: "#67e8f9",
      blob1: "#86efac",
      blob2: "#67e8f9",
      blob3: "#fde68a",
      blob4: "#bbf7d0",
      accent: "#15803d",
      accent2: "#0891b2"
    },
    {
      id: "autumn",
      name: "Autumn",
      emoji: "🍂",
      dark: true,
      sprites: ["🍂", "🍁", "🎃", "🌰", "🍄", "🦊", "🍎", "✨"],
      bgFrom: "#ea580c",
      bgTo: "#92400e",
      blob1: "#fdba74",
      blob2: "#f87171",
      blob3: "#fde68a",
      blob4: "#b45309",
      accent: "#c2410c",
      accent2: "#b45309"
    }
  ];

  const BY_ID = {};
  THEMES.forEach(t => { BY_ID[t.id] = t; });

  function themeById(id) {
    return BY_ID[id] || BY_ID.explorer;
  }

  function captureSprites() {
    document.querySelectorAll(".float-sprites .sprite").forEach(el => {
      if (el.dataset.orig == null) el.dataset.orig = el.textContent;
    });
  }

  function applySprites(list) {
    captureSprites();
    document.querySelectorAll(".float-sprites .sprite").forEach((el, i) => {
      el.textContent = list && list.length ? list[i % list.length] : el.dataset.orig;
    });
  }

  function setVar(name, value) {
    if (value) document.documentElement.style.setProperty(name, value);
    else document.documentElement.style.removeProperty(name);
  }

  function applyTheme(id) {
    const theme = themeById(id || "explorer");
    const root = document.documentElement;
    if (!id || id === "explorer") {
      root.removeAttribute("data-lew-theme");
      root.classList.remove("lew-theme-dark");
      ["--theme-bg-from", "--theme-bg-to", "--theme-blob-1", "--theme-blob-2",
        "--theme-blob-3", "--theme-blob-4", "--theme-accent", "--theme-accent-2"
      ].forEach(n => root.style.removeProperty(n));
      applySprites(null);
      const logo = document.querySelector(".logo-inner");
      if (logo && logo.dataset.origEmoji) logo.textContent = logo.dataset.origEmoji;
      return theme;
    }
    root.setAttribute("data-lew-theme", theme.id);
    root.classList.toggle("lew-theme-dark", !!theme.dark);
    setVar("--theme-bg-from", theme.bgFrom);
    setVar("--theme-bg-to", theme.bgTo);
    setVar("--theme-blob-1", theme.blob1);
    setVar("--theme-blob-2", theme.blob2);
    setVar("--theme-blob-3", theme.blob3);
    setVar("--theme-blob-4", theme.blob4);
    setVar("--theme-accent", theme.accent);
    setVar("--theme-accent-2", theme.accent2);
    applySprites(theme.sprites);
    const logo = document.querySelector(".logo-inner");
    if (logo) {
      if (!logo.dataset.origEmoji) logo.dataset.origEmoji = logo.textContent;
      logo.textContent = theme.emoji;
    }
    return theme;
  }

  function currentId() {
    return (window.LEW && LEW.getThemeId && LEW.getThemeId()) || "explorer";
  }

  function choose(id) {
    const next = themeById(id).id;
    if (window.LEW && LEW.setThemeId) LEW.setThemeId(next);
    applyTheme(next);
    highlightPicker(next);
    return next;
  }

  function swatchHtml(t, selectedId) {
    const sel = t.id === selectedId ? " selected" : "";
    return `<button type="button" class="theme-swatch${sel}" data-theme="${t.id}" aria-pressed="${t.id === selectedId ? "true" : "false"}">
      <span class="theme-swatch-preview" style="background:linear-gradient(135deg,${t.bgFrom},${t.bgTo})"></span>
      <span class="theme-swatch-emoji">${t.emoji}</span>
      <span class="theme-swatch-name">${t.name}</span>
    </button>`;
  }

  function highlightPicker(id) {
    document.querySelectorAll(".theme-swatch").forEach(btn => {
      const on = btn.getAttribute("data-theme") === id;
      btn.classList.toggle("selected", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function bindGrid(root, opts) {
    opts = opts || {};
    root.querySelectorAll(".theme-swatch").forEach(btn => {
      btn.addEventListener("click", () => {
        choose(btn.getAttribute("data-theme"));
        if (opts.onChoose) opts.onChoose(btn.getAttribute("data-theme"));
      });
    });
  }

  function renderGrid(selectedId) {
    return `<div class="theme-grid">${THEMES.map(t => swatchHtml(t, selectedId)).join("")}</div>`;
  }

  function ensurePicker() {
    if (document.getElementById("themeOverlay")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="theme-overlay" id="themeOverlay" role="dialog" aria-modal="true" aria-labelledby="themePickerTitle">
        <div class="theme-card">
          <button type="button" class="theme-close" id="themeClose" aria-label="Close">✕</button>
          <div class="theme-kicker">Profile</div>
          <h2 id="themePickerTitle">Pick a theme</h2>
          <p class="theme-hint">Your world changes colours to match. You can switch anytime.</p>
          <div id="themeGridWrap"></div>
        </div>
      </div>
    `);
    document.getElementById("themeClose").addEventListener("click", closePicker);
    document.getElementById("themeOverlay").addEventListener("click", (e) => {
      if (e.target.id === "themeOverlay") closePicker();
    });
  }

  function openPicker() {
    ensurePicker();
    const id = currentId();
    const wrap = document.getElementById("themeGridWrap");
    wrap.innerHTML = renderGrid(id);
    bindGrid(wrap, { onChoose() {} });
    document.getElementById("themeOverlay").classList.add("open");
  }

  function closePicker() {
    const ov = document.getElementById("themeOverlay");
    if (ov) ov.classList.remove("open");
  }

  function mountInline(el, opts) {
    if (!el) return;
    const id = (opts && opts.selected) || currentId();
    el.innerHTML = renderGrid(id);
    bindGrid(el, opts);
  }

  window.LEW = window.LEW || {};
  window.LEW.THEMES = THEMES;
  window.LEW.applyTheme = applyTheme;
  window.LEW.openThemePicker = openPicker;
  window.LEW.closeThemePicker = closePicker;
  window.LEW.mountThemeGrid = mountInline;
  window.LEW.themeById = themeById;

  function boot() {
    applyTheme(currentId());
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

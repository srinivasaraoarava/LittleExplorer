// PlayVerse mini puzzle games
(function () {
  const PLAYS_FOR_STAR = { slide: 1, memory: 5, odd: 10, mix: 10 };
  const hub = document.getElementById("puzzleHub");
  const view = document.getElementById("puzzleView");
  const studio = document.getElementById("drawStudio");
  const hero = document.querySelector(".playverse-hero");
  const titleEl = document.getElementById("puzzleTitle");
  const statusEl = document.getElementById("puzzleStatus");
  const stage = document.getElementById("puzzleStage");
  const againBtn = document.getElementById("puzzleAgain");
  if (!hub || !view || !stage) return;

  const TITLES = {
    memory: "Memory Match",
    slide: "Slide Puzzle",
    odd: "Odd One Out",
    mix: "Word Mix"
  };

  let current = null;
  let restart = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function loadState() {
    const u = window.LEW && LEW.getCurrentUser && LEW.getCurrentUser();
    const p = (u && u.profile) || {};
    return {
      plays: Object.assign({ memory: 0, slide: 0, odd: 0, mix: 0 }, p.puzzlePlays || {}),
      recent: Object.assign({ memory: [], slide: [], odd: [], mix: [] }, p.puzzleRecent || {}),
      mixSeed: p.puzzleMixSeed || 0,
      mixIndex: p.puzzleMixIndex || 0
    };
  }

  function saveState(state) {
    if (window.LEW && LEW.saveProfile) {
      LEW.saveProfile({
        puzzlePlays: state.plays,
        puzzleRecent: state.recent,
        puzzleMixSeed: state.mixSeed,
        puzzleMixIndex: state.mixIndex
      });
    }
  }

  function remember(game, key, keep) {
    const state = loadState();
    const list = (state.recent[game] || []).filter(k => k !== key);
    list.push(key);
    state.recent[game] = list.slice(-(keep || 12));
    saveState(state);
  }

  function pickFresh(pool, recent, keyFn) {
    const used = new Set(recent || []);
    let choices = pool.filter(item => !used.has(keyFn(item)));
    if (!choices.length) {
      const last = recent && recent.length ? recent[recent.length - 1] : null;
      choices = pool.filter(item => keyFn(item) !== last);
      if (!choices.length) choices = pool.slice();
    }
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function playsTowardStar(game) {
    const need = PLAYS_FOR_STAR[game];
    if (!need) return { n: 0, need: 0, done: 0, left: 0 };
    const n = loadState().plays[game] || 0;
    const done = n % need;
    const left = done === 0 && n > 0 ? need : need - done;
    return { n, need, done, left };
  }

  function refreshTileSubs() {
    hub.querySelectorAll("[data-puzzle]").forEach(btn => {
      const id = btn.dataset.puzzle;
      const sub = btn.querySelector(".tile-sub");
      if (!sub) return;
      const p = playsTowardStar(id);
      if (id === "slide") sub.textContent = "1 play = 1 ⭐";
      else if (p.need) sub.textContent = `${p.done} / ${p.need} plays to a ⭐`;
    });
  }

  function setStatus(text) {
    statusEl.textContent = text || "";
  }

  function showAgain(show) {
    againBtn.style.display = show ? "inline-block" : "none";
  }

  function celebrateStar(total) {
    const overlay = document.createElement("div");
    overlay.className = "star-award-overlay";
    overlay.innerHTML = `
      <div class="star-award-card">
        <div class="star-award-star">⭐</div>
        <div class="star-award-title">Puzzle star!</div>
        <div class="star-award-sub">You earned a ⭐ · Total stars: <b>${total || "★"}</b></div>
        <button class="star-award-btn">Awesome!</button>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));
    const close = () => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 350);
    };
    overlay.querySelector(".star-award-btn").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    if (typeof window.launchConfetti === "function") window.launchConfetti();
  }

  function recordPlay(game, label) {
    const need = PLAYS_FOR_STAR[game];
    if (!need) return "";
    const state = loadState();
    state.plays[game] = (state.plays[game] || 0) + 1;
    saveState(state);
    refreshTileSubs();
    const n = state.plays[game];
    if (n % need === 0) {
      const total = (window.LEW && LEW.awardStar)
        ? LEW.awardStar({ subject: "playverse", label: label || TITLES[game] || "Puzzle" })
        : 0;
      if (typeof LEW.refreshRewardBadge === "function") LEW.refreshRewardBadge();
      const boxTriggered = (typeof LEW.maybeAwardMysteryBox === "function")
        ? LEW.maybeAwardMysteryBox(total) : false;
      if (!boxTriggered) celebrateStar(total);
      return "You earned a ⭐!";
    }
    const left = need - (n % need);
    return `${left} more play${left === 1 ? "" : "s"} until a ⭐`;
  }

  function openHub() {
    current = null;
    view.style.display = "none";
    hub.style.display = "";
    if (studio) studio.style.display = "";
    if (hero) hero.style.display = "";
    stage.innerHTML = "";
    showAgain(false);
    refreshTileSubs();
  }

  function openGame(id) {
    current = id;
    hub.style.display = "none";
    if (studio) studio.style.display = "none";
    if (hero) hero.style.display = "none";
    view.style.display = "";
    titleEl.textContent = TITLES[id] || "Puzzle";
    showAgain(false);
    start(id);
  }

  function start(id) {
    if (id === "memory") startMemory();
    else if (id === "slide") startSlide();
    else if (id === "odd") startOdd();
    else if (id === "mix") startMix();
  }

  const MEMORY_SETS = [
    { id: "pets", faces: ["🐶", "🐱", "🦊", "🐸", "🐵", "🐼"] },
    { id: "fruit", faces: ["🍎", "🍌", "🍇", "🍓", "🍑", "🍉"] },
    { id: "sky", faces: ["⭐", "🌙", "☀️", "🌈", "❄️", "⚡"] },
    { id: "sea", faces: ["🐠", "🐙", "🦀", "🐬", "🐳", "🐚"] },
    { id: "bugs", faces: ["🦋", "🐝", "🐞", "🐛", "🦗", "🪲"] },
    { id: "food", faces: ["🍕", "🍩", "🍪", "🧁", "🍦", "🥨"] },
    { id: "play", faces: ["⚽", "🏀", "🎾", "🪀", "🪁", "🎯"] },
    { id: "ride", faces: ["🚗", "✈️", "🚂", "🚲", "🚀", "⛵"] },
    { id: "plant", faces: ["🌸", "🌻", "🌳", "🌵", "🍄", "🍀"] },
    { id: "home", faces: ["🏠", "🎈", "🎁", "📚", "🧸", "⏰"] }
  ];

  function startMemory() {
    const recent = loadState().recent.memory || [];
    const set = pickFresh(MEMORY_SETS, recent, s => s.id);
    remember("memory", set.id, MEMORY_SETS.length - 1);
    const deck = shuffle(set.faces.concat(set.faces)).map((face, i) => ({
      id: i, face, open: false, matched: false
    }));
    let first = null;
    let lock = false;
    let matches = 0;
    setStatus("Find all 6 pairs!  ·  " + playsTowardStar("memory").left + " plays to a ⭐");
    function render() {
      stage.innerHTML = `<div class="mem-grid">${deck.map((c, i) =>
        `<button type="button" class="mem-card${c.open || c.matched ? " open" : ""}${c.matched ? " matched" : ""}" data-i="${i}">${c.open || c.matched ? c.face : "❓"}</button>`
      ).join("")}</div>`;
      stage.querySelectorAll(".mem-card").forEach(btn => {
        btn.addEventListener("click", () => flip(+btn.dataset.i));
      });
    }
    function flip(i) {
      const card = deck[i];
      if (lock || card.open || card.matched) return;
      card.open = true;
      render();
      if (first == null) { first = i; return; }
      if (deck[first].face === card.face) {
        deck[first].matched = true;
        card.matched = true;
        first = null;
        matches += 1;
        setStatus(`${matches} / 6 pairs`);
        render();
        if (matches === 6) {
          showAgain(true);
          setStatus("You found them all!  ·  " + recordPlay("memory", "Memory Match"));
        }
      } else {
        lock = true;
        setTimeout(() => {
          deck[first].open = false;
          card.open = false;
          first = null;
          lock = false;
          render();
        }, 700);
      }
    }
    restart = startMemory;
    render();
  }

  const SLIDE_SETS = [
    { id: "num", faces: ["1", "2", "3", "4", "5", "6", "7", "8"] },
    { id: "fruit", faces: ["🍎", "🍋", "🍇", "🍓", "🍑", "🍉", "🥝", "🍒"] },
    { id: "pets", faces: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"] },
    { id: "sea", faces: ["🐠", "🐙", "🦀", "🐬", "🐳", "🦈", "🐚", "⭐"] },
    { id: "sky", faces: ["☀️", "🌙", "⭐", "🌈", "☁️", "❄️", "⚡", "🌍"] },
    { id: "play", faces: ["⚽", "🏀", "🎾", "🏐", "🏈", "🏓", "🎯", "🪀"] },
    { id: "food", faces: ["🍕", "🍔", "🌮", "🍩", "🍪", "🧁", "🍦", "🥨"] },
    { id: "ride", faces: ["🚗", "🚕", "🚌", "🚂", "✈️", "🚀", "🚲", "⛵"] }
  ];

  function startSlide() {
    function inversions(arr) {
      let n = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) continue;
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[j] && arr[j] < arr[i]) n++;
        }
      }
      return n;
    }
    const recent = loadState().recent.slide || [];
    const set = pickFresh(SLIDE_SETS, recent, s => s.id);
    remember("slide", set.id, SLIDE_SETS.length - 1);
    let order = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    do {
      order = shuffle(order);
    } while (inversions(order) % 2 !== 0 || order.join("") === "123456780");
    const tiles = order.slice();
    setStatus("Finish this puzzle for a ⭐");
    function face(n) { return n ? set.faces[n - 1] : ""; }
    function neighborsOfEmpty() {
      const z = tiles.indexOf(0);
      const zr = Math.floor(z / 3), zc = z % 3;
      const next = [];
      [[zr - 1, zc], [zr + 1, zc], [zr, zc - 1], [zr, zc + 1]].forEach(([r, c]) => {
        if (r >= 0 && r < 3 && c >= 0 && c < 3) next.push(r * 3 + c);
      });
      return next;
    }
    function goalHtml() {
      const cells = [1, 2, 3, 4, 5, 6, 7, 8, 0].map(n =>
        `<div class="slide-goal-cell${n === 0 ? " empty" : ""}">${n ? face(n) : ""}</div>`
      ).join("");
      return `<div class="slide-goal-label">Finished picture</div>
        <div class="slide-goal-grid">${cells}</div>`;
    }
    function render() {
      const movable = new Set(neighborsOfEmpty());
      stage.innerHTML = `
        <div class="slide-how">
          How to play:
          <ol>
            <li>Look at the small finished picture.</li>
            <li>The white square is a hole.</li>
            <li>Tap a tile beside the hole — it slides in.</li>
            <li>Keep sliding until your board matches the small picture.</li>
          </ol>
        </div>
        ${goalHtml()}
        <div class="slide-play-wrap">
          <div class="slide-grid">${tiles.map((n, i) =>
            `<button type="button" class="slide-tile${n === 0 ? " empty" : ""}${movable.has(i) ? " can-move" : ""}" data-i="${i}">${n ? `${face(n)}<small>${n}</small>` : ""}</button>`
          ).join("")}</div>
        </div>`;
      stage.querySelectorAll(".slide-tile").forEach(btn => {
        btn.addEventListener("click", () => move(+btn.dataset.i));
      });
    }
    function move(i) {
      const z = tiles.indexOf(0);
      const r = Math.floor(i / 3), c = i % 3, zr = Math.floor(z / 3), zc = z % 3;
      if (Math.abs(r - zr) + Math.abs(c - zc) !== 1) return;
      [tiles[i], tiles[z]] = [tiles[z], tiles[i]];
      render();
      if (tiles.join("") === "123456780") {
        showAgain(true);
        setStatus("Nice sliding — all in order!  ·  " + (recordPlay("slide", "Slide Puzzle") || "Great job!"));
      }
    }
    restart = startSlide;
    render();
  }

  const ODD = [
    { id: "fruit", opts: ["🍎", "🍌", "🍇", "🚗"], odd: 3, hint: "Which is not a fruit?" },
    { id: "animal", opts: ["🐶", "🐱", "🦁", "🌳"], odd: 3, hint: "Which is not an animal?" },
    { id: "sky", opts: ["⭐", "🌙", "☀️", "🍕"], odd: 3, hint: "Which is not in the sky?" },
    { id: "clothes", opts: ["👟", "🧦", "🎩", "🐟"], odd: 3, hint: "Which is not clothes?" },
    { id: "music", opts: ["🎸", "🥁", "🎹", "🧁"], odd: 3, hint: "Which is not music?" },
    { id: "vroom", opts: ["✈️", "🚗", "🚂", "🍎"], odd: 3, hint: "Which cannot go vroom?" },
    { id: "book", opts: ["📘", "📗", "📙", "🐸"], odd: 3, hint: "Which is not a book?" },
    { id: "ball", opts: ["⚽", "🏀", "🎾", "🌸"], odd: 3, hint: "Which is not a ball?" },
    { id: "sea", opts: ["🐠", "🐙", "🦀", "🚲"], odd: 3, hint: "Which does not live in water?" },
    { id: "sweet", opts: ["🍩", "🍪", "🧁", "🥕"], odd: 3, hint: "Which is not a treat?" },
    { id: "bug", opts: ["🦋", "🐝", "🐞", "🐘"], odd: 3, hint: "Which is not a little bug?" },
    { id: "plant", opts: ["🌸", "🌻", "🌵", "🚀"], odd: 3, hint: "Which is not a plant?" },
    { id: "weather", opts: ["🌧️", "❄️", "⛅", "🧸"], odd: 3, hint: "Which is not weather?" },
    { id: "night", opts: ["🌙", "⭐", "🦉", "☀️"], odd: 3, hint: "Which does not belong at night?" },
    { id: "drink", opts: ["🥛", "🧃", "☕", "🧱"], odd: 3, hint: "Which can you not drink?" },
    { id: "shape", opts: ["🔴", "🔵", "🟢", "🦊"], odd: 3, hint: "Which is not a colour dot?" }
  ];

  function startOdd() {
    const recent = loadState().recent.odd || [];
    const unused = ODD.filter(q => !recent.includes(q.id));
    const pool = unused.length >= 5 ? unused : ODD.filter(q => q.id !== recent[recent.length - 1]);
    const round = shuffle(pool).slice(0, 5);
    round.forEach(q => remember("odd", q.id, 12));
    let i = 0;
    let score = 0;
    let locked = false;
    function show() {
      locked = false;
      const q = round[i];
      setStatus(`${q.hint}  ·  ${i + 1} / 5`);
      stage.innerHTML = `<div class="odd-row">${q.opts.map((o, idx) =>
        `<button type="button" class="odd-choice" data-i="${idx}">${o}</button>`
      ).join("")}</div>`;
      stage.querySelectorAll(".odd-choice").forEach(btn => {
        btn.addEventListener("click", () => pick(+btn.dataset.i, q, btn));
      });
    }
    function pick(idx, q, btn) {
      if (locked) return;
      locked = true;
      const buttons = [...stage.querySelectorAll(".odd-choice")];
      if (idx === q.odd) {
        btn.classList.add("right");
        score += 1;
      } else {
        btn.classList.add("wrong");
        buttons[q.odd].classList.add("right");
      }
      setTimeout(() => {
        i += 1;
        if (i >= round.length) {
          showAgain(true);
          const starNote = recordPlay("odd", "Odd One Out");
          setStatus(`You got ${score} / 5.  ·  ${starNote}`);
        } else show();
      }, 700);
    }
    restart = startOdd;
    show();
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function orderForSeed(seed, n) {
    const rng = mulberry32((seed >>> 0) || 1);
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function nextMixWord() {
    const bank = ((window.LEW && LEW.WORD_MIX_BANK) || []).filter(w => {
      const s = String(w || "");
      return s.length >= 3 && s.length <= 6;
    });
    const n = bank.length;
    if (!n) return { word: "STAR", pos: 1, total: 1 };
    const state = loadState();
    if (!state.mixSeed) {
      state.mixSeed = (Date.now() % 2147483646) + 1;
      state.mixIndex = 0;
    }
    let order = orderForSeed(state.mixSeed, n);
    if (state.mixIndex >= n) {
      const last = order[n - 1];
      state.mixSeed = ((state.mixSeed + 7919) % 2147483646) || 1;
      order = orderForSeed(state.mixSeed, n);
      if (n > 1 && order[0] === last) {
        const t = order[0];
        order[0] = order[1];
        order[1] = t;
      }
      state.mixIndex = 0;
    }
    const pos = state.mixIndex;
    const word = bank[order[pos]];
    state.mixIndex = pos + 1;
    saveState(state);
    return { word, pos: pos + 1, total: n };
  }

  function startMix() {
    const pick = nextMixWord();
    const word = pick.word;
    let letters = shuffle(word.split(""));
    while (letters.join("") === word) letters = shuffle(word.split(""));
    let built = "";
    const used = [];
    let won = false;
    let missed = false;
    const countLabel = `Word ${pick.pos.toLocaleString()} of ${pick.total.toLocaleString()}`;
    const help = `${countLabel} — tap letters to spell it.  ·  ${playsTowardStar("mix").left} plays to a ⭐`;
    setStatus(help);
    showAgain(false);
    function render() {
      stage.innerHTML = `<div class="mix-count">${countLabel}</div>
        <div class="mix-answer${missed ? " wrong" : ""}">${built || "—"}</div>
        <div class="mix-letters">${letters.map((ch, i) =>
          `<button type="button" class="mix-key${used.includes(i) ? " used" : ""}" data-i="${i}">${ch}</button>`
        ).join("")}</div>
        <div class="mix-tools">
          <button type="button" class="mix-undo" id="mixUndo" ${built.length && !won ? "" : "disabled"}>↩️ Undo</button>
          ${missed && !won ? `<button type="button" class="mix-retry" id="mixRetry">🔁 Retry</button>` : ""}
        </div>`;
      stage.querySelectorAll(".mix-key").forEach(btn => {
        btn.addEventListener("click", () => tap(+btn.dataset.i));
      });
      const undoBtn = document.getElementById("mixUndo");
      if (undoBtn) undoBtn.addEventListener("click", undo);
      const retryBtn = document.getElementById("mixRetry");
      if (retryBtn) retryBtn.addEventListener("click", retrySame);
    }
    function undo() {
      if (won || !used.length) return;
      used.pop();
      built = used.map(i => letters[i]).join("");
      missed = false;
      setStatus(help);
      showAgain(false);
      render();
    }
    function retrySame() {
      if (won) return;
      built = "";
      used.length = 0;
      missed = false;
      setStatus(help);
      showAgain(false);
      render();
    }
    function tap(i) {
      if (won || missed || used.includes(i)) return;
      used.push(i);
      built += letters[i];
      if (built.length < word.length) {
        render();
        return;
      }
      if (built === word) {
        won = true;
        missed = false;
        showAgain(true);
        const starNote = recordPlay("mix", "Word Mix");
        setStatus(`Yes! It was ${word}. ${countLabel}  ·  ${starNote}`);
        render();
        return;
      }
      missed = true;
      setStatus("Not quite — tap Undo or Retry. The answer is still hidden.");
      showAgain(false);
      render();
    }
    restart = startMix;
    render();
  }

  hub.querySelectorAll("[data-puzzle]").forEach(btn => {
    btn.addEventListener("click", () => openGame(btn.dataset.puzzle));
  });
  document.getElementById("puzzleBack").addEventListener("click", openHub);
  againBtn.addEventListener("click", () => {
    showAgain(false);
    if (typeof restart === "function") restart();
  });
  refreshTileSubs();
})();

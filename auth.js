// ============================================================
// Little Explorer World — Auth + per-user profile storage
// ------------------------------------------------------------
// Simple Google-styled account picker. Every account (identified
// by email) is a unique client-side user. Zero setup needed.
//
// OPTIONAL: To send real welcome emails on signup, paste your
// EmailJS keys below. Get them for free in 3 minutes at
// https://dashboard.emailjs.com (see the top of `sendWelcomeEmail`
// below for the template variables to configure).
// ============================================================

const LEW = (() => {
  const KEY_CURRENT  = "lew_current_user";
  const KEY_USERS    = "lew_users";
  const KEY_ACCOUNTS = "lew_known_accounts";
  const MAX_ACCOUNTS = 6;

  // 👇 Paste your EmailJS keys here to enable real welcome emails.
  //    All three are required. Leave `null` to skip email sending.
  const EMAILJS_CONFIG = null; // e.g. { publicKey: "abc...", serviceId: "service_xxx", templateId: "template_xxx" }

  // ---------- storage helpers ----------
  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(KEY_USERS) || "{}"); }
    catch { return {}; }
  }
  function saveUsers(users) { localStorage.setItem(KEY_USERS, JSON.stringify(users)); }
  function setCurrentId(id) {
    if (id) localStorage.setItem(KEY_CURRENT, id);
    else localStorage.removeItem(KEY_CURRENT);
  }
  function getCurrentId() { return localStorage.getItem(KEY_CURRENT); }

  function getCurrentUser() {
    const id = getCurrentId();
    if (!id) return null;
    return loadUsers()[id] || null;
  }

  function upsertUser(user) {
    const users = loadUsers();
    const existing = users[user.id] || {};
    users[user.id] = { ...existing, ...user, updatedAt: Date.now() };
    saveUsers(users);
    return users[user.id];
  }

  function asList(v) { return Array.isArray(v) ? v : []; }
  function asMap(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }

  function snapshotForCloud(user) {
    const p = (user && user.profile) || {};
    return {
      email: (user && user.email) || "",
      google_name: (user && user.googleName) || "",
      kid_name: p.name || "",
      age: p.age || null,
      gender: p.gender || "",
      theme: p.theme || "explorer",
      approval_code: p.approvalCode || "",
      approval_email: p.approvalEmail || "",
      stars: p.stars || 0,
      household_stars: p.householdStars || 0,
      achievements: asList(p.achievements),
      household_achievements: asList(p.householdAchievements),
      gifts: asList(p.gifts),
      puzzle_plays: asMap(p.puzzlePlays),
      puzzle_recent: asMap(p.puzzleRecent),
      puzzle_mix_seed: p.puzzleMixSeed || 0,
      puzzle_mix_index: p.puzzleMixIndex || 0
    };
  }

  function mergeCloudProfile(localUser, remote) {
    const lp = (localUser && localUser.profile) || {};
    const remoteAch = asList(remote.achievements);
    const localAch = asList(lp.achievements);
    const remoteHh = asList(remote.household_achievements);
    const localHh = asList(lp.householdAchievements);
    const remoteGifts = asList(remote.gifts);
    const localGifts = asList(lp.gifts);
    return {
      name: remote.kid_name || lp.name || "",
      age: remote.age || lp.age || null,
      gender: remote.gender || lp.gender || "",
      theme: remote.theme || lp.theme || "explorer",
      approvalCode: remote.approval_code || lp.approvalCode || "",
      approvalEmail: remote.approval_email || lp.approvalEmail || "",
      stars: Math.max(lp.stars || 0, remote.stars || 0),
      householdStars: Math.max(lp.householdStars || 0, remote.household_stars || 0),
      achievements: remoteAch.length >= localAch.length ? remoteAch : localAch,
      householdAchievements: remoteHh.length >= localHh.length ? remoteHh : localHh,
      gifts: remoteGifts.length >= localGifts.length ? remoteGifts : localGifts,
      puzzlePlays: Object.keys(asMap(remote.puzzle_plays)).length ? asMap(remote.puzzle_plays) : asMap(lp.puzzlePlays),
      puzzleRecent: Object.keys(asMap(remote.puzzle_recent)).length ? asMap(remote.puzzle_recent) : asMap(lp.puzzleRecent),
      puzzleMixSeed: remote.puzzle_mix_seed || lp.puzzleMixSeed || 0,
      puzzleMixIndex: remote.puzzle_mix_index || lp.puzzleMixIndex || 0
    };
  }

  function persistCloudNow() {
    const user = getCurrentUser();
    const db = typeof window !== "undefined" ? window.LEW_DB : null;
    if (!user || !user.email || !db || !db.upsertProfile || !db.enabled()) {
      return Promise.resolve(null);
    }
    return db.upsertProfile(snapshotForCloud(user)).catch(err => {
      console.error("cloud save failed", err);
      return null;
    });
  }

  async function hydrateFromCloud() {
    const user = getCurrentUser();
    const db = typeof window !== "undefined" ? window.LEW_DB : null;
    if (!user || !user.email || !db || !db.getProfile || !db.enabled()) return user;
    try {
      const remote = await db.getProfile(user.email);
      if (remote && (remote.kid_name || remote.stars || remote.household_stars || remote.approval_code)) {
        upsertUser({
          id: user.id,
          email: user.email,
          googleName: remote.google_name || user.googleName,
          picture: user.picture || "",
          profile: mergeCloudProfile(user, remote)
        });
        await persistCloudNow();
      } else if (user.profile && (user.profile.name || user.profile.stars || user.profile.approvalCode)) {
        await persistCloudNow();
      }
    } catch (err) {
      console.error("cloud load failed", err);
    }
    return getCurrentUser();
  }

  function saveProfile(profile) {
    const id = getCurrentId();
    if (!id) return null;
    const users = loadUsers();
    if (!users[id]) return null;
    users[id].profile = { ...(users[id].profile || {}), ...profile };
    users[id].updatedAt = Date.now();
    saveUsers(users);
    persistCloudNow();
    return users[id];
  }

  function getThemeId() {
    const u = getCurrentUser();
    const id = u && u.profile && u.profile.theme;
    return id ? String(id) : "explorer";
  }

  function setThemeId(id) {
    const next = id ? String(id) : "explorer";
    saveProfile({ theme: next });
    return getThemeId();
  }

  function signOut() { setCurrentId(null); }

  // ---------- stars / achievements ----------
  function awardStar(meta) {
    const id = getCurrentId();
    if (!id) return null;
    const users = loadUsers();
    if (!users[id]) return null;
    const p = users[id].profile || {};
    p.stars = (p.stars || 0) + 1;
    p.achievements = p.achievements || [];
    p.achievements.unshift({
      subject: (meta && meta.subject) || "quiz",
      score:   (meta && meta.score)   || null,
      total:   (meta && meta.total)   || null,
      label:   (meta && meta.label)   || "Perfect score!",
      ts: Date.now(),
      star: p.stars,
    });
    if (p.achievements.length > 100) p.achievements.length = 100;
    users[id].profile = p;
    users[id].updatedAt = Date.now();
    saveUsers(users);
    persistCloudNow();
    return p.stars;
  }
  function getStars() {
    const u = getCurrentUser();
    return (u && u.profile && u.profile.stars) || 0;
  }
  function getAchievements() {
    const u = getCurrentUser();
    return (u && u.profile && u.profile.achievements) || [];
  }

  // ---------- household stars (separate category) ----------
  // Blue for boys, pink for girls, purple for anything else / not set.
  const HOUSEHOLD_STYLES = {
    boy:    { color: "#3b82f6", light: "#dbeafe", label: "Blue star",   gradient: "linear-gradient(135deg,#3b82f6,#2563eb)" },
    male:   { color: "#3b82f6", light: "#dbeafe", label: "Blue star",   gradient: "linear-gradient(135deg,#3b82f6,#2563eb)" },
    m:      { color: "#3b82f6", light: "#dbeafe", label: "Blue star",   gradient: "linear-gradient(135deg,#3b82f6,#2563eb)" },
    girl:   { color: "#ec4899", light: "#fce7f3", label: "Pink star",   gradient: "linear-gradient(135deg,#ec4899,#db2777)" },
    female: { color: "#ec4899", light: "#fce7f3", label: "Pink star",   gradient: "linear-gradient(135deg,#ec4899,#db2777)" },
    f:      { color: "#ec4899", light: "#fce7f3", label: "Pink star",   gradient: "linear-gradient(135deg,#ec4899,#db2777)" },
    other:  { color: "#8b5cf6", light: "#ede9fe", label: "Purple star", gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)" }
  };

  function getHouseholdStarStyle() {
    const u = getCurrentUser();
    const g = (u && u.profile && u.profile.gender ? String(u.profile.gender) : "").trim().toLowerCase();
    return HOUSEHOLD_STYLES[g] || HOUSEHOLD_STYLES.other;
  }

  function awardHouseholdStar(meta) {
    const id = getCurrentId();
    if (!id) return null;
    const users = loadUsers();
    if (!users[id]) return null;
    const p = users[id].profile || {};
    p.householdStars = (p.householdStars || 0) + 1;
    p.householdAchievements = p.householdAchievements || [];
    p.householdAchievements.unshift({
      label: (meta && meta.label) || "Household missions complete!",
      date:  (meta && meta.date)  || null,
      ts: Date.now(),
      star: p.householdStars,
    });
    if (p.householdAchievements.length > 100) p.householdAchievements.length = 100;
    users[id].profile = p;
    users[id].updatedAt = Date.now();
    saveUsers(users);
    persistCloudNow();
    return p.householdStars;
  }

  function getHouseholdStars() {
    const u = getCurrentUser();
    return (u && u.profile && u.profile.householdStars) || 0;
  }

  function getHouseholdAchievements() {
    const u = getCurrentUser();
    return (u && u.profile && u.profile.householdAchievements) || [];
  }

  function resetHouseholdStars() {
    const id = getCurrentId();
    if (!id) return 0;
    const users = loadUsers();
    if (!users[id]) return 0;
    const p = users[id].profile || {};
    p.householdStars = 0;
    p.householdAchievements = [];
    users[id].profile = p;
    users[id].updatedAt = Date.now();
    saveUsers(users);
    persistCloudNow();
    return 0;
  }

  // ---------- mystery gift catalog ----------
  const STARS_PER_MYSTERY_BOX = 25;
  const STARS_PER_HOUSEHOLD_MYSTERY_BOX = 10;

  // Every 25 stars unlocks the next tier. Higher tiers = bigger rewards.
  const TIER_META = [
    { key: "bronze",   label: "Bronze",   icon: "🥉" },
    { key: "silver",   label: "Silver",   icon: "🥈" },
    { key: "gold",     label: "Gold",     icon: "🥇" },
    { key: "platinum", label: "Platinum", icon: "💎" },
    { key: "diamond",  label: "Diamond",  icon: "👑" }
  ];

  // Tier 1 (25 stars): small treats & simple toys
  // Tier 2 (50 stars): medium treats & nicer toys
  // Tier 3 (75 stars): kits, sport gear, small LEGO
  // Tier 4 (100 stars): bigger LEGO, remote toys, headphones
  // Tier 5 (125+ stars): premium gifts
  const GIFT_TIERS = [
    [
      { emoji: "🍫", name: "Chocolate bar" },
      { emoji: "🍩", name: "Fresh donut" },
      { emoji: "🍪", name: "Cookie pack" },
      { emoji: "🍭", name: "Giant lollipop" },
      { emoji: "🍦", name: "Ice cream treat" },
      { emoji: "🧁", name: "Cupcake" },
      { emoji: "🍰", name: "Slice of cake" },
      { emoji: "🍬", name: "Candy jar" },
      { emoji: "🍿", name: "Popcorn combo" },
      { emoji: "🥤", name: "Milkshake" },
      { emoji: "🎈", name: "Party balloons" },
      { emoji: "🌟", name: "Sticker pack" },
      { emoji: "✏️", name: "Fancy pencil set" },
      { emoji: "🫧", name: "Bubble bottle" },
      { emoji: "🪀", name: "Classic yo-yo" }
    ],
    [
      { emoji: "🧸", name: "Mini plushie" },
      { emoji: "🎨", name: "Crayon & marker set" },
      { emoji: "📚", name: "Illustrated storybook" },
      { emoji: "🧩", name: "Puzzle set" },
      { emoji: "⚽", name: "Mini football" },
      { emoji: "🎯", name: "Dart target game" },
      { emoji: "🚗", name: "Toy car" },
      { emoji: "💎", name: "Gemstone sticker book" },
      { emoji: "🦖", name: "Mini dinosaur figures" },
      { emoji: "🚀", name: "Glow-in-the-dark stars" },
      { emoji: "🏆", name: "Trophy sticker set" },
      { emoji: "🎪", name: "Circus toy pack" },
      { emoji: "🎁", name: "Assorted candy hamper" },
      { emoji: "🏸", name: "Junior badminton set" },
      { emoji: "🎲", name: "Family board game night" }
    ],
    [
      { emoji: "🧱", name: "LEGO starter set" },
      { emoji: "🔬", name: "Beginner science kit" },
      { emoji: "🎨", name: "Watercolor paint set" },
      { emoji: "🎮", name: "Handheld puzzle game" },
      { emoji: "🎬", name: "Movie night bundle" },
      { emoji: "🏰", name: "Toy castle" },
      { emoji: "🎪", name: "Magic tricks kit" },
      { emoji: "📖", name: "Kids encyclopedia" },
      { emoji: "🎧", name: "Kids headphones" },
      { emoji: "🎤", name: "Karaoke microphone" },
      { emoji: "🚴", name: "Bike accessories pack" },
      { emoji: "🎳", name: "Kids bowling set" },
      { emoji: "⚽", name: "Football with pump" },
      { emoji: "🏕️", name: "Camping toy kit" }
    ],
    [
      { emoji: "🧱", name: "Medium LEGO set" },
      { emoji: "🎨", name: "Art class kit" },
      { emoji: "🚗", name: "Remote-control car" },
      { emoji: "🎧", name: "Deluxe kids headphones" },
      { emoji: "🎮", name: "Portable game device" },
      { emoji: "🚴", name: "Bike helmet & pads" },
      { emoji: "⚽", name: "Sports gear bundle" },
      { emoji: "📸", name: "Kids digital camera" },
      { emoji: "📚", name: "Chapter book series" },
      { emoji: "🎹", name: "Toy keyboard" },
      { emoji: "🎳", name: "Deluxe bowling set" },
      { emoji: "🧑‍🍳", name: "Junior baking kit" }
    ],
    [
      { emoji: "🧱", name: "Large LEGO set" },
      { emoji: "🔬", name: "Big science lab kit" },
      { emoji: "🎮", name: "Video game" },
      { emoji: "🎨", name: "Art studio starter kit" },
      { emoji: "🛴", name: "Kids scooter accessories" },
      { emoji: "🎪", name: "Big magic set" },
      { emoji: "📚", name: "Illustrated book bundle" },
      { emoji: "🎧", name: "Kids Bluetooth speaker" },
      { emoji: "⚽", name: "Sports equipment set" },
      { emoji: "📸", name: "Instant photo camera" },
      { emoji: "🚁", name: "Beginner drone / heli" },
      { emoji: "🧠", name: "Big brainy puzzle set" }
    ]
  ];

  function tierIndexFor(stars, perBox) {
    const step = perBox || STARS_PER_MYSTERY_BOX;
    if (!stars || stars < step) return 0;
    const idx = Math.floor(stars / step) - 1;
    return Math.max(0, Math.min(idx, GIFT_TIERS.length - 1));
  }

  function getGiftCatalog() { return GIFT_TIERS.map(t => t.slice()); }
  function starsPerMysteryBox() { return STARS_PER_MYSTERY_BOX; }
  function starsPerHouseholdMysteryBox() { return STARS_PER_HOUSEHOLD_MYSTERY_BOX; }
  function getTierMeta(tierIdx) {
    return TIER_META[Math.max(0, Math.min(tierIdx, TIER_META.length - 1))];
  }

  function awardMysteryGift(opts) {
    const id = getCurrentId();
    if (!id) return null;
    const users = loadUsers();
    if (!users[id]) return null;
    const p = users[id].profile || {};
    p.gifts = p.gifts || [];
    const kind = (opts && opts.kind) || "regular";
    const isHousehold = kind === "household";
    const stars = isHousehold ? (p.householdStars || 0) : (p.stars || 0);
    const perBox = isHousehold ? STARS_PER_HOUSEHOLD_MYSTERY_BOX : STARS_PER_MYSTERY_BOX;
    const tierIdx = tierIndexFor(stars, perBox);
    const tier = GIFT_TIERS[tierIdx];
    const pick = tier[Math.floor(Math.random() * tier.length)];
    const tierMeta = TIER_META[tierIdx];
    const gift = {
      ...pick,
      source: kind,
      tier: tierIdx + 1,
      tierKey: tierMeta.key,
      tierLabel: tierMeta.label,
      tierIcon: tierMeta.icon,
      ts: Date.now(),
      claimed: false
    };
    p.gifts.unshift(gift);
    if (p.gifts.length > 200) p.gifts.length = 200;
    users[id].profile = p;
    users[id].updatedAt = Date.now();
    saveUsers(users);
    persistCloudNow();
    return gift;
  }

  function getGifts() {
    const u = getCurrentUser();
    return (u && u.profile && u.profile.gifts) || [];
  }

  function markGiftClaimed(ts, claimed) {
    const id = getCurrentId();
    if (!id) return null;
    const users = loadUsers();
    if (!users[id]) return null;
    const gifts = (users[id].profile && users[id].profile.gifts) || [];
    const g = gifts.find(x => x.ts === ts);
    if (g) g.claimed = !!claimed;
    users[id].updatedAt = Date.now();
    saveUsers(users);
    persistCloudNow();
    return g || null;
  }

  // ---------- known accounts (shown in the account picker) ----------
  function listKnownAccounts() {
    try { return JSON.parse(localStorage.getItem(KEY_ACCOUNTS) || "[]"); }
    catch { return []; }
  }
  function saveKnownAccount(acc) {
    const list = listKnownAccounts();
    const email = (acc.email || "").toLowerCase();
    const filtered = list.filter(a => a.email !== email);
    filtered.unshift({ email, name: acc.name || "", picture: acc.picture || "" });
    localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(filtered.slice(0, MAX_ACCOUNTS)));
  }
  function removeKnownAccount(email) {
    email = (email || "").toLowerCase();
    const list = listKnownAccounts().filter(a => a.email !== email);
    localStorage.setItem(KEY_ACCOUNTS, JSON.stringify(list));
  }

  // ---------- sign-in ----------
  // account: { email, name?, picture? }
  function signInAs(account) {
    const email = (account.email || "").trim().toLowerCase();
    if (!email) return null;
    const id = "g-" + email;
    const name = (account.name && account.name.trim()) || email.split("@")[0];
    const user = {
      id,
      provider: "google",
      email,
      googleName: name,
      picture: account.picture || "",
      createdAt: Date.now(),
    };
    upsertUser(user);
    setCurrentId(id);
    saveKnownAccount({ email, name, picture: user.picture });
    return user;
  }

  // ---------- welcome email (EmailJS) ----------
  // Template variables your EmailJS template should reference:
  //   {{to_email}}, {{to_name}}, {{user_age}}, {{user_gender}},
  //   {{app_name}}, {{login_url}}
  function isEmailConfigured() {
    return !!(EMAILJS_CONFIG &&
              EMAILJS_CONFIG.publicKey &&
              EMAILJS_CONFIG.serviceId &&
              EMAILJS_CONFIG.templateId);
  }

  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || ""); }

  async function sendWelcomeEmail(user) {
    if (!user) return { ok: false, reason: "no-user" };
    if (!validEmail(user.email)) return { ok: false, reason: "invalid-email" };
    if (!isEmailConfigured()) return { ok: false, reason: "not-configured" };
    if (typeof window === "undefined" || typeof window.emailjs === "undefined") {
      return { ok: false, reason: "sdk-missing" };
    }

    const p = (user.profile || {});
    const params = {
      to_email:    user.email,
      to_name:     p.name || user.googleName || "Explorer",
      user_age:    p.age || "",
      user_gender: p.gender || "",
      app_name:    "Little Explorer World",
      login_url:   (typeof location !== "undefined" ? location.origin : "") + "/index.html",
    };

    try {
      await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        params,
        { publicKey: EMAILJS_CONFIG.publicKey }
      );
      return { ok: true };
    } catch (e) {
      console.error("EmailJS send failed", e);
      return { ok: false, reason: "send-error", error: String(e && e.text || e) };
    }
  }

  // ---------- parent approval code (PlayVerse picture stars) ----------
  function generateApprovalCode() {
    return String(100000 + Math.floor(Math.random() * 900000));
  }

  function storedApprovalCode() {
    const u = getCurrentUser();
    return (u && u.profile && String(u.profile.approvalCode || "").trim()) || "";
  }

  function hasApprovalCode() {
    return !!storedApprovalCode();
  }

  function getApprovalEmail() {
    const u = getCurrentUser();
    if (!u) return "";
    return (u.profile && u.profile.approvalEmail) || u.email || "";
  }

  function verifyApprovalCode(code) {
    const stored = storedApprovalCode();
    return !!stored && stored === String(code || "").trim();
  }

  // Keeps the same code forever unless changeApprovalCode() is used.
  function createApprovalCode(email) {
    const dest = String(email || "").trim();
    if (!validEmail(dest)) return { ok: false, reason: "invalid-email" };
    let created = false;
    let code = storedApprovalCode();
    if (!code) {
      code = generateApprovalCode();
      created = true;
    }
    saveProfile({ approvalCode: code, approvalEmail: dest });
    return { ok: true, email: dest, created, changed: false };
  }

  function changeApprovalCode(currentCode, email) {
    if (!hasApprovalCode()) return { ok: false, reason: "none" };
    if (!verifyApprovalCode(currentCode)) return { ok: false, reason: "wrong-code" };
    const u = getCurrentUser();
    const dest = String(email || "").trim() || getApprovalEmail() || (u && u.email) || "";
    if (!validEmail(dest)) return { ok: false, reason: "invalid-email" };
    const code = generateApprovalCode();
    saveProfile({ approvalCode: code, approvalEmail: dest });
    return { ok: true, email: dest, created: false, changed: true };
  }

  function approvalMailCopy(changed, reminder) {
    const u = getCurrentUser();
    const name = (u && u.profile && u.profile.name) || (u && u.googleName) || "your explorer";
    const code = storedApprovalCode();
    const subject = reminder
      ? "Your Little Explorer approval code reminder"
      : changed
        ? "Your new Little Explorer approval code"
        : "Your Little Explorer approval code";
    const body =
      `Hi,\n\nThe parent approval code for ${name}'s Little Explorer World account is:\n\n${code}\n\n` +
      `This same code stays valid until you change it in the profile menu.\n` +
      `Use it to approve or deny pictures in PlayVerse.\n\n— Little Explorer World`;
    return { name, code, subject, body };
  }

  async function sendViaFormSubmit(email, subject, body, extra) {
    const payload = {
      _subject: subject,
      _template: "box",
      _captcha: "false",
      name: "Little Explorer World",
      message: body
    };
    if (extra && typeof extra === "object") Object.assign(payload, extra);
    const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(email), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data.success) return { ok: false, reason: "send-error" };
    const msg = String(data.message || "");
    if (/activat|confirm your email/i.test(msg)) return { ok: true, method: "confirm" };
    if (data.success === "false" || data.success === false) return { ok: false, reason: "send-error" };
    return { ok: true, method: "formsubmit" };
  }

  async function sendApprovalCodeEmail({ email, changed, reminder }) {
    const dest = String(email || "").trim() || getApprovalEmail();
    if (!validEmail(dest) || !storedApprovalCode()) return { ok: false, reason: "invalid" };
    saveProfile({ approvalEmail: dest });
    const { name, code, subject, body } = approvalMailCopy(!!changed, !!reminder);
    if (!code) return { ok: false, reason: "none" };

    if (isEmailConfigured() && typeof window !== "undefined" && window.emailjs) {
      try {
        await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            to_email: dest,
            to_name: name,
            approval_code: code,
            app_name: "Little Explorer World",
            message: body
          },
          { publicKey: EMAILJS_CONFIG.publicKey }
        );
        return { ok: true, method: "emailjs", email: dest };
      } catch (e) {
        console.error("Approval EmailJS failed", e);
      }
    }

    try {
      const sent = await sendViaFormSubmit(dest, subject, body);
      return { ...sent, email: dest };
    } catch (e) {
      console.error("Approval email failed", e);
      return { ok: false, reason: "send-error", email: dest };
    }
  }

  async function remindApprovalCode() {
    const user = getCurrentUser();
    if (!user || !user.email) return { ok: false, reason: "no-user" };
    const dest = getApprovalEmail() || user.email;
    if (!validEmail(dest)) return { ok: false, reason: "invalid-email" };

    const db = typeof window !== "undefined" ? window.LEW_DB : null;
    let code = storedApprovalCode();
    if (db && db.getProfile && db.enabled()) {
      try {
        const remote = await db.getProfile(user.email);
        if (remote && remote.approval_code) {
          code = String(remote.approval_code).trim();
          saveProfile({
            approvalCode: code,
            approvalEmail: remote.approval_email || dest
          });
        }
      } catch (err) {
        console.error("remind load failed", err);
        if (!code) return { ok: false, reason: "db-error" };
      }
    }
    if (!code) return { ok: false, reason: "none" };
    return sendApprovalCodeEmail({ email: dest, changed: false, reminder: true });
  }

  async function blobToBase64(blob) {
    const buf = await blob.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  async function asEmailImageFile(image) {
    const blob = image instanceof Blob ? image : new Blob([image]);
    try {
      const bmp = await createImageBitmap(blob);
      const max = 900;
      let w = bmp.width, h = bmp.height;
      if (w > max) {
        h = Math.max(1, Math.round(h * max / w));
        w = max;
      }
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(bmp, 0, 0, w, h);
      const jpeg = await new Promise(resolve => c.toBlob(resolve, "image/jpeg", 0.86));
      if (jpeg && jpeg.size) return new File([jpeg], "playverse-approved.jpg", { type: "image/jpeg" });
    } catch (_) {}
    return new File([blob], "playverse-approved.png", { type: blob.type || "image/png" });
  }

  async function uploadPublicImage(file) {
    const attempts = [
      async () => {
        const fd = new FormData();
        fd.append("file", file, file.name || "picture.jpg");
        const res = await fetch("https://telegra.ph/upload", { method: "POST", body: fd });
        const data = await res.json();
        const src = Array.isArray(data) ? (data[0] && (data[0].src || data[0])) : (data && data.src);
        if (typeof src !== "string") return "";
        return src.startsWith("http") ? src : ("https://telegra.ph" + src);
      },
      async () => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("https://tmpfiles.org/api/v1/upload", { method: "POST", body: fd });
        const data = await res.json();
        const url = data && data.data && data.data.url;
        if (!url) return "";
        return String(url).replace("://tmpfiles.org/", "://tmpfiles.org/dl/");
      },
      async () => {
        const fd = new FormData();
        fd.append("reqtype", "fileupload");
        fd.append("time", "72h");
        fd.append("fileToUpload", file);
        const res = await fetch("https://litterbox.catbox.moe/resources/internals/api.php", { method: "POST", body: fd });
        const text = String(await res.text()).trim();
        return /^https?:\/\//i.test(text) ? text : "";
      },
      async () => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("https://0x0.st", { method: "POST", body: fd });
        const text = String(await res.text()).trim();
        return /^https?:\/\//i.test(text) ? text : "";
      }
    ];
    for (const run of attempts) {
      try {
        const url = await run();
        if (url && /^https?:\/\//i.test(url)) return url;
      } catch (_) {}
    }
    return "";
  }

  async function sendApprovedPictureEmail({ image, title }) {
    const dest = getApprovalEmail();
    if (!validEmail(dest) || !image) return { ok: false, reason: "invalid" };
    const u = getCurrentUser();
    const name = (u && u.profile && u.profile.name) || (u && u.googleName) || "your explorer";
    const pictureTitle = title || "PlayVerse picture";
    const file = await asEmailImageFile(image);
    if (!file.size) return { ok: false, reason: "empty" };

    const pictureUrl = await uploadPublicImage(file);
    if (!pictureUrl) {
      try {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      } catch (_) {}
    }

    const subject = `${name}'s approved PlayVerse picture`;
    const body = pictureUrl
      ? (`Hi,\n\n${name} drew "${pictureTitle}" in PlayVerse and a parent approved it.\n\n` +
         `Open the approved picture here:\n${pictureUrl}\n\n— Little Explorer World`)
      : (`Hi,\n\n${name} drew "${pictureTitle}" in PlayVerse and a parent approved it.\n` +
         `We couldn't put the picture in this email, so it was saved to this device's Downloads folder.\n\n— Little Explorer World`);

    if (isEmailConfigured() && typeof window !== "undefined" && window.emailjs) {
      try {
        const b64 = await blobToBase64(file);
        await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            to_email: dest,
            to_name: name,
            app_name: "Little Explorer World",
            message: body,
            picture_title: pictureTitle,
            picture_url: pictureUrl,
            attachment: b64
          },
          { publicKey: EMAILJS_CONFIG.publicKey }
        );
        return { ok: true, method: "emailjs", email: dest, pictureUrl };
      } catch (e) {
        console.error("Approved picture EmailJS failed", e);
      }
    }

    try {
      const extra = pictureUrl ? { approved_picture: pictureUrl } : {};
      const sent = await sendViaFormSubmit(dest, subject, body, extra);
      return { ...sent, email: dest, pictureUrl };
    } catch (e) {
      console.error("Approved picture email failed", e);
      return { ok: false, reason: "send-error", email: dest, pictureUrl };
    }
  }

  // ---------- guard ----------
  function requireAuth({ loginUrl = "login.html" } = {}) {
    const user = getCurrentUser();
    if (!user) {
      window.location.replace(loginUrl);
      return null;
    }
    if (!user.profile || !user.profile.name || !user.profile.age) {
      window.location.replace(loginUrl + "#profile");
      return null;
    }
    return user;
  }

  return {
    // sign-in flow
    signInAs,
    signOut,
    listKnownAccounts,
    removeKnownAccount,
    // user + profile
    getCurrentUser,
    saveProfile,
    hydrateFromCloud,
    persistCloudNow,
    getThemeId,
    setThemeId,
    requireAuth,
    // stars / achievements
    awardStar,
    getStars,
    getAchievements,
    // household stars (separate category, colored by gender)
    awardHouseholdStar,
    getHouseholdStars,
    getHouseholdAchievements,
    getHouseholdStarStyle,
    resetHouseholdStars,
    // mystery gifts
    starsPerMysteryBox,
    starsPerHouseholdMysteryBox,
    getGiftCatalog,
    getTierMeta,
    awardMysteryGift,
    getGifts,
    markGiftClaimed,
    // email
    isEmailConfigured,
    sendWelcomeEmail,
    validEmail,
    // parent approval code
    hasApprovalCode,
    getApprovalEmail,
    verifyApprovalCode,
    createApprovalCode,
    changeApprovalCode,
    remindApprovalCode,
    sendApprovalCodeEmail,
    sendApprovedPictureEmail,
  };
})();

if (typeof window !== "undefined") window.LEW = LEW;

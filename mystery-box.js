// ============================================================
// Little Explorer World — Mystery Box + Gift List
// ------------------------------------------------------------
// LEW.showMysteryBox({ starTotal })   — open-a-box flow
// LEW.showGiftList()                  — see all claimed gifts
// LEW.refreshRewardBadge()            — update ⭐N / 🎁M badge
// LEW.maybeAwardMysteryBox(starTotal) — call after awardStar
// ============================================================

(function () {
  const STARS_PER_BOX = 25;
  const STARS_PER_HOUSEHOLD_BOX = 10;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[s]));
  }

  function splitGifts(gifts) {
    const quiz = [];
    const household = [];
    (gifts || []).forEach(g => {
      if (g.source === "household") household.push(g);
      else quiz.push(g);
    });
    return { quiz, household };
  }

  // ---------------- reward badge ----------------
  function refreshRewardBadge() {
    const stars = (LEW.getStars && LEW.getStars()) || 0;
    const allGifts = (LEW.getGifts && LEW.getGifts()) || [];
    const { quiz: quizGifts, household: hhGifts } = splitGifts(allGifts);
    const hhStars = (LEW.getHouseholdStars && LEW.getHouseholdStars()) || 0;
    const hhStyle = (LEW.getHouseholdStarStyle && LEW.getHouseholdStarStyle()) || null;

    const badge = document.getElementById("starBadge");
    const hhBadge = document.getElementById("householdBadge");
    const starCountEl = document.getElementById("starCount");
    const giftPart = document.getElementById("giftPart");
    const giftCountEl = document.getElementById("giftCount");
    const hhCountEl = document.getElementById("householdStarCount");
    const hhIcoEl = document.getElementById("householdStarIco");
    const hhGiftCountEl = document.getElementById("householdGiftCount");
    const hhGiftPart = document.getElementById("householdGiftPart");
    const hhStarsPart = hhBadge ? hhBadge.querySelector(".reward-part.hh-stars") : null;

    if (starCountEl) starCountEl.textContent = stars;
    if (giftCountEl) giftCountEl.textContent = quizGifts.length;
    if (giftPart) giftPart.style.display = "";
    if (badge) {
      badge.style.display = (stars > 0 || quizGifts.length > 0) ? "" : "none";
      if (!badge.dataset.wired) {
        badge.dataset.wired = "1";
        badge.style.cursor = "pointer";
        badge.addEventListener("click", () => showGiftList({ kind: "regular" }));
      }
    }

    if (hhCountEl) hhCountEl.textContent = hhStars;
    if (hhGiftCountEl) hhGiftCountEl.textContent = hhGifts.length;
    if (hhIcoEl) hhIcoEl.textContent = "★";
    if (hhGiftPart) hhGiftPart.style.display = "";
    if (hhBadge) {
      const showHh = hhStars > 0 || hhGifts.length > 0;
      hhBadge.style.display = showHh ? "" : "none";
      if (hhStyle) {
        hhBadge.title = `${hhStyle.label} & household mystery boxes`;
        if (hhStarsPart) {
          hhStarsPart.style.background = hhStyle.gradient;
          hhStarsPart.style.color = "white";
        }
        if (hhGiftPart) {
          hhGiftPart.style.background = hhStyle.color;
          hhGiftPart.style.color = "white";
        }
      }
      if (!hhBadge.dataset.wired) {
        hhBadge.dataset.wired = "1";
        hhBadge.style.cursor = "pointer";
        hhBadge.addEventListener("click", () => showGiftList({ kind: "household" }));
      }
    }

    const moneyBadge = document.getElementById("moneyBadge");
    const moneyCountEl = document.getElementById("moneyCount");
    const cents = (LEW.getCustomMissionCents && LEW.getCustomMissionCents()) || 0;
    const missionCount = (LEW.getCustomMissions && LEW.getCustomMissions().length) || 0;
    const depositCount = (LEW.getBankDeposits && LEW.getBankDeposits().length) || 0;
    if (moneyCountEl) moneyCountEl.textContent = (LEW.formatWallet && LEW.formatWallet()) || (LEW.formatMoney && LEW.formatMoney(cents)) || ("$" + (cents / 100).toFixed(2));
    if (moneyBadge) {
      moneyBadge.style.display = (cents !== 0 || missionCount > 0 || depositCount > 0) ? "" : "none";
      moneyBadge.classList.toggle("negative", cents < 0);
      moneyBadge.title = "See pocket money breakdown";
      moneyBadge.style.cursor = "pointer";
      if (!moneyBadge.dataset.wired) {
        moneyBadge.dataset.wired = "1";
        moneyBadge.addEventListener("click", () => showWalletBreakdown());
      }
    }
  }

  // ---------------- mystery box ----------------
  function showMysteryBox({ starTotal = 0, onClose, kind = "regular" } = {}) {
    const isHousehold = kind === "household";
    let milestoneLabel;
    let cardStyleAttr = "";
    if (isHousehold) {
      const hhStyle = (LEW.getHouseholdStarStyle && LEW.getHouseholdStarStyle()) || null;
      const starChar = hhStyle
        ? `<span style="color:${hhStyle.color}">★</span>`
        : `★`;
      milestoneLabel = `${starTotal} ${starChar} HOUSEHOLD STARS EARNED`;
      if (hhStyle) {
        cardStyleAttr = ` style="border-top: 6px solid ${hhStyle.color};"`;
      }
    } else {
      milestoneLabel = `${starTotal} ⭐ STARS EARNED`;
    }

    const overlay = document.createElement("div");
    overlay.className = "mystery-overlay" + (isHousehold ? " household-box" : "");
    overlay.innerHTML = `
      <div class="mystery-card" role="dialog" aria-labelledby="mysteryTitle"${cardStyleAttr}>
        <div class="mystery-sparkles">✨ &nbsp; 🌟 &nbsp; ✨</div>
        <div class="mystery-milestone">${milestoneLabel}</div>
        <h2 class="mystery-title" id="mysteryTitle">Mystery Box!</h2>
        <p class="mystery-sub">${isHousehold ? "Thank you for helping around the house! Tap the box to open your reward." : "You've unlocked a surprise. Tap the box to open it!"}</p>
        <div class="mystery-stage" id="mysteryStage">
          <button class="mystery-box" id="mysteryBoxBtn" type="button" aria-label="Open mystery box">
            <span class="mystery-box-shadow"></span>
            <span class="mystery-box-emoji">🎁</span>
            <span class="mystery-box-shine"></span>
          </button>
          <div class="mystery-tap-hint">👆 Tap the box!</div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));

    const stage = overlay.querySelector("#mysteryStage");
    const boxBtn = overlay.querySelector("#mysteryBoxBtn");

    const closeOverlay = () => {
      overlay.classList.remove("show");
      setTimeout(() => {
        overlay.remove();
        if (typeof onClose === "function") onClose();
      }, 350);
    };

    boxBtn.addEventListener("click", () => {
      if (boxBtn.disabled) return;
      boxBtn.disabled = true;
      boxBtn.classList.add("shaking");
      spawnBurst(stage);
      setTimeout(() => {
        boxBtn.classList.remove("shaking");
        boxBtn.classList.add("popped");
        setTimeout(() => {
          const gift = LEW.awardMysteryGift({ kind: isHousehold ? "household" : "regular" });
          if (!gift) { closeOverlay(); return; }
          if (typeof LEW.refreshRewardBadge === "function") LEW.refreshRewardBadge();
          const tierBadge = gift.tierLabel
            ? `<div class="mystery-reveal-tier tier-${gift.tierKey || ''}">${gift.tierIcon || '⭐'} ${escapeHtml(gift.tierLabel)} Reward</div>`
            : '';
          stage.innerHTML = `
            <div class="mystery-reveal">
              <div class="mystery-reveal-burst">✨💫⭐💫✨</div>
              <div class="mystery-reveal-emoji">${gift.emoji}</div>
              <div class="mystery-reveal-name">${escapeHtml(gift.name)}</div>
              ${tierBadge}
              <div class="mystery-reveal-note">🎉 Show this to your parent — they can pick it up for you as a reward for your hard work!</div>
              <button class="mystery-close-btn">Awesome!</button>
            </div>`;
          stage.querySelector(".mystery-close-btn").addEventListener("click", closeOverlay);
        }, 550);
      }, 900);
    });
  }

  function spawnBurst(container) {
    const burst = document.createElement("div");
    burst.className = "mystery-burst-fx";
    burst.innerHTML = ["✨","💫","⭐","✨","💫"].map((c, i) => {
      const ang = (i / 5) * Math.PI * 2;
      const dx = Math.cos(ang) * 90;
      const dy = Math.sin(ang) * 90;
      return `<span style="--dx:${dx}px;--dy:${dy}px;">${c}</span>`;
    }).join("");
    container.appendChild(burst);
    setTimeout(() => burst.remove(), 1000);
  }

  // ---------------- gift list ----------------
  function showGiftList({ kind = "regular" } = {}) {
    const isHousehold = kind === "household";
    const allGifts = (LEW.getGifts && LEW.getGifts()) || [];
    const { quiz: quizGifts, household: hhGifts } = splitGifts(allGifts);
    const gifts = isHousehold ? hhGifts : quizGifts;
    const stars = isHousehold
      ? ((LEW.getHouseholdStars && LEW.getHouseholdStars()) || 0)
      : ((LEW.getStars && LEW.getStars()) || 0);
    const hhStyle = (LEW.getHouseholdStarStyle && LEW.getHouseholdStarStyle()) || null;
    const perBox = isHousehold
      ? ((LEW.starsPerHouseholdMysteryBox && LEW.starsPerHouseholdMysteryBox()) || STARS_PER_HOUSEHOLD_BOX)
      : ((LEW.starsPerMysteryBox && LEW.starsPerMysteryBox()) || STARS_PER_BOX);
    const remainder = stars % perBox;
    const toNext = remainder === 0 ? perBox : perBox - remainder;
    const fillPct = ((perBox - toNext) / perBox * 100).toFixed(0);
    const hhStarChar = hhStyle ? `<span style="color:${hhStyle.color}">★</span>` : "★";
    const hhLabel = hhStyle ? hhStyle.label : "Household star";
    const starLabel = isHousehold ? hhStarChar : "⭐";
    const title = isHousehold ? `${hhStarChar} Household Rewards` : "⭐ Quiz Rewards";
    const emptyHint = isHousehold
      ? `Earn <b>${perBox} household stars</b> to unlock a household mystery box.`
      : `Earn <b>${perBox} quiz stars</b> to unlock a mystery box.`;
    const progressFillStyle = isHousehold && hhStyle
      ? `width:${fillPct}%; background:${hhStyle.gradient}`
      : `width:${fillPct}%`;
    const progressLabel = toNext === perBox && stars > 0
      ? "🎉 Next mystery box unlocked!"
      : `Next mystery box in <b>${toNext} more</b> ${isHousehold ? hhLabel.toLowerCase() + (toNext === 1 ? "" : "s") : "⭐"}`;

    const overlay = document.createElement("div");
    overlay.className = "mystery-overlay";
    const listHtml = gifts.length
      ? gifts.map(g => {
          const d = new Date(g.ts);
          const dateStr = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
          const tierPill = g.tierLabel
            ? `<span class="tier-pill tier-${g.tierKey || ''}">${g.tierIcon || '⭐'} ${escapeHtml(g.tierLabel)}</span>`
            : '';
          return `
            <div class="gift-list-item ${g.claimed ? "claimed" : ""}" data-ts="${g.ts}">
              <div class="gift-list-emoji">${g.emoji}</div>
              <div class="gift-list-body">
                <div class="gift-list-name">${escapeHtml(g.name)}</div>
                <div class="gift-list-meta">${tierPill}<span class="gift-list-date">${dateStr}</span></div>
              </div>
              <button class="gift-claim-btn" data-ts="${g.ts}" data-claimed="${g.claimed ? "1" : "0"}">
                ${g.claimed ? "✓ Received" : "Mark received"}
              </button>
            </div>`;
        }).join("")
      : `<div class="gift-list-empty">
          <div style="font-size:52px;">🎁</div>
          <div style="font-family:'Baloo 2'; font-weight:800; font-size:20px; margin-top:8px;">No gifts yet!</div>
          <div style="color:#64748b; margin-top:6px;">${emptyHint}</div>
        </div>`;

    overlay.innerHTML = `
      <div class="mystery-card gift-list-card" role="dialog" aria-labelledby="giftListTitle">
        <div class="gift-list-head">
          <div>
            <h2 class="mystery-title" id="giftListTitle">${title}</h2>
            <p class="mystery-sub">${isHousehold ? "Helping at home unlocks these surprises" : "Rewards you can ask your parent for"}</p>
          </div>
          <div class="gift-list-stats">
            <div><b>${stars}</b><span>${starLabel} stars</span></div>
            <div><b>${gifts.length}</b><span>🎁 boxes</span></div>
          </div>
        </div>
        <div class="gift-list-progress">
          <div class="gift-list-progress-bar">
            <div class="gift-list-progress-fill" style="${progressFillStyle}"></div>
          </div>
          <div class="gift-list-progress-label">${progressLabel}</div>
        </div>
        <div class="gift-list">${listHtml}</div>
        <button class="mystery-close-btn gift-list-close">Close</button>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));

    const close = () => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 350);
    };
    overlay.querySelector(".gift-list-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    overlay.querySelectorAll(".gift-claim-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const ts = Number(btn.dataset.ts);
        const wasClaimed = btn.dataset.claimed === "1";
        LEW.markGiftClaimed(ts, !wasClaimed);
        btn.dataset.claimed = wasClaimed ? "0" : "1";
        btn.textContent = wasClaimed ? "Mark received" : "✓ Received";
        btn.closest(".gift-list-item").classList.toggle("claimed", !wasClaimed);
      });
    });
  }

  function moneyLine(w) {
    if (LEW.formatWalletMap) return LEW.formatWalletMap(w || {});
    if (LEW.formatMoney) return LEW.formatMoney(0);
    return "$0.00";
  }

  function showWalletBreakdown() {
    const br = (LEW.getWalletBreakdown && LEW.getWalletBreakdown()) || {
      total: {}, missions: {}, giftCard: {}, cash: {}, history: []
    };
    const overlay = document.createElement("div");
    overlay.className = "mystery-overlay";
    const KIND = {
      mission: { ico: "📝", label: "Custom Mission" },
      gift_card: { ico: "🎁", label: "Gift Card" },
      cash: { ico: "💵", label: "Cash" },
      spend: { ico: "🛒", label: "Spending" }
    };
    const listHtml = (br.history || []).length
      ? br.history.map(item => {
          const meta = KIND[item.kind] || KIND.cash;
          const d = new Date(item.ts || Date.now());
          const dateStr = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
          const money = (LEW.formatMoneyDelta && LEW.formatMoneyDelta(item.amountCents, item.currency))
            || (LEW.formatMoney && LEW.formatMoney(Math.abs(item.amountCents || 0), item.currency)) || "";
          return `
            <div class="gift-list-item">
              <div class="gift-list-emoji">${meta.ico}</div>
              <div class="gift-list-body">
                <div class="gift-list-name">${escapeHtml(item.title || meta.label)}</div>
                <div class="gift-list-meta"><span class="gift-list-date">${meta.label} · ${dateStr}</span></div>
              </div>
              <div class="wallet-item-amt${item.kind === "spend" ? " spend" : ""}">${escapeHtml(money)}</div>
            </div>`;
        }).join("")
      : `<div class="gift-list-empty">
          <div style="font-size:52px;">🏦</div>
          <div style="font-family:'Baloo 2'; font-weight:800; font-size:20px; margin-top:8px;">No money yet!</div>
          <div style="color:#64748b; margin-top:6px;">Finish custom missions or add a gift card or cash in <b>My Bank</b>.</div>
        </div>`;
    const totalCents = Object.keys(br.total || {}).reduce((s, k) => s + (br.total[k] || 0), 0);
    const negClass = totalCents < 0 ? " negative" : "";
    overlay.innerHTML = `
      <div class="mystery-card gift-list-card wallet-card" role="dialog" aria-labelledby="walletTitle">
        <div class="gift-list-head">
          <div>
            <h2 class="mystery-title" id="walletTitle">💵 Pocket Money</h2>
            <p class="mystery-sub">Breakdown of everything in My Bank</p>
          </div>
          <div class="gift-list-stats wallet-stats${negClass}">
            <div><b>${escapeHtml(moneyLine(br.total))}</b><span>Total</span></div>
          </div>
        </div>
        <div class="wallet-break">
          <div class="wallet-break-item"><span>📝 Missions</span><b>${escapeHtml(moneyLine(br.missions))}</b></div>
          <div class="wallet-break-item"><span>🎁 Gift Cards</span><b>${escapeHtml(moneyLine(br.giftCard))}</b></div>
          <div class="wallet-break-item"><span>💵 Cash</span><b>${escapeHtml(moneyLine(br.cash))}</b></div>
          <div class="wallet-break-item spent"><span>🛒 Spent</span><b>${escapeHtml(moneyLine(br.spent))}</b></div>
        </div>
        <div class="gift-list">${listHtml}</div>
        <div class="wallet-break-actions">
          <button type="button" class="mystery-close-btn gift-list-close">Close</button>
          <button type="button" class="mystery-close-btn wallet-open-bank">Open My Bank</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));
    const close = () => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 350);
    };
    overlay.querySelector(".gift-list-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    overlay.querySelector(".wallet-open-bank").addEventListener("click", () => {
      close();
      if (/pocket-money\.html/i.test(location.pathname || "")) {
        window.dispatchEvent(new CustomEvent("lew-open-bank"));
      } else {
        const base = location.pathname.indexOf("/apps/") >= 0 ? "." : "apps";
        location.href = base + "/pocket-money.html#bank";
      }
    });
  }

  // ---------------- convenience: trigger box on star milestone ----------------
  function maybeAwardMysteryBox(starTotal) {
    if (!starTotal || starTotal % STARS_PER_BOX !== 0) return false;
    setTimeout(() => showMysteryBox({ starTotal, kind: "regular" }), 600);
    return true;
  }

  function maybeAwardHouseholdMysteryBox(starTotal) {
    if (!starTotal || starTotal % STARS_PER_HOUSEHOLD_BOX !== 0) return false;
    setTimeout(() => showMysteryBox({ starTotal, kind: "household" }), 600);
    return true;
  }

  window.LEW = window.LEW || {};
  window.LEW.showMysteryBox = showMysteryBox;
  window.LEW.showGiftList = showGiftList;
  window.LEW.showWalletBreakdown = showWalletBreakdown;
  window.LEW.refreshRewardBadge = refreshRewardBadge;
  window.LEW.maybeAwardMysteryBox = maybeAwardMysteryBox;
  window.LEW.maybeAwardHouseholdMysteryBox = maybeAwardHouseholdMysteryBox;

  // Auto-refresh badge on load if the elements exist
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refreshRewardBadge);
  } else {
    refreshRewardBadge();
  }
})();

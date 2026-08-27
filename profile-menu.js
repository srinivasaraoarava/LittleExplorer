// Shared profile dropdown: Themes, approval, Sign out, Delete Account
(function () {
  function loginHref() {
    return /\/apps\//.test(location.pathname || "") ? "../login.html" : "login.html";
  }

  function ensureDeleteOverlay() {
    if (document.getElementById("deleteAccountOverlay")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="approval-overlay" id="deleteAccountOverlay" role="dialog" aria-modal="true">
        <div class="approval-card">
          <div class="approval-kicker">Account</div>
          <h2>Delete Account</h2>
          <p>This permanently removes the kid's name, age, stars, and approval code from the database. This cannot be undone.</p>
          <div class="approval-field" id="deletePinWrap" style="display:none;">
            <label for="deletePin">Parent approval code</label>
            <input id="deletePin" class="approval-pin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="••••••" />
          </div>
          <div class="approval-err" id="deleteErr" style="display:none;"></div>
          <div class="approval-actions">
            <button type="button" class="approval-btn" id="deleteCancel">Cancel</button>
            <button type="button" class="approval-btn no" id="deleteConfirm">Delete Account</button>
          </div>
        </div>
      </div>
    `);
  }

  function wireProfileMenu(user) {
    if (!user) return;
    const menu = document.getElementById("profileMenu");
    const chip = document.getElementById("userChip");
    const btn = document.getElementById("signoutBtn");
    if (!menu || !chip || !btn) return;
    const p = user.profile || {};
    const nameEl = document.getElementById("userName");
    const metaEl = document.getElementById("userMeta");
    const avatarEl = document.getElementById("userAvatar");
    const approvalMenuBtn = document.getElementById("approvalMenuBtn");
    const remindCodeBtn = document.getElementById("remindCodeBtn");
    const themeMenuBtn = document.getElementById("themeMenuBtn");
    const loginUrl = loginHref();

    menu.style.display = "";
    if (nameEl) nameEl.textContent = p.name || "Explorer";
    if (metaEl) {
      const genderLabel = p.gender === "boy" ? "Boy" : p.gender === "girl" ? "Girl" : "Explorer";
      metaEl.textContent = `Age ${p.age} • ${genderLabel}`;
    }
    if (avatarEl) {
      if (user.picture) avatarEl.innerHTML = `<img src="${user.picture}" alt="" />`;
      else avatarEl.textContent = (p.name || "E").trim().charAt(0).toUpperCase();
    }

    function syncApprovalLabel() {
      if (!approvalMenuBtn) return;
      approvalMenuBtn.textContent = (LEW.hasApprovalCode && LEW.hasApprovalCode())
        ? "🔐 Change Approval Code"
        : "🔐 Create Approval Code";
    }
    syncApprovalLabel();

    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      syncApprovalLabel();
      const open = menu.classList.toggle("open");
      chip.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", () => {
      menu.classList.remove("open");
      chip.setAttribute("aria-expanded", "false");
    });
    if (approvalMenuBtn) {
      approvalMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.remove("open");
        if (typeof LEW.openApprovalSettings === "function") LEW.openApprovalSettings();
      });
    }
    if (remindCodeBtn) {
      remindCodeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        menu.classList.remove("open");
        chip.setAttribute("aria-expanded", "false");
        const toast = (msg) => {
          if (typeof LEW.showToast === "function") LEW.showToast(msg);
        };
        remindCodeBtn.disabled = true;
        toast("Sending your approval code…");
        let sent = { ok: false, reason: "none" };
        try {
          sent = await LEW.remindApprovalCode();
        } catch (err) {
          console.error(err);
        }
        remindCodeBtn.disabled = false;
        const dest = (sent && sent.email) || (LEW.getApprovalEmail && LEW.getApprovalEmail()) || (user && user.email) || "";
        if (sent && sent.ok && sent.method === "confirm") {
          toast("Check your inbox to confirm the first email, then tap Remind Me My Code again.");
        } else if (sent && sent.ok) {
          toast("The approval code was emailed to " + dest + ". Check inbox and spam.");
        } else if (sent && sent.reason === "none") {
          toast("No approval code yet. Tap Create Approval Code first.");
        } else if (sent && sent.reason === "db-error") {
          toast("Could not read the code from the database. Try again.");
        } else {
          toast("Could not email the approval code. Try again.");
        }
      });
    }
    if (themeMenuBtn) {
      themeMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.remove("open");
        if (typeof LEW.openThemePicker === "function") LEW.openThemePicker();
      });
    }
    const dropdown = document.getElementById("profileDropdown");
    if (dropdown) dropdown.addEventListener("click", (e) => e.stopPropagation());

    btn.addEventListener("click", () => {
      LEW.signOut();
      window.location.replace(loginUrl);
    });

    ensureDeleteOverlay();
    const deleteOverlay = document.getElementById("deleteAccountOverlay");
    const deletePinWrap = document.getElementById("deletePinWrap");
    const deletePin = document.getElementById("deletePin");
    const deleteErr = document.getElementById("deleteErr");
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    if (deleteAccountBtn && deleteOverlay && deletePin && deleteErr) {
      deleteAccountBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.remove("open");
        chip.setAttribute("aria-expanded", "false");
        deleteErr.style.display = "none";
        deleteErr.classList.remove("show");
        deletePin.value = "";
        deletePin.classList.remove("wrong");
        const needPin = !!(LEW.hasApprovalCode && LEW.hasApprovalCode());
        if (deletePinWrap) deletePinWrap.style.display = needPin ? "" : "none";
        deleteOverlay.classList.add("open");
        if (needPin) setTimeout(() => deletePin.focus(), 50);
      });
      const deleteCancel = document.getElementById("deleteCancel");
      if (deleteCancel) {
        deleteCancel.addEventListener("click", () => deleteOverlay.classList.remove("open"));
      }
      deleteOverlay.addEventListener("click", (e) => {
        if (e.target === deleteOverlay) deleteOverlay.classList.remove("open");
      });
      deletePin.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
        deleteErr.style.display = "none";
        deleteErr.classList.remove("show");
        deletePin.classList.remove("wrong");
      });
      const deleteConfirm = document.getElementById("deleteConfirm");
      if (deleteConfirm) {
        deleteConfirm.addEventListener("click", async () => {
          const needPin = !!(LEW.hasApprovalCode && LEW.hasApprovalCode());
          if (needPin && !(LEW.verifyApprovalCode && LEW.verifyApprovalCode(deletePin.value))) {
            deleteErr.textContent = "The code is wrong.";
            deleteErr.classList.add("show");
            deleteErr.style.display = "block";
            deletePin.classList.add("wrong");
            deletePin.focus();
            deletePin.select();
            return;
          }
          deleteConfirm.disabled = true;
          deleteConfirm.textContent = "Deleting…";
          const result = await LEW.deleteAccount();
          if (!result || !result.ok) {
            deleteConfirm.disabled = false;
            deleteConfirm.textContent = "Delete Account";
            deleteErr.textContent = result && result.reason === "db-error"
              ? "Could not delete the account from the database. Try again."
              : "Could not delete the account. Try again.";
            deleteErr.style.display = "block";
            deleteErr.classList.add("show");
            return;
          }
          window.location.replace(loginUrl);
        });
      }
    }
  }

  window.LEW = window.LEW || {};
  window.LEW.wireProfileMenu = wireProfileMenu;
})();

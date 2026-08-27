// Parent approval code UI — create / change / picture submit
(function () {
  let mode = "manage"; // manage | submit
  let onApprove = null;
  let onDeny = null;

  function ensure() {
    if (document.getElementById("approvalOverlay")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="approval-overlay" id="approvalOverlay" role="dialog" aria-modal="true">
        <div class="approval-card">
          <button type="button" class="approval-close" id="apClose" aria-label="Close">✕</button>

          <div id="apCreate">
            <div class="approval-kicker">Parents</div>
            <h2 id="apCreateTitle">Create Approval Code</h2>
            <p id="apCreateHint">We'll email a 6-digit code. It stays in the inbox — it is never shown on this screen.</p>
            <div class="approval-field" id="apCurrentWrap" style="display:none;">
              <label for="apCurrent">Current code</label>
              <input id="apCurrent" class="approval-pin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="••••••" />
            </div>
            <div class="approval-field">
              <label for="apEmail">Parent email</label>
              <input id="apEmail" type="email" autocomplete="email" placeholder="parent@email.com" />
            </div>
            <div class="approval-err" id="apCreateErr"></div>
            <div class="approval-actions">
              <button type="button" class="approval-btn primary" id="apSendBtn">Create &amp; email code</button>
            </div>
            <p id="apResendWrap" style="display:none;margin-top:12px;font-size:13px;">
              Already have a code? It stays the same until you change it.
              <button type="button" id="apResendBtn" style="border:none;background:none;color:#7c3aed;font-weight:800;cursor:pointer;font-family:inherit;">Resend the same code</button>
            </p>
          </div>

          <div id="apCreated" style="display:none;">
            <div class="approval-kicker">Sent</div>
            <h2>Check your email</h2>
            <p id="apCreatedHint">The code was emailed. It will not be shown here.</p>
            <div class="approval-actions">
              <button type="button" class="approval-btn primary" id="apCreatedNext">Continue</button>
            </div>
          </div>

          <div id="apEnter" style="display:none;">
            <div class="approval-kicker">Parent check</div>
            <h2>Enter the code</h2>
            <p id="apEnterHint">Hand the device to a parent. Type the 6-digit code from email to unlock Approve or Deny.</p>
            <div class="approval-field">
              <label for="apPin">Approval code</label>
              <input id="apPin" class="approval-pin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="••••••" />
            </div>
            <div class="approval-err" id="apEnterErr"></div>
            <div class="approval-actions">
              <button type="button" class="approval-btn primary" id="apUnlock">Unlock</button>
            </div>
            <p style="margin-top:14px;font-size:13px;">
              <button type="button" id="apEnterResend" style="border:none;background:none;color:#7c3aed;font-weight:800;cursor:pointer;font-family:inherit;">Resend the same code</button>
              ·
              <button type="button" id="apNeedCreate" style="border:none;background:none;color:#7c3aed;font-weight:800;cursor:pointer;font-family:inherit;">Create / change</button>
            </p>
          </div>

          <div id="apDecide" style="display:none;">
            <div class="approval-kicker">Parent check</div>
            <h2 id="apDecideTitle">Approve this picture?</h2>
            <p id="apDecideHint">Code accepted. Choose what happens next.</p>
            <div class="approval-actions">
              <button type="button" class="approval-btn ok" id="apApprove">Approve ⭐</button>
              <button type="button" class="approval-btn no" id="apDeny">Deny</button>
            </div>
          </div>

          <div id="apDenied" style="display:none;">
            <div class="approval-kicker">Try again</div>
            <h2>Not this time</h2>
            <p id="apDeniedHint">A parent asked you to keep drawing. Change your picture, then submit again!</p>
            <div class="approval-actions">
              <button type="button" class="approval-btn primary" id="apRetry">Retry 🎨</button>
            </div>
          </div>
        </div>
      </div>
    `);
    wire();
  }

  function showPanel(id) {
    ["apCreate", "apCreated", "apEnter", "apDecide", "apDenied"].forEach(pid => {
      const el = document.getElementById(pid);
      if (el) el.style.display = pid === id ? "" : "none";
    });
  }

  function close() {
    const ov = document.getElementById("approvalOverlay");
    if (ov) ov.classList.remove("open");
    onApprove = null;
    onDeny = null;
  }

  function openOverlay() {
    ensure();
    document.getElementById("approvalOverlay").classList.add("open");
    document.getElementById("apCreateErr").style.display = "none";
    document.getElementById("apEnterErr").style.display = "none";
    document.getElementById("apEnterErr").style.color = "";
    document.getElementById("apEnterErr").style.background = "";
    document.getElementById("apCurrent").value = "";
    document.getElementById("apPin").value = "";
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function applySubmitCopy(opts) {
    opts = opts || {};
    setText(
      "apEnterHint",
      opts.enterHint || "Hand the device to a parent. Type the 6-digit code from email to unlock Approve or Deny."
    );
    setText("apDecideTitle", opts.decideTitle || "Approve this picture?");
    setText("apDecideHint", opts.decideHint || "Code accepted. Choose what happens next.");
    setText(
      "apDeniedHint",
      opts.deniedHint || "A parent asked you to keep drawing. Change your picture, then submit again!"
    );
    setText("apApprove", opts.approveLabel || "Approve ⭐");
    setText("apRetry", opts.retryLabel || "Retry 🎨");
  }

  function setupCreateForm(isChange) {
    const has = !!(LEW.hasApprovalCode && LEW.hasApprovalCode());
    document.getElementById("apCurrentWrap").style.display = isChange ? "" : "none";
    document.getElementById("apCreateTitle").textContent = isChange ? "Change Approval Code" : "Create Approval Code";
    document.getElementById("apCreateHint").textContent = isChange
      ? "Enter the current code from email. We'll email a new one — it won't be shown here. The old code stops working."
      : "We'll email a 6-digit code. That same code stays valid until you change it. It is never shown on this screen.";
    document.getElementById("apSendBtn").textContent = isChange
      ? "Change & email new code"
      : (has ? "Email the same code again" : "Create & email code");
    document.getElementById("apResendWrap").style.display = has && !isChange ? "" : "none";
    document.getElementById("apEmail").value = (LEW.getApprovalEmail && LEW.getApprovalEmail()) || "";
    showPanel("apCreate");
  }

  function showToast(message) {
    let t = document.getElementById("lewToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "lewToast";
      t.className = "lew-toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add("show");
    clearTimeout(showToast._tm);
    showToast._tm = setTimeout(() => t.classList.remove("show"), 3200);
  }

  async function sendAndShow(result, changed) {
    const err = document.getElementById("apCreateErr");
    if (!result || !result.ok) {
      err.style.display = "";
      err.textContent = result && result.reason === "wrong-code"
        ? "That current code isn't right."
        : result && result.reason === "invalid-email"
          ? "Please enter a valid parent email."
          : "Couldn't save the code. Try again.";
      return;
    }
    if (LEW.persistCloudNow) {
      await Promise.race([
        LEW.persistCloudNow(),
        new Promise(res => setTimeout(res, 4000))
      ]);
    }
    const btn = document.getElementById("apSendBtn");
    const prev = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending…";
    const sent = await LEW.sendApprovalCodeEmail({
      email: result.email,
      changed: !!changed
    });
    btn.disabled = false;
    btn.textContent = prev;
    if (!sent.ok) {
      err.style.display = "";
      err.textContent = "Email didn't send. Check your internet and try again.";
      return;
    }
    err.style.display = "none";
    const toastMsg = sent.method === "confirm"
      ? "Check your inbox to confirm, then resend."
      : "The code has been sent.";
    showToast(toastMsg);
    if (mode === "submit") {
      document.getElementById("apPin").value = "";
      document.getElementById("apEnterErr").style.display = "none";
      showPanel("apEnter");
    } else {
      close();
    }
  }

  function tryUnlock() {
    const pin = document.getElementById("apPin").value;
    const err = document.getElementById("apEnterErr");
    if (!LEW.verifyApprovalCode(pin)) {
      err.style.display = "";
      err.style.color = "";
      err.style.background = "";
      err.textContent = "That code isn't right. Ask a parent to try again.";
      return;
    }
    document.getElementById("apPin").value = "";
    err.style.display = "none";
    showPanel("apDecide");
  }

  function wire() {
    document.getElementById("apPin").addEventListener("input", e => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
    });
    document.getElementById("apPin").addEventListener("keydown", e => {
      if (e.key === "Enter") tryUnlock();
    });
    document.getElementById("apCurrent").addEventListener("input", e => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
    });
    document.getElementById("apClose").addEventListener("click", close);
    document.getElementById("approvalOverlay").addEventListener("click", e => {
      if (e.target.id === "approvalOverlay") close();
    });
    document.getElementById("apSendBtn").addEventListener("click", async () => {
      const email = document.getElementById("apEmail").value;
      const current = document.getElementById("apCurrent").value;
      const changing = LEW.hasApprovalCode && LEW.hasApprovalCode() && document.getElementById("apCurrentWrap").style.display !== "none";
      const result = changing
        ? LEW.changeApprovalCode(current, email)
        : LEW.createApprovalCode(email);
      await sendAndShow(result, changing);
    });
    async function resendSame(email) {
      const dest = email || document.getElementById("apEmail").value || (LEW.getApprovalEmail && LEW.getApprovalEmail());
      const saved = LEW.createApprovalCode(dest);
      await sendAndShow(saved, false);
    }
    document.getElementById("apResendBtn").addEventListener("click", () => {
      resendSame(document.getElementById("apEmail").value);
    });
    document.getElementById("apEnterResend").addEventListener("click", async () => {
      const dest = (LEW.getApprovalEmail && LEW.getApprovalEmail()) || "";
      const err = document.getElementById("apEnterErr");
      if (!dest) {
        setupCreateForm(false);
        return;
      }
      err.style.display = "none";
      const sent = await LEW.sendApprovalCodeEmail({ email: dest, changed: false });
      err.style.display = "";
      err.style.color = sent.ok ? "#166534" : "#b91c1c";
      err.style.background = sent.ok ? "#dcfce7" : "#fee2e2";
      err.textContent = sent.ok
        ? (sent.method === "confirm"
          ? "Confirm the first FormSubmit email, then tap Resend again."
          : "Same code sent. Check inbox and spam.")
        : "Email didn't send. Try again.";
      if (sent.ok && sent.method !== "confirm") showToast("The code has been sent.");
    });
    document.getElementById("apCreatedNext").addEventListener("click", () => {
      if (mode === "submit") {
        document.getElementById("apPin").value = "";
        document.getElementById("apEnterErr").style.display = "none";
        showPanel("apEnter");
      } else close();
    });
    document.getElementById("apNeedCreate").addEventListener("click", () => {
      setupCreateForm(!!(LEW.hasApprovalCode && LEW.hasApprovalCode()));
    });
    document.getElementById("apUnlock").addEventListener("click", tryUnlock);
    document.getElementById("apApprove").addEventListener("click", () => {
      const fn = onApprove;
      close();
      if (fn) fn();
    });
    document.getElementById("apDeny").addEventListener("click", () => {
      const fn = onDeny;
      showPanel("apDenied");
      if (fn) fn();
    });
    document.getElementById("apRetry").addEventListener("click", close);
  }

  window.LEW = window.LEW || {};
  window.LEW.showToast = showToast;
  window.LEW.openApprovalSettings = function () {
    mode = "manage";
    onApprove = null;
    onDeny = null;
    openOverlay();
    setupCreateForm(!!(LEW.hasApprovalCode && LEW.hasApprovalCode()));
  };
  window.LEW.openPictureApproval = function (opts) {
    opts = opts || {};
    mode = "submit";
    onApprove = opts.onApprove || null;
    onDeny = opts.onDeny || null;
    openOverlay();
    applySubmitCopy(opts);
    if (LEW.hasApprovalCode && LEW.hasApprovalCode()) showPanel("apEnter");
    else setupCreateForm(false);
  };
})();

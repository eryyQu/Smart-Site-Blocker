// options.js - stores password as SHA-256 hash

const PASSWORD_HASH_KEY = "passwordHash";

// Helper: compute SHA-256 hex digest of a string
async function sha256Hex(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// On first run: if there's no password hash, ask user to set one
(async function ensurePasswordExists() {
  const stored = await chrome.storage.local.get(PASSWORD_HASH_KEY);
  if (!stored[PASSWORD_HASH_KEY]) {
    // ask user to set initial password (synchronously via prompt)
    const pass = prompt("Set a password for Smart Site Blocker:");
    if (pass && pass.length > 0) {
      const hash = await sha256Hex(pass);
      await chrome.storage.local.set({ [PASSWORD_HASH_KEY]: hash });
      console.log("Password hash saved.");
    } else {
      console.log("No password set.");
    }
  }
})();

// Unlock button handler: compare hash(input) with stored hash
document.getElementById("unlock-btn").addEventListener("click", async () => {
  const inputPass = document.getElementById("password-input").value || "";
  const data = await chrome.storage.local.get(PASSWORD_HASH_KEY);
  const storedHash = data[PASSWORD_HASH_KEY];

  if (!storedHash) {
    alert("No password hash found. Please reload the page.");
    return;
  }

  const inputHash = await sha256Hex(inputPass);

  if (inputHash === storedHash) {
    document.getElementById("settings").style.display = "block";
    document.getElementById("password-container").style.display = "none";
    renderBlockedList();
  } else {
    alert("Wrong password!");
  }
});

// Save rule button handler (same logic as before)
document.getElementById("save-btn").addEventListener("click", async () => {
  const domain = document.getElementById("domain-input").value.trim();
  const daysInput = document.getElementById("days-input").value.trim();
  const startTime = document.getElementById("start-time").value;
  const endTime = document.getElementById("end-time").value;
  const repeatDaily = document.getElementById("repeat-daily").checked;

  if (!domain || !startTime || !endTime) {
    alert("Please fill domain, start time, and end time.");
    return;
  }

  const days = daysInput ? daysInput.split(",").map(d => parseInt(d)).filter(n => !Number.isNaN(n)) : [];

  const stored = await chrome.storage.local.get("rules");
  const rules = stored.rules || [];
  rules.push({ domain, days, startTime, endTime, repeatDaily });

  await chrome.storage.local.set({ rules });
  document.getElementById("status").innerText = "✅ Settings saved!";
  renderBlockedList();
});

// Render list of blocked sites with remove buttons
async function renderBlockedList() {
  const data = await chrome.storage.local.get("rules");
  const rules = data.rules || [];
  const list = document.getElementById("blocked-list");
  list.innerHTML = "";

  rules.forEach((rule, index) => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.flexDirection = "column";
    left.style.gap = "4px";

    const title = document.createElement("span");
    title.textContent = rule.domain;
    title.style.fontWeight = "600";

    const meta = document.createElement("span");
    meta.style.fontSize = "0.85rem";
    meta.style.opacity = "0.9";
    meta.textContent = `${rule.startTime} - ${rule.endTime} ${rule.repeatDaily ? "[Daily]" : (rule.days && rule.days.length ? "[Days: " + rule.days.join(",") + "]" : "")}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("div");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌ Remove";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = async () => {
      const updated = rules.filter((_, i) => i !== index);
      await chrome.storage.local.set({ rules: updated });
      renderBlockedList();
    };

    right.appendChild(removeBtn);

    li.appendChild(left);
    li.appendChild(right);
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";

    list.appendChild(li);
  });
}

// Optional: expose a debug function to console to show stored password hash
window.showPasswordHash = async () => {
  const data = await chrome.storage.local.get(PASSWORD_HASH_KEY);
  console.log("Stored password hash:", data[PASSWORD_HASH_KEY]);
};

# 🔒 Smart Site Blocker (Chrome Extension)

A modern Chrome extension to **block websites based on schedule**.  
Features include:
- ⏰ Time-based blocking with hour and minute precision  
- 📅 Repeat daily or select specific days of the week  
- 🔑 Password-protected settings (stored securely as SHA-256 hash)  
- 📋 Manage blocked sites in a simple list (add/remove easily)  
- ✨ Sleek, modern UI (glassmorphism, gradients, animations)  

---

## 📸 Screenshots

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2d082763-2f2d-42f3-91fb-1b58cff68f26" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/571709ac-552a-4c39-9c15-cd91a56e8ca4" />

---

## 🚀 Installation

1. Clone this repository or download it as a `.zip`:
   ```bash
   git clone https://github.com/eryyQu/smart-site-blocker.git

2. Open **Google Chrome** and go to:
`chrome://extensions/`

3. Enable **Developer Mode** (top right).

4. Click **"Load unpacked"** and select the project folder.

5. The extension icon will appear in the toolbar 🚫.

---

## ⚙️ Usage

On first run, you’ll be asked to set a password.
The password is stored as SHA-256 hash, not plain text.

After unlocking, you can:

Enter a domain to block (e.g. facebook.com)

Select specific days (0 = Sunday, 6 = Saturday) or enable Repeat Daily

Set start and end time (e.g. 19:30 → 06:00)

Save your settings ✅

All blocked websites will be listed in the settings page, with an option to remove them.

---

## 🔐 Security

Passwords are stored as SHA-256 hashes in chrome.storage.local.

This means the real password is never saved in plain text.

(Optional enhancement: add salt + PBKDF2 for stronger protection).

---

## 🛠 Tech Stack

Manifest V3 (latest Chrome extension API)

JavaScript (ES6)

HTML5 + CSS3 (modern glassmorphism UI)

Chrome Storage API for persistent rules & settings

Web Crypto API for secure SHA-256 password hashing

---

## 📂 Project Structure
  ```bash
  smart-site-blocker/
  │
  ├─ manifest.json       # Extension config
  ├─ background.js       # Handles blocking logic
  ├─ options.html        # Settings page
  ├─ options.js          # Settings logic + password handling
  ├─ options.css         # Modern UI for settings
  ├─ popup.html          # Quick access popup
  ├─ popup.js            # Popup logic
  └─ popup.css           # Popup styling
```

---

## 💡 Ideas for Future Improvements

  🌐 Sync settings across devices via chrome.storage.sync

  🔔 Notification when a site is blocked

  🧂 Add salt & PBKDF2 to password storage for even stronger security

  📊 Usage statistics / time tracking

  🎨 More themes (dark/light/custom colors)

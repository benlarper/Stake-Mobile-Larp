# 🔐 Stake LARP Engine — Educational Security Research Tool

> **Disclaimer:** This tool is designed for **educational and research purposes only**. It is intended to demonstrate how browser extensions and userscripts can manipulate visual elements on web pages. The code provided here is for learning about web security, browser extensions, and JavaScript injection techniques. **Do not use this tool for any illegal or malicious activities.**

---

## 📚 About This Project

This project is a **security research tool** that demonstrates how browser extensions can modify the visual presentation of a website. It serves as an educational resource for:

- Understanding **Content Security Policy (CSP)** and its limitations
- Learning how **Tampermonkey userscripts** interact with web pages
- Exploring **JavaScript injection techniques** and DOM manipulation
- Understanding **cross-origin resource sharing (CORS)** and fetching remote scripts
---

## 🛡️ What This Tool Demonstrates

| Feature | Educational Purpose |
|---------|---------------------|
| **Currency Conversion** | Shows how displayed values can be modified by client-side scripts |
| **Flag Replacement** | Demonstrates DOM manipulation and SVG injection |
| **Remote Script Loading** | Illustrates how scripts can be loaded from external sources |
| **Mutation Observation** | Shows how scripts can react to dynamic page changes |

---

## 📦 Installation (For Educational Testing)

### Prerequisites

1. **Tampermonkey** browser extension installed
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [iOS App Store](https://apps.apple.com/us/app/tampermonkey/id1482490089) (iOS version available)

### Installation Steps

1. Open your browser and click the Tampermonkey icon.
2. Select **"Create a new script..."**
3. Delete the default template code.
4. Paste the following loader script:

```javascript
// ==UserScript==
// @name         Stake LARP Engine — Educational Research Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Educational tool demonstrating visual manipulation of currency displays on web platforms.
// @author       Bennetceo — Security Research
// @match        *://stake.games/*
// @match        *://stake.com/*
// @match        *://stake.ac/*
// @match        *://*.stake.bet/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://raw.githubusercontent.com/stakecruncher/Stake-LARP-Engine/refs/heads/main/stake-larp.js)
// @run-at       document-start
// ==/UserScript==
```

5. Press **Ctrl+S** (or Cmd+S on Mac) to save.
6. Visit `stake.com` to see the script in action.

---

### Technical Components

```javascript
// 1. Currency Display Conversion
// Replaces ARS symbols with USD equivalents
document.querySelectorAll('*:not(script):not(style)').forEach(el => {
    el.childNodes.forEach(n => {
        if (n.nodeType === 3 && n.nodeValue.includes('ARS')) {
            n.nodeValue = n.nodeValue.replace(/ARS\s*/g, '$');
        }
    });
});

// 2. Flag Replacement
// Replaces Argentina flag SVGs with USA flags
function benSwapFlag() {
    var flags = document.querySelectorAll('svg[data-ds-icon="ArgentinaFlag"]');
    // ... SVG replacement logic
}

// 3. Real-time Mutation Observation
// Watches for dynamic changes and applies modifications
new MutationObserver(function() {
    benSwapFlag();
    ben_larp();
}).observe(document.body, { childList: true, subtree: true });
```
---

## 🔒 Responsible Use Guidelines

### ✅ Acceptable Use

- Learning about web security and browser extensions
- Understanding how CSP and CORS work
- Testing on your own accounts for educational purposes
- Security research and vulnerability analysis
- Teaching others about client-side security risks

---

## 📖 Technical Documentation

### How the Remote Loader Works

```
┌─────────────────────────────────────────────────────────────┐
│  Tampermonkey Script (Loader)                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  @require https://raw.githubusercontent.com/.../     │ │
│  │  stake-larp.js                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                         │                                   │
│                         ▼                                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  GitHub Raw (stake-larp.js)                          │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Obfuscated LARP Engine Code                    │ │ │
│  │  │  - Flag Changer                                 │ │ │
│  │  │  - Currency Converter                           │ │ │
│  │  │  - Mutation Observers                           │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
│                         │                                   │
│                         ▼                                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Web Page (stake.com)                                │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Modified Display                               │ │ │
│  │  │  - ARS → USD                                   │ │ │
│  │  │  - Argentina → USA flags                       │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```


## ⚠️ Final Disclaimer

> **IMPORTANT:** This tool is provided for **educational purposes only**. The author is not responsible for any misuse, damage, or legal consequences arising from the use of this software. Use at your own risk and always comply with applicable laws and terms of service.

---

## 📚 Further Reading

- [Content Security Policy (CSP) Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
- [JavaScript Obfuscation Techniques](https://obfuscator.io/)
- [Web Security Best Practices](https://owasp.org/)

---

**Built for educational research. Learn, understand, and stay safe online.** 🔒

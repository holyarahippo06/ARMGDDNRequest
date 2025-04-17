// ==UserScript==
// @name         ARMGDDN Request
// @namespace    https://github.com/holyarahippo06/ARMGDDNRequest
// @version      2.7.3
// @description  Game Request Form for ARMGDDN Games on Steam and Alyx Workshop Mods
// @author       ARMGDDN Games
// @updateURL    https://github.com/holyarahippo06/ARMGDDNRequest/blob/main/ARMGDDNRequest.user.js?raw=true
// @downloadURL  https://github.com/holyarahippo06/ARMGDDNRequest/blob/main/ARMGDDNRequest.user.js?raw=true
// @match        *://store.steampowered.com/app/*
// @match        *://steamcommunity.com/sharedfiles/filedetails/*
// @grant        GM_xmlhttpRequest
// @icon         https://lemmy.dbzer0.com/pictrs/image/67148ef4-6e17-4bfd-9151-355333c6a5e1.png
// @connect      rentry.co
// @connect      docs.google.com
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = (() => {
        const hexToString = hexArray => hexArray.map(c => String.fromCharCode(c)).join('');

        return {
            DENUVO_MESSAGE: "This Game has Denuvo Anti-Temper and cannot be requested.",
            KLA_MESSAGE: "This Game has Kernel Level Anti-Cheat and cannot be requested.",
            ROCKSTAR_MESSAGE: "This Game has Rockstar's DRM and cannot be requested.",
            SECUROM_MESSAGE: "This Game has SecuROM DRM and cannot be requested.",
            NOTSINGLEPLAYER_MESSAGE: "This Game is Online-Only and cannot be requested.",
            ISFREE_MESSAGE: "This Game is free... Why'd you request this?",
            EARLY_MESSAGE: "This Game is not requestable. Wait until it has been released to request it.",
            DLC_MESSAGE: "DLCs are unrequestable. All available and to-be-added games come with DLCs, if the version we have was released after the DLC.",
            LATEST_VERSION_MESSAGE: "This Game is already on the latest version on the server. No update needed.",
            CACHE_ERROR_MESSAGE: "Failed to load required data. Ensure you can access rentry.co then please refresh this page. Contact support if this issue continues: https://t.me/ARMGDDNGames",
            FORM_CONTAINER_ID: "steam-request-helper",
            TELEGRAM_INPUT_ID: "srh-telegram-input",
            SUBMIT_BUTTON_ID: "srh-submit-button",
            MESSAGE_AREA_ID: "srh-message-area",
            ERROR_CONTAINER_ID: "srh-error-container",
            RENTRY_AUTH_TOKEN: hexToString([0x37,0x34,0x63,0x61,0x37,0x66,0x31,0x65,0x62,0x36,0x37,0x34,0x63,0x32,0x35,0x64,0x33,0x32,0x65,0x64,0x33,0x63,0x33,0x66]),
            GOOGLE_FORMS_URL: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x64,0x6f,0x63,0x73,0x2e,0x67,0x6f,0x6f,0x67,0x6c,0x65,0x2e,0x63,0x6f,0x6d,0x2f,0x66,0x6f,0x72,0x6d,0x73,0x2f,0x64,0x2f,0x65,0x2f,0x31,0x46,0x41,0x49,0x70,0x51,0x4c,0x53,0x65,0x62,0x59,0x4f,0x44,0x48,0x74,0x49,0x43,0x35,0x6a,0x45,0x77,0x67,0x6f,0x69,0x38,0x79,0x56,0x56,0x53,0x6f,0x6c,0x35,0x48,0x65,0x37,0x62,0x79,0x5a,0x4e,0x61,0x51,0x6b,0x34,0x71,0x64,0x44,0x4c,0x49,0x4e,0x4d,0x7a,0x66,0x66,0x6d,0x55,0x51,0x2f,0x66,0x6f,0x72,0x6d,0x52,0x65,0x73,0x70,0x6f,0x6e,0x73,0x65]),
            RENTRY_URLS: {
                PC: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x72,0x65,0x6e,0x74,0x72,0x79,0x2e,0x63,0x6f,0x2f,0x63,0x75,0x72,0x72,0x65,0x6e,0x74,0x73,0x65,0x72,0x76,0x65,0x72,0x70,0x63,0x2f,0x72,0x61,0x77]),
                PCVR: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x72,0x65,0x6e,0x74,0x72,0x79,0x2e,0x63,0x6f,0x2f,0x63,0x75,0x72,0x72,0x65,0x6e,0x74,0x73,0x65,0x72,0x76,0x65,0x72,0x70,0x63,0x76,0x72,0x2f,0x72,0x61,0x77]),
                PC_UPDATES: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x72,0x65,0x6e,0x74,0x72,0x79,0x2e,0x63,0x6f,0x2f,0x75,0x70,0x64,0x61,0x74,0x65,0x70,0x63,0x2f,0x72,0x61,0x77]),
                PCVR_UPDATES: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x72,0x65,0x6e,0x74,0x72,0x79,0x2e,0x63,0x6f,0x2f,0x75,0x70,0x64,0x61,0x74,0x65,0x70,0x63,0x76,0x72,0x2f,0x72,0x61,0x77]),
                BLOCKED: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x72,0x65,0x6e,0x74,0x72,0x79,0x2e,0x63,0x6f,0x2f,0x61,0x67,0x72,0x62,0x6c,0x2f,0x72,0x61,0x77])
            },
            FORM_FIELDS: {
                telegram: "entry.1070598941",
                gameTitle: "entry.710747250",
                category: "entry.1983323798",
                gameUrl: "entry.423482615",
                status: "entry.1581471918",
                infos: "entry.1510033831"
            },
            STYLES: `
                #steam-request-helper {
                    border: 1px solid #5a5a5a;
                    background-color: #2a2a2a;
                    padding: 15px;
                    margin-top: 20px;
                    color: #c7d5e0;
                    border-radius: 5px;
                    font-family: Arial, Helvetica, sans-serif;
                }
                #steam-request-helper h3 {
                    margin-top: 0;
                    color: #66c0f4;
                    border-bottom: 1px solid #5a5a5a;
                    padding-bottom: 5px;
                }
                #steam-request-helper .game-status {
                    margin-bottom: 15px;
                    padding: 10px;
                    background-color: rgba(102, 192, 244, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                #steam-request-helper input[type="text"] {
                    width: 95%;
                    padding: 8px;
                    margin-bottom: 10px;
                    background-color: #3a3a3a;
                    border: 1px solid #5a5a5a;
                    color: #c7d5e0;
                    border-radius: 3px;
                }
                #steam-request-helper button {
                    background-color: #66c0f4;
                    color: #ffffff;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-weight: bold;
                }
                #steam-request-helper .denuvo-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .kla-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .rockstar-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .securom-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .notsingleplayer-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .free-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .early-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .latest-version-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .game-blocked {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                }
                #steam-request-helper .error-message {
                    color: #ff4d4d;
                    font-size: 0.9em;
                    margin-top: 10px;
                }
                #srh-error-container .error-message {
                    color: #ff4d4d;
                    font-weight: bold;
                    padding: 10px;
                    background-color: rgba(255, 77, 77, 0.1);
                    border-radius: 3px;
                    margin: 10px 0;
                }
                #clear-cache-button {
                    border: 1px solid #5a5a5a;
                    background-color: #2a2a2a;
                    padding: 15px;
                    position: absolute;
                    bottom: 0;
                    z-index: 9999;
                    margin-top: 20px;
                    color: #c7d5e0;
                    border-radius: 5px;
                    font-family: Arial, Helvetica, sans-serif;
                    cursor: pointer;
                    display: none; /* Initially hidden */
                }
                #steam-request-helper .success-message {
                    color: #7edc7e;
                    font-size: 0.9em;
                    margin-top: 10px;
                }
                .build-id-link {
                    color: #66c0f4;
                    text-decoration: none;
                }
                .build-id-link:hover {
                    text-decoration: underline;
                }
            `
        };
    })();

    // Cache System
    const RentryCache = {
        get: (url) => {
            const key = `rentry_${btoa(url)}`;
            const cached = localStorage.getItem(key);
            if (!cached) {
                console.log(`AGRequests: No cache found for ${url.length}`);
                return null;
            }
            const { data, timestamp } = JSON.parse(cached);
            const isExpired = Date.now() - timestamp >= 21600000;  // 6-hour cache
            console.log(`AGRequests: Cache ${url.length} - ${isExpired ? "Expired" : "Valid"}`);
            return isExpired ? null : data;
        },
        set: (url, data) => {
            const key = `rentry_${btoa(url)}`;
            localStorage.setItem(key, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
            console.log(`AGRequests: Caching ${url.length}`);
        },
        clear: (url) => {
            const key = `rentry_${btoa(url)}`;
            localStorage.removeItem(key);
            console.log(`AGRequests: Cache cleared for ${url.length}`);
        }
    };

    const activeRequests = new Map();

    async function cachedFetchWithRetry(url, retries = 3) {
        // Return cached data if available
        const cached = RentryCache.get(url);
        if (cached) return cached;

        // Dedupe simultaneous requests
        if (activeRequests.has(url)) {
            console.log(`AGRequests: Returning existing request for ${url.length}`);
            return activeRequests.get(url);
        }

        const fetchPromise = new Promise(async (resolve, reject) => {
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    const response = await new Promise((innerResolve, innerReject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url,
                            headers: { "rentry-auth": CONFIG.RENTRY_AUTH_TOKEN },
                            onload: res => res.status === 200 ? innerResolve(res.responseText) : innerReject(res.status),
                            onerror: innerReject
                        });
                    });

                    RentryCache.set(url, response);
                    resolve(response);
                    return;
                } catch (error) {
                    console.error(`Attempt ${attempt} failed for ${url.length}`);
                    if (attempt === retries) {
                        RentryCache.clear(url);
                        reject(new Error(`All fetch attempts failed for ${url.length}`));
                    }
                    await new Promise(r => setTimeout(r, 2000 * attempt));
                }
            }
        });

        activeRequests.set(url, fetchPromise);
        fetchPromise.finally(() => activeRequests.delete(url));

        return fetchPromise;
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = CONFIG.STYLES;
    document.head.appendChild(style);

    // Helper functions
    function showBlockedMessage(message, classname) {
        const container = document.createElement('div');
        container.id = CONFIG.FORM_CONTAINER_ID;
        container.innerHTML = `<div class="${classname}">${message}</div>`;
        document.querySelector('.game_area_purchase, .game_area_purchase_game')?.before(container);
    }

    function hasDRM(keyword) {
        const drmNotices = document.querySelectorAll('.DRM_notice');
        return Array.from(drmNotices).some(notice =>
            notice.textContent.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    function hasSP() {
        const singlePlayerIcons = document.querySelectorAll('.category_icon[src*="ico_singlePlayer.png"]');
        return singlePlayerIcons.length > 0;
    }

    function isFreeGame() {
        return !!document.getElementById('freeGameBtn');
    }

    function isDLC() {
        return !!document.querySelector('.game_area_dlc_bubble');
    }

    function isNotReleased() {
        const element = document.querySelector(".game_area_comingsoon");
        return element && element.querySelector(".not_yet") !== null;
    }

    function isVRGame(appID, pcvrList) {
        const vrIcons = document.querySelectorAll('.category_icon[src*="ico_vr_support.png"]');
        const vrTag = document.querySelector('.app_tag[href="https://store.steampowered.com/tags/en/VR/?snr=1_5_9__409"]')
        const vrStatus = (!!vrIcons.length > 0 || !!vrTag);

        if (!vrStatus) {
            const data = JSON.parse(pcvrList);
            return !!data.find(item => String(item.appid) === String(appID));
        }
        return vrStatus
    }

    function getGameTitle() {
        if (window.location.href.includes('steamcommunity.com/sharedfiles/filedetails')) {
            const titleElement = document.querySelector('.workshopItemTitle');
            return titleElement?.textContent.trim() || "Unknown Workshop Item";
        }

        const breadcrumbTitle = document.querySelector('.breadcrumbs .blockbg a:last-child span[itemprop="name"]');
        if (breadcrumbTitle) return breadcrumbTitle.textContent.trim();

        const titleElement = document.getElementById('appHubAppName');
        return titleElement?.textContent.trim() || "Unknown Title";
    }

    function isAlyxWorkshopPage() {
        if (!window.location.href.includes('steamcommunity.com/sharedfiles/filedetails')) {
            return false;
        }

        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (!breadcrumbs) return false;

        const alyxLink = Array.from(breadcrumbs.querySelectorAll('a')).find(a =>
            a.href === 'https://steamcommunity.com/app/546560' ||
            a.href === 'http://steamcommunity.com/app/546560'
        );

        return !!alyxLink;
    }

    function checkBlockedList(blockedList) {
        const gameTitle = getGameTitle();
        const gameTitleLow = gameTitle.toLowerCase()

        try {
            const blockedEntries = blockedList.split('\n').filter(e => e.trim());

            const isBlocked = blockedEntries.some(entry => {
                const cleanEntry = entry.trim().toLowerCase();

                if (cleanEntry.startsWith('^') && cleanEntry.endsWith('$')) {
                    const exactMatch = cleanEntry.slice(1, -1);
                    return gameTitleLow === exactMatch;
                }

                return gameTitleLow.includes(cleanEntry);
            });

            return {
                isBlocked,
                gameTitle: gameTitle,
                message: isBlocked
                    ? `"${gameTitle}" is blocked from requests`
                    : `"${gameTitle}" is not blocked`
            };
        } catch (error) {
            console.error("Blocked list check failed:", error);
            return {
                isBlocked: false,
                gameTitle: gameTitle,
                message: "Block list unavailable - allowing submission"
            };
        }
    }

    function getAppId() {
        if (window.location.href.includes('steamcommunity.com/sharedfiles/filedetails')) {
            return '546560'; // Hardcoded for Alyx workshop items
        }

        const match = window.location.href.match(/app\/(\d+)/);
        return match ? match[1] : null;
    }

    function validateTelegramHandle(handle) {
        if (!handle) return "Telegram @ cannot be empty";
        if (!handle.startsWith('@')) return "Must start with @";
        if (handle.length < 2) return "Too short";
        return null;
    }

    function checkGameStatus(appId, isVR, pcList, pcvrList) {
        try {
            const targetList = isVR ? pcvrList : pcList;
            const data = JSON.parse(targetList);
            return data.find(item => String(item.appid) === String(appId)) || null;
        } catch (error) {
            console.error("Game status check failed:", error);
            return null;
        }
    }

    function checkGameUpdates(isVR, gameEntry, pcUpdateList, pcvrUpdateList) {
        try {
            const updateList = isVR ? pcvrUpdateList : pcUpdateList;
            if (!updateList || !gameEntry?.foldername) return false;

            // Extract build ID from the game entry (format is usually "v12345678")
            const currentBuildId = gameEntry.foldername.match(/v(\d+)/)?.[1];
            if (!currentBuildId) return false;

            // Check if any update entry contains this build ID
            const updateEntries = updateList.split('\n').filter(e => e.trim());
            return updateEntries.some(entry => {
                // Update entries format: "Game Name v12345678 -ARMGDDN"
                const updateBuildId = entry.match(/v(\d+)/)?.[1];
                return updateBuildId === currentBuildId;
            });
        } catch (error) {
            console.error("Game update check failed:", error);
            return false;
        }
    }

    async function submitToGoogleForms(formData) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: CONFIG.GOOGLE_FORMS_URL,
                data: formData.toString(),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    if (response.status === 200 || response.status === 0) {
                        resolve(true);
                    } else {
                        reject(new Error(`Form submission failed with status ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function createForm(type, category, title, statusMessage, gameEntry, isVR) {
        const container = document.createElement('div');
        container.id = CONFIG.FORM_CONTAINER_ID;

        container.innerHTML = `
            <h3>ARMGDDN ${type} Request</h3>
            <div class="game-status">
                <strong>${type === "Game" ? "Game" : "Mod"}:</strong> ${title}<br>
                <strong>Category:</strong> ${category}<br>
                ${type === "Game" ? `<strong>Status:</strong> ${statusMessage}` : ""}
            </div>
            <label for="${CONFIG.TELEGRAM_INPUT_ID}">Telegram @:</label>
            <input type="text" id="${CONFIG.TELEGRAM_INPUT_ID}" placeholder="@YourUsername">
            <button id="${CONFIG.SUBMIT_BUTTON_ID}">Submit Request</button>
            <div id="${CONFIG.MESSAGE_AREA_ID}"></div>
        `;

        document.querySelector('.game_area_purchase, .game_area_purchase_game')?.before(container);

        const telegramInput = document.getElementById(CONFIG.TELEGRAM_INPUT_ID);
        const submitButton = document.getElementById(CONFIG.SUBMIT_BUTTON_ID);
        const messageArea = document.getElementById(CONFIG.MESSAGE_AREA_ID);

        function updateSubmitButton() {
            submitButton.disabled = !!validateTelegramHandle(telegramInput.value);
        }

        telegramInput.addEventListener('input', () => {
            const error = validateTelegramHandle(telegramInput.value);
            messageArea.textContent = error || '';
            messageArea.className = error ? 'error-message' : '';
            updateSubmitButton();
        });

        submitButton.addEventListener('click', async () => {
            const telegramHandle = telegramInput.value.trim();
            const error = validateTelegramHandle(telegramHandle);

            if (error) {
                messageArea.textContent = error;
                messageArea.className = 'error-message';
                return;
            }

            submitButton.disabled = true;
            messageArea.textContent = "Submitting...";

            try {
                const formData = new URLSearchParams();
                formData.append(CONFIG.FORM_FIELDS.telegram, telegramHandle);
                formData.append(CONFIG.FORM_FIELDS.gameTitle, title);
                formData.append(CONFIG.FORM_FIELDS.category, type !== "Game" ? "Alyx Mod" : isVR ? "PCVR" : "PC");
                formData.append(CONFIG.FORM_FIELDS.gameUrl, type === "Game" ? window.location.href.split('?')[0] : window.location.href);
                formData.append(CONFIG.FORM_FIELDS.status, type !== "Game" ? 'Unable to check' : gameEntry ? 'Already on server, but needs an update' : 'New to server');
                formData.append(CONFIG.FORM_FIELDS.infos, 'I am abusing the system.');
                await submitToGoogleForms(formData);
                messageArea.textContent = "✓ Request submitted successfully!";
                messageArea.className = 'success-message';
                telegramInput.value = '';
            } catch (error) {
                console.error("Submission error:", error);
                messageArea.textContent = "Failed to submit request. Please try again later.";
                messageArea.className = 'error-message';
            } finally {
                submitButton.disabled = false;
            }
        });

        updateSubmitButton();
    }

    // Main function
    async function initRequestForm() {
        console.log("AGRequests: Initializing request form...");

        if (document.getElementById(CONFIG.FORM_CONTAINER_ID)) {
            console.log("AGRequests: Form already exists - aborting...");
            return;
        }

        if (document.getElementById(CONFIG.ERROR_CONTAINER_ID)) {
            existingError = document.getElementById(CONFIG.ERROR_CONTAINER_ID);
            existingError.remove();
            console.log("AGRequests: Removed previous error container...");
        }

        async function loadCriticalData() {
            try {
                return await Promise.all([
                    cachedFetchWithRetry(CONFIG.RENTRY_URLS.BLOCKED),
                    cachedFetchWithRetry(CONFIG.RENTRY_URLS.PC),
                    cachedFetchWithRetry(CONFIG.RENTRY_URLS.PCVR),
                    cachedFetchWithRetry(CONFIG.RENTRY_URLS.PC_UPDATES),
                    cachedFetchWithRetry(CONFIG.RENTRY_URLS.PCVR_UPDATES),
                ]);
            } catch (error) {
                console.error("AGRequests: Required cache load failed...");
                throw error;
            }
        }

        try {
            const [blockedList, pcList, pcvrList, pcUpdateList, pcvrUpdateList] = await loadCriticalData()

            console.log("AGRequests: Required cache ready, proceeding with form creation...");

            const targetContainer = await waitForFormContainer();
            if (!targetContainer) {
                console.error("AGRequests: Target container not found after 6 seconds...");
                return;
            }

            // Create and add "Clear Cache" button, useful for testing, placed at bottom of page so most normal users won't notice it anyway - bp
            const clearCacheButton = document.createElement('button');
            clearCacheButton.id = 'clear-cache-button';
            clearCacheButton.textContent = "Clear Cache";

            if (document.body) {
                document.body.appendChild(clearCacheButton);

                window.addEventListener('scroll', () => {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight;
                    const clientHeight = document.documentElement.clientHeight;

                    // Show button only when scrolled near the bottom
                    if (scrollTop + clientHeight >= scrollHeight - 50) {
                        clearCacheButton.style.display = 'block';
                    } else {
                        clearCacheButton.style.display = 'none';
                    }
                });
            } else {
                console.error("AGRequests: Document body not found!");
            }

            clearCacheButton.addEventListener('click', () => {
                if (confirm("Are you sure you want to clear all Rentry cache?")) {
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith("rentry_")) {
                            localStorage.removeItem(key);
                        }
                    }

                    alert("Rentry cache cleared successfully!");
                    location.reload();
                }
            });

            const appId = getAppId();
            if (!appId) throw Error("AGRequests: No AppID found!");

            const blockCheck = checkBlockedList(blockedList);

            if (blockCheck.isBlocked) {
                showBlockedMessage(blockCheck.message, "game-blocked");
                return;
            }

            // Special handling for Alyx workshop pages
            if (isAlyxWorkshopPage()) {
                createForm("Alyx Mod", "Alyx Mods", blockCheck.gameTitle);
                return;
            }

            // Original store page handling
            if (hasDRM('denuvo')) {
                showBlockedMessage(CONFIG.DENUVO_MESSAGE, "denuvo-blocked");
                return;
            }

            if (hasDRM('kernel level anti-cheat')) {
                showBlockedMessage(CONFIG.KLA_MESSAGE, "kla-blocked");
                return;
            }

            if (hasDRM('rockstar games')) {
                showBlockedMessage(CONFIG.ROCKSTAR_MESSAGE, "rockstar-blocked");
                return;
            }

            if (hasDRM('securom')) {
                showBlockedMessage(CONFIG.SECUROM_MESSAGE, "securom-blocked");
                return;
            }

            if (!hasSP()) {
                showBlockedMessage(CONFIG.NOTSINGLEPLAYER_MESSAGE, "notsingleplayer-blocked");
                return;
            }

            if (isFreeGame()) {
                showBlockedMessage(CONFIG.ISFREE_MESSAGE, "free-blocked");
                return;
            }

            if (isNotReleased()) {
                showBlockedMessage(CONFIG.EARLY_MESSAGE, "early-blocked");
                return;
            }

            if (isDLC()) {
                showBlockedMessage(CONFIG.DLC_MESSAGE, "early-blocked");
                return;
            }

            const isVR = isVRGame(appId, pcvrList);
            const gameTitle = blockCheck.gameTitle
            const gameEntry = await checkGameStatus(appId, isVR, pcList, pcvrList);

            // If game is on server, check if it's in the updates list
            if (gameEntry) {
                const needsUpdate = await checkGameUpdates(isVR, gameEntry, pcUpdateList, pcvrUpdateList);
                if (!needsUpdate) {
                    showBlockedMessage(CONFIG.LATEST_VERSION_MESSAGE, "latest-version-blocked");
                    return;
                }
            }

            const container = document.createElement('div');
            container.id = CONFIG.FORM_CONTAINER_ID;

            const buildId = gameEntry?.foldername.match(/v(\d+)/)?.[1];
            const statusMessage = gameEntry
                ? `Already on server (Current version: <a href="https://steamdb.info/patchnotes/${buildId}" target="_blank" class="build-id-link">${buildId}</a>)`
                : "New to server";

            createForm("Game", isVR ? 'PCVR' : 'PC', blockCheck.gameTitle, statusMessage, gameEntry, isVR);
            return
        } catch (error) {
            console.error("AGRequests:", error);
            const errorContainer = document.createElement('div');
            errorContainer.id = CONFIG.ERROR_CONTAINER_ID;
            errorContainer.innerHTML = `<div class="error-message">${CONFIG.CACHE_ERROR_MESSAGE}</div>`;
            document.querySelector('.game_area_purchase, .game_area_purchase_game')?.before(errorContainer);
        }
    }

    function waitForFormContainer() {
        return new Promise((resolve) => {
            const MAX_CHECKS = 20;
            let checks = 0;

            const interval = setInterval(() => {
                const container = document.querySelector('.game_area_purchase, .game_area_purchase_game');
                if (container && !document.getElementById(CONFIG.FORM_CONTAINER_ID)) {
                    clearInterval(interval);
                    resolve(container);
                } else if (checks++ >= MAX_CHECKS) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 300);
        });
    }

    // Initialize
    if (document.readyState === 'complete') {
        initRequestForm();
    } else {
        window.addEventListener('load', initRequestForm);
    }
})();

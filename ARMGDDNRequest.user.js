// ==UserScript==
// @name         ARMGDDN Request
// @namespace    https://github.com/holyarahippo06/ARMGDDNRequest
// @version      2.6.2
// @description  Game Request Form for ARMGDDN Games on Steam
// @author       ARMGDDN Games
// @updateURL    https://github.com/holyarahippo06/ARMGDDNRequest/blob/main/ARMGDDNRequest.user.js?raw=true
// @downloadURL  https://github.com/holyarahippo06/ARMGDDNRequest/blob/main/ARMGDDNRequest.user.js?raw=true
// @match        *://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @icon         https://lemmy.dbzer0.com/pictrs/image/67148ef4-6e17-4bfd-9151-355333c6a5e1.png
// @connect      rentry.co
// @connect      docs.google.com
// ==/UserScript==

(function() {
    'use strict';

    // Obfuscated configuration
    const CONFIG = (() => {
        const hexToString = hexArray => hexArray.map(c => String.fromCharCode(c)).join('');

        return {
            DENUVO_MESSAGE: "This Game has Denuvo Anti-Temper and cannot be requested.",
            FORM_CONTAINER_ID: "steam-request-helper",
            TELEGRAM_INPUT_ID: "srh-telegram-input",
            SUBMIT_BUTTON_ID: "srh-submit-button",
            MESSAGE_AREA_ID: "srh-message-area",
            RENTRY_AUTH_TOKEN: hexToString([0x37,0x34,0x63,0x61,0x37,0x66,0x31,0x65,0x62,0x36,0x37,0x34,0x63,0x32,0x35,0x64,0x33,0x32,0x65,0x64,0x33,0x63,0x33,0x66]),
            GOOGLE_FORMS_URL: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x64,0x6f,0x63,0x73,0x2e,0x67,0x6f,0x6f,0x67,0x6c,0x65,0x2e,0x63,0x6f,0x6d,0x2f,0x66,0x6f,0x72,0x6d,0x73,0x2f,0x64,0x2f,0x65,0x2f,0x31,0x46,0x41,0x49,0x70,0x51,0x4c,0x53,0x65,0x62,0x59,0x4f,0x44,0x48,0x74,0x49,0x43,0x35,0x6a,0x45,0x77,0x67,0x6f,0x69,0x38,0x79,0x56,0x56,0x53,0x6f,0x6c,0x35,0x48,0x65,0x37,0x62,0x79,0x5a,0x4e,0x61,0x51,0x6b,0x34,0x71,0x64,0x44,0x4c,0x49,0x4e,0x4d,0x7a,0x66,0x66,0x6d,0x55,0x51,0x2f,0x66,0x6f,0x72,0x6d,0x52,0x65,0x73,0x70,0x6f,0x6e,0x73,0x65]),
            RENTRY_URLS: {
                PC: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x72,0x65,0x6e,0x74,0x72,0x79,0x2e,0x63,0x6f,0x2f,0x63,0x75,0x72,0x72,0x65,0x6e,0x74,0x73,0x65,0x72,0x76,0x65,0x72,0x70,0x63,0x2f,0x72,0x61,0x77]),
                PCVR: hexToString([0x68,0x74,0x74,0x70,0x73,0x3a,0x2f,0x2f,0x72,0x65,0x6e,0x74,0x72,0x79,0x2e,0x63,0x6f,0x2f,0x63,0x75,0x72,0x72,0x65,0x6e,0x74,0x73,0x65,0x72,0x76,0x65,0x72,0x70,0x63,0x76,0x72,0x2f,0x72,0x61,0x77])
            },
            FORM_FIELDS: {
                telegram: "entry.1070598941",
                gameTitle: "entry.710747250",
                category: "entry.1983323798",
                gameUrl: "entry.423482615",
                status: "entry.1581471918"
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
                #steam-request-helper .error-message {
                    color: #ff4d4d;
                    font-size: 0.9em;
                    margin-top: 10px;
                }
                #steam-request-helper .success-message {
                    color: #7edc7e;
                    font-size: 0.9em;
                    margin-top: 10px;
                }
            `
        };
    })();

    // Add styles
    const style = document.createElement('style');
    style.textContent = CONFIG.STYLES;
    document.head.appendChild(style);

    // Helper functions
    function hasDenuvo() {
        const drmNotices = document.querySelectorAll('.DRM_notice');
        return Array.from(drmNotices).some(notice =>
            notice.textContent.toLowerCase().includes('denuvo')
        );
    }

    function isVROnlyGame() {
        const vrLabels = document.querySelectorAll('.game_area_details_specs_ctn .label');
        return Array.from(vrLabels).some(label =>
            label.textContent.trim() === 'VR Only'
        );
    }

    function getGameTitle() {
        // New reliable method using breadcrumb
        const titleElement = document.querySelector('#tabletGrid > div.page_content_ctn > div.page_title_area.game_title_area.page_content > div.breadcrumbs > div.blockbg > a:nth-child(3) > span');
        return titleElement?.textContent.trim() ||
               document.getElementById('appHubAppName')?.textContent.trim() ||
               "Unknown Title";
    }

    function getAppId() {
        const match = window.location.href.match(/app\/(\d+)/);
        return match ? match[1] : null;
    }

    function validateTelegramHandle(handle) {
        if (!handle) return "Telegram @ cannot be empty";
        if (!handle.startsWith('@')) return "Must start with @";
        if (handle.length < 2) return "Too short";
        return null;
    }

    async function checkGameStatus(appId, isVR) {
        const url = isVR ? CONFIG.RENTRY_URLS.PCVR : CONFIG.RENTRY_URLS.PC;

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "rentry-auth": CONFIG.RENTRY_AUTH_TOKEN },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const gameEntry = data.find(item => String(item.appid) === String(appId));
                        resolve(gameEntry || null);
                    } catch (e) {
                        console.error("Error parsing rentry data:", e);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error("Error fetching rentry data:", error);
                    resolve(null);
                }
            });
        });
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

    // Main function
    async function initRequestForm() {
        if (document.getElementById(CONFIG.FORM_CONTAINER_ID)) return;

        const appId = getAppId();
        if (!appId) return;

        if (hasDenuvo()) {
            const container = document.createElement('div');
            container.id = CONFIG.FORM_CONTAINER_ID;
            container.innerHTML = `<div class="denuvo-blocked">${CONFIG.DENUVO_MESSAGE}</div>`;
            document.querySelector('.game_area_purchase')?.after(container);
            return;
        }

        const isVR = isVROnlyGame();
        const gameEntry = await checkGameStatus(appId, isVR);

        const container = document.createElement('div');
        container.id = CONFIG.FORM_CONTAINER_ID;

        // Show build ID to user but don't submit it
        const buildId = gameEntry?.foldername.match(/v(\d+)/)?.[1];
        const statusMessage = gameEntry
            ? `Already on server (Current version: <a href="https://steamdb.info/patchnotes/${buildId}" target="_blank" class="build-id-link">${buildId}</a>)`
            : "New to server";

        // Add this to your STYLES:
        const buildIdLinkStyles = `
            .build-id-link {
                color: #66c0f4;
                text-decoration: none;
            }
            .build-id-link:hover {
                text-decoration: underline;
            }
        `;

        container.innerHTML = `
            <style>${buildIdLinkStyles}</style>
            <h3>ARMGDDN Game Request</h3>
            <div class="game-status">
                <strong>Game:</strong> ${getGameTitle()}<br>
                <strong>Category:</strong> ${isVR ? 'PCVR' : 'PC'}<br>
                <strong>Status:</strong> ${statusMessage}
            </div>
            <label for="${CONFIG.TELEGRAM_INPUT_ID}">Telegram @:</label>
            <input type="text" id="${CONFIG.TELEGRAM_INPUT_ID}" placeholder="@YourUsername">
            <button id="${CONFIG.SUBMIT_BUTTON_ID}">Submit Request</button>
            <div id="${CONFIG.MESSAGE_AREA_ID}"></div>
        `;

        document.querySelector('.game_area_purchase')?.after(container);

        // Form handling
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
            messageArea.className = '';

            try {
                const formData = new URLSearchParams();
                formData.append(CONFIG.FORM_FIELDS.telegram, telegramHandle);
                formData.append(CONFIG.FORM_FIELDS.gameTitle, getGameTitle());
                formData.append(CONFIG.FORM_FIELDS.category, isVR ? 'PCVR' : 'PC');
                formData.append(CONFIG.FORM_FIELDS.gameUrl, window.location.href.split('?')[0]);
                formData.append(CONFIG.FORM_FIELDS.status, gameEntry ? 'Already on server, but needs an update' : 'New to server');

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

    // Initialize
    if (document.readyState === 'complete') {
        initRequestForm();
    } else {
        window.addEventListener('load', initRequestForm);
    }
})();

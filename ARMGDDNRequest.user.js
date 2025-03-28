// ==UserScript==
// @name         ARMGDDN Request
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Game Request Form for ARMGDDN Games on Steam
// @author       ARMGDDN Games
// @match        *://store.steampowered.com/app/*
// @grant        none
// @icon         https://store.steampowered.com/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // Obfuscated URL construction
    const googleFormsUrl = (() => {
        const segments = [
            [0x68, 0x74, 0x74, 0x70, 0x73, 0x3a, 0x2f, 0x2f],  
            [0x64, 0x6f, 0x63, 0x73, 0x2e, 0x67, 0x6f, 0x6f],   
            [0x67, 0x6c, 0x65, 0x2e, 0x63, 0x6f, 0x6d, 0x2f],   
            [0x66, 0x6f, 0x72, 0x6d, 0x73, 0x2f, 0x64, 0x2f],   
            [0x65, 0x2f],                                       
            [0x31, 0x46, 0x41, 0x49, 0x70, 0x51, 0x4c, 0x53],   
            [0x65, 0x62, 0x59, 0x4f, 0x44, 0x48, 0x74, 0x49],   
            [0x43, 0x35, 0x6a, 0x45, 0x77, 0x67, 0x6f, 0x69],   
            [0x38, 0x79, 0x56, 0x56, 0x53, 0x6f, 0x6c, 0x35],   
            [0x48, 0x65, 0x37, 0x62, 0x79, 0x5a, 0x4e, 0x61],   
            [0x51, 0x6b, 0x34, 0x71, 0x64, 0x44, 0x4c, 0x49],   
            [0x4e, 0x4d, 0x7a, 0x66, 0x66, 0x6d, 0x55, 0x51],   
            [0x2f, 0x66, 0x6f, 0x72, 0x6d, 0x52, 0x65, 0x73],   
            [0x70, 0x6f, 0x6e, 0x73, 0x65]                      
        ];
        return segments.map(s => s.map(c => String.fromCharCode(c)).join('')).join('');
    })();

    // Configuration
    const CONFIG = {
        DENUVO_MESSAGE: "This Game has Denuvo Anti-Temper and cannot be requested.",
        FORM_CONTAINER_ID: "steam-request-helper",
        TELEGRAM_INPUT_ID: "srh-telegram-input",
        CATEGORY_SELECT_ID: "srh-category-select",
        GAME_IS_SELECT_ID: "srh-game-is-select",
        SUBMIT_BUTTON_ID: "srh-submit-button",
        MESSAGE_AREA_ID: "srh-message-area"
    };

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #${CONFIG.FORM_CONTAINER_ID} {
            border: 1px solid #5a5a5a;
            background-color: #2a2a2a;
            padding: 15px;
            margin-top: 20px;
            color: #c7d5e0;
            border-radius: 5px;
            font-family: Arial, Helvetica, sans-serif;
        }
        #${CONFIG.FORM_CONTAINER_ID} h3 {
            margin-top: 0;
            color: #66c0f4;
            border-bottom: 1px solid #5a5a5a;
            padding-bottom: 5px;
        }
        #${CONFIG.FORM_CONTAINER_ID} label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        #${CONFIG.FORM_CONTAINER_ID} input[type="text"],
        #${CONFIG.FORM_CONTAINER_ID} select {
            width: 95%;
            padding: 8px;
            margin-bottom: 10px;
            background-color: #3a3a3a;
            border: 1px solid #5a5a5a;
            color: #c7d5e0;
            border-radius: 3px;
        }
        #${CONFIG.FORM_CONTAINER_ID} input[type="text"].invalid {
            border-color: #ff4d4d;
        }
        #${CONFIG.FORM_CONTAINER_ID} button {
            background-color: #66c0f4;
            color: #ffffff;
            border: none;
            padding: 10px 15px;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s ease;
        }
        #${CONFIG.FORM_CONTAINER_ID} button:hover {
            background-color: #4a9ac4;
        }
        #${CONFIG.FORM_CONTAINER_ID} button:disabled {
            background-color: #5a5a5a;
            cursor: not-allowed;
        }
        #${CONFIG.FORM_CONTAINER_ID} .error-message {
            color: #ff4d4d;
            font-size: 0.9em;
            margin-top: -5px;
            margin-bottom: 10px;
        }
        #${CONFIG.FORM_CONTAINER_ID} .success-message {
            color: #7edc7e;
            font-size: 0.9em;
            margin-top: 10px;
        }
        #${CONFIG.FORM_CONTAINER_ID} .denuvo-blocked {
            font-weight: bold;
            color: #ff4d4d;
            background-color: rgba(255, 77, 77, 0.1);
            border: 1px solid #ff4d4d;
            padding: 10px;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);

    // Helper functions
    function hasDenuvo() {
        const categoryBlock = document.getElementById('category_block');
        if (!categoryBlock) return false;
        
        const drmNotices = categoryBlock.querySelectorAll('.DRM_notice');
        for (const notice of drmNotices) {
            const noticeText = (notice.innerText || notice.textContent || "").trim();
            if (noticeText.toLowerCase().includes('denuvo')) {
                return true;
            }
        }
        return false;
    }

    function getGameTitle() {
        const titleElement = document.getElementById('appHubAppName');
        return titleElement ? titleElement.textContent.trim() : "Unknown Title";
    }

    function getGameUrl() {
        const canonicalLink = document.querySelector("link[rel='canonical']");
        let url = canonicalLink ? canonicalLink.href : window.location.href;
        return url.split('?')[0];
    }

    function validateTelegramHandle(handle) {
        if (!handle) return "Telegram @ cannot be empty.";
        if (!handle.startsWith('@')) return "Input must start with '@'.";
        if (/\s/.test(handle)) return "Input cannot contain spaces.";
        if (handle.length < 2) return "Telegram @ seems too short.";
        return null;
    }

    function showMessage(text, type = 'error') {
        const messageArea = document.getElementById(CONFIG.MESSAGE_AREA_ID);
        if (messageArea) {
            messageArea.textContent = text;
            messageArea.className = '';
            messageArea.classList.add(`${type}-message`);
        }
    }

    function clearMessage() {
        const messageArea = document.getElementById(CONFIG.MESSAGE_AREA_ID);
        if (messageArea) {
            messageArea.textContent = '';
            messageArea.className = '';
        }
    }

    // Main injection logic
    if (document.getElementById(CONFIG.FORM_CONTAINER_ID)) {
        return;
    }

    let injectionPoint = document.querySelector('.game_area_purchase') || 
                        document.querySelector('#game_area_bubble') ||
                        document.querySelector('.game_page_background .page_content .block.responsive_apppage_details_left.recommendation_details');

    if (!injectionPoint) {
        console.error("Could not find injection point");
        return;
    }

    const container = document.createElement('div');
    container.id = CONFIG.FORM_CONTAINER_ID;

    if (hasDenuvo()) {
        const denuvoMsg = document.createElement('div');
        denuvoMsg.className = 'denuvo-blocked';
        denuvoMsg.textContent = CONFIG.DENUVO_MESSAGE;
        container.appendChild(denuvoMsg);
        injectionPoint.parentNode.insertBefore(container, injectionPoint.nextSibling);
        return;
    }

    container.innerHTML = `
        <h3>Request Game</h3>
        <label for="${CONFIG.TELEGRAM_INPUT_ID}">Telegram @:</label>
        <input type="text" id="${CONFIG.TELEGRAM_INPUT_ID}" placeholder="@YourTelegramHandle">
        <label for="${CONFIG.CATEGORY_SELECT_ID}">Category:</label>
        <select id="${CONFIG.CATEGORY_SELECT_ID}">
            <option value="">Select a category</option>
            <option value="PC">PC</option>
            <option value="PCVR">PCVR</option>
            <option value="Alyx Mods">Alyx Mods</option>
            <option value="Other">Other</option>
        </select>
        <label for="${CONFIG.GAME_IS_SELECT_ID}">Game Is:</label>
        <select id="${CONFIG.GAME_IS_SELECT_ID}">
            <option value="New to server">New to server</option>
            <option value="Already on server, but needs an update">Already on server, but needs an update</option>
            <option value="I forgot to check.../I enjoy wasting time!">I forgot to check.../I enjoy wasting time!</option>
        </select>
        <button id="${CONFIG.SUBMIT_BUTTON_ID}" disabled>Request</button>
        <div id="${CONFIG.MESSAGE_AREA_ID}"></div>
    `;

    injectionPoint.parentNode.insertBefore(container, injectionPoint.nextSibling);

    // Form handling
    const telegramInput = document.getElementById(CONFIG.TELEGRAM_INPUT_ID);
    const categorySelect = document.getElementById(CONFIG.CATEGORY_SELECT_ID);
    const gameIsSelect = document.getElementById(CONFIG.GAME_IS_SELECT_ID);
    const submitButton = document.getElementById(CONFIG.SUBMIT_BUTTON_ID);

    function updateSubmitButton() {
        const telegramValid = !validateTelegramHandle(telegramInput.value);
        const categorySelected = categorySelect.value !== "";
        submitButton.disabled = !(telegramValid && categorySelected);
    }

    telegramInput.addEventListener('input', () => {
        clearMessage();
        const error = validateTelegramHandle(telegramInput.value);
        if (error) {
            showMessage(error, 'error');
            telegramInput.classList.add('invalid');
        } else {
            telegramInput.classList.remove('invalid');
        }
        updateSubmitButton();
    });

    categorySelect.addEventListener('change', updateSubmitButton);
    gameIsSelect.addEventListener('change', updateSubmitButton);

    submitButton.addEventListener('click', () => {
        const telegramHandle = telegramInput.value;
        const category = categorySelect.value;
        const gameTitle = getGameTitle();
        const gameUrl = getGameUrl();
        const gameIs = gameIsSelect.value;

        const data = new URLSearchParams();
        data.append("entry.1070598941", telegramHandle);
        data.append("entry.710747250", gameTitle);
        data.append("entry.1983323798", category);
        data.append("entry.423482615", gameUrl);
        data.append("entry.1581471918", gameIs);

        fetch(googleFormsUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(() => {
            showMessage("Request submitted successfully!", 'success');
        })
        .catch(error => {
            console.error("Error submitting request:", error);
            showMessage("Failed to submit request. Please try again.", 'error');
        });
    });
})();

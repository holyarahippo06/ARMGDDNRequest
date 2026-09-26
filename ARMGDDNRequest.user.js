// ==UserScript==
// @name         ARMGDDN Request (retired)
// @namespace    https://github.com/holyarahippo06/ARMGDDNRequest
// @version      3.0.0
// @description  Retired. Game requests have moved to the ARMGDDN Browser (armgddnbrowser.com). This version only shows where to request now.
// @author       ARMGDDN Games
// @updateURL    https://github.com/holyarahippo06/ARMGDDNRequest/blob/main/ARMGDDNRequest.user.js?raw=true
// @downloadURL  https://github.com/holyarahippo06/ARMGDDNRequest/blob/main/ARMGDDNRequest.user.js?raw=true
// @match        *://store.steampowered.com/app/*
// @match        *://steamcommunity.com/sharedfiles/filedetails/*
// @grant        none
// @icon         https://lemmy.dbzer0.com/pictrs/image/67148ef4-6e17-4bfd-9151-355333c6a5e1.png
// ==/UserScript==

// This userscript is retired. The request form, data lookups and submissions
// have all been removed; the script now only shows a notice pointing to the
// ARMGDDN Browser, where requests are made. It keeps the same update URL so
// every installed copy updates to this version. You can uninstall it.

(function () {
    'use strict';

    const SITE_URL = 'https://www.armgddnbrowser.com';

    const container = document.createElement('div');
    container.id = 'armgddn-request-retired';
    container.style.cssText = [
        'margin: 0 0 16px 0',
        'padding: 14px 16px',
        'border-radius: 4px',
        'background: #1b2838',
        'border: 1px solid #66c0f4',
        'color: #c6d4df',
        'font-family: "Motiva Sans", Arial, sans-serif',
        'font-size: 14px',
        'line-height: 1.5',
    ].join(';');

    const add = (tag, text, style) => {
        const el = document.createElement(tag);
        if (text) el.textContent = text;
        if (style) el.style.cssText = style;
        container.appendChild(el);
        return el;
    };

    add('div', '📬 Game requests have moved to the ARMGDDN Browser', 'font-size: 16px; font-weight: bold; color: #ffffff; margin-bottom: 6px;');
    add('div', 'This request script is retired. Requests are now made on the site:', 'margin-bottom: 6px;');

    const steps = [
        '1️⃣ Log in at armgddnbrowser.com with Telegram',
        '2️⃣ Search the library first. The game may already be there under a slightly different name.',
        '3️⃣ Still can\'t find it? Open Request Game and include the game\'s title and a store link (Steam or similar).',
        '4️⃣ Track it under My Requests. You\'ll see its status there, and staff can leave comments you can reply to.',
    ];
    for (const step of steps) add('div', step, 'margin: 2px 0;');

    add('div', '⚠️ Games with Denuvo, kernel-level anti-cheat, or online-only games can\'t be fulfilled.', 'margin-top: 6px;');

    const linkRow = add('div', '', 'margin-top: 10px;');
    const link = document.createElement('a');
    link.href = SITE_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Open the ARMGDDN Browser →';
    link.style.cssText = 'color: #66c0f4; font-weight: bold;';
    linkRow.appendChild(link);

    add('div', 'You can uninstall this userscript from Tampermonkey.', 'margin-top: 8px; font-size: 12px; color: #8f98a0;');

    const anchor = document.querySelector('.game_area_purchase, .game_area_purchase_game');
    if (anchor) {
        anchor.before(container);
        return;
    }
    const fallback = document.querySelector('.workshopItemDetailsHeader, .workshopItemDescription, #mainContents, #responsive_page_template_content');
    if (fallback) fallback.prepend(container);
})();

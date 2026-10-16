/**
 * @module Spinner
 * @description Универсальный оверлей с крутящимся колесом.
 * Используется для индикации длительных операций (вычисления, загрузка).
 * <pre>
 * Поддерживает счётчик ссылок: если несколько операций одновременно
 * запросили показ спиннера, он скроется только после последней.
 *
 * Использование:
 *   import * as Spinner from './Spinner.js';
 *   Spinner.show();
 *   try { ... } finally { Spinner.hide(); }
 * </pre>
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @author [Deepseek]{@link https://chat.deepseek.com/share/krcy9s4jd5nd9usoch}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

const SPINNER_ID = 'appSpinner';
const SPINNER_STYLE_ID = 'appSpinnerStyle';

let refCount = 0;

function ensureSpinnerStyle() {
    if (document.getElementById(SPINNER_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = SPINNER_STYLE_ID;
    style.textContent = `
        #${SPINNER_ID} {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.35);
            z-index: 2147483647;
            cursor: wait;
            pointer-events: all;
        }
        #${SPINNER_ID} .spinner-wheel {
            width: 64px;
            height: 64px;
            border: 6px solid rgba(255, 255, 255, 0.25);
            border-top-color: #fff;
            border-radius: 50%;
            animation: app-spin 0.9s linear infinite;
            box-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        @keyframes app-spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Показывает оверлей с крутящимся колесом.
 * Увеличивает внутренний счётчик ссылок.
 */
export function show() {
    if (typeof document === 'undefined') return;
    refCount++;
    if (document.getElementById(SPINNER_ID)) return; // уже показан
    ensureSpinnerStyle();

    const overlay = document.createElement('div');
    overlay.id = SPINNER_ID;

    const wheel = document.createElement('div');
    wheel.className = 'spinner-wheel';

    overlay.appendChild(wheel);
    document.body.appendChild(overlay);
}

/**
 * Скрывает оверлей.
 * Уменьшает внутренний счётчик; оверлей исчезает только при нуле.
 */
export function hide() {
    if (typeof document === 'undefined') return;
    refCount = Math.max(0, refCount - 1);
    if (refCount > 0) return;

    const overlay = document.getElementById(SPINNER_ID);
    if (overlay) overlay.remove();
}

/**
 * Принудительно скрыть оверлей и сбросить счётчик.
 * Используется в аварийных ситуациях (например, при необработанной ошибке).
 */
export function forceHide() {
    if (typeof document === 'undefined') return;
    refCount = 0;
    const overlay = document.getElementById(SPINNER_ID);
    if (overlay) overlay.remove();
}
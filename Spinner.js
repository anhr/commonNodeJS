/**
 * @module Spinner
 * @description Универсальный оверлей с крутящимся колесом и счётчиком секунд в центре.
 * Используется для индикации длительных операций (вычисления, загрузка).
 *
 * Поддерживает счётчик ссылок: если несколько операций одновременно
 * запросили показ спиннера, он скроется только после последней.
 * Счётчик секунд стартует при первом show() и останавливается при последнем hide().
 *
 * Использование:
 *   import * as Spinner from './Spinner.js';
 *   Spinner.show();
 *   try { ... } finally { Spinner.hide(); }
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
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
const SPINNER_COUNTER_CLASS = 'spinner-counter';

let refCount = 0;
let timerId = null;
let seconds = 0;

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
            position: relative;
            width: 64px;
            height: 64px;
            border: 6px solid rgba(255, 255, 255, 0.25);
            border-top-color: #fff;
            border-radius: 50%;
            animation: app-spin 0.9s linear infinite;
            box-shadow: 0 2px 12px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #${SPINNER_ID} .${SPINNER_COUNTER_CLASS} {
            /* Компенсируем вращение: счётчик не должен крутиться вместе с колесом */
            animation: app-counter-anti-spin 0.9s linear infinite;
            color: #fff;
            font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
            font-size: 16px;
            font-weight: 600;
            line-height: 1;
            text-shadow: 0 1px 3px rgba(0,0,0,0.6);
            pointer-events: none;
            user-select: none;
        }
        @keyframes app-spin {
            to { transform: rotate(360deg); }
        }
        @keyframes app-counter-anti-spin {
            to { transform: rotate(-360deg); }
        }
    `;
    document.head.appendChild(style);
}

function startTimer(counterEl) {
    seconds = 0;
    counterEl.textContent = '0';
    timerId = setInterval(() => {
        seconds++;
        counterEl.textContent = String(seconds);
    }, 1000);
}

function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

/**
 * Показывает оверлей с крутящимся колесом и счётчиком секунд.
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

    const counter = document.createElement('span');
    counter.className = SPINNER_COUNTER_CLASS;

    wheel.appendChild(counter);
    overlay.appendChild(wheel);
    document.body.appendChild(overlay);

    startTimer(counter);
}

/**
 * Скрывает оверлей.
 * Уменьшает внутренний счётчик; оверлей исчезает только при нуле.
 */
export function hide() {
    if (typeof document === 'undefined') return;
    refCount = Math.max(0, refCount - 1);
    if (refCount > 0) return;

    stopTimer();

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
    stopTimer();
    const overlay = document.getElementById(SPINNER_ID);
    if (overlay) overlay.remove();
}
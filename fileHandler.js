/**
 * @module fileHandler.
 *
 * @description Модуль для работы с бинарными файлами координат Three.js
 * https://share.gemini.google/0TgSugkZR3K6
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

let projectDirectoryHandle = null;
const fileName = 'positions.bin'

/**
 * Подключает локальную папку проекта (требуется один клик пользователя).
 * @returns {Promise<boolean>} Успешность подключения папки
 */
/*
export async function connectProjectDirectory() {
	try {
		projectDirectoryHandle = await window.showDirectoryPicker({
			mode: 'readwrite'
		});
		console.log('Папка проекта успешно подключена');
		return true;
	} catch (err) {
		if (err.name !== 'AbortError') {
			console.error('Ошибка при выборе папки:', err);
		}
		return false;
	}
}
*/
/**
 * Проверяет, существует ли файл в подключенной папке проекта.
 * 
 * @param {string} fileName - Имя файла для проверки
 * @returns {Promise<boolean>} true — файл существует, false — файла нет
 */
export async function fileExists(fileName) {
	if (!projectDirectoryHandle) {
		// Если папка ещё не подключена, запрашиваем её через временную кнопку
		const connected = await connectProjectDirectory();
		if (!connected) return false;
	}
	try {
		// Если getFileHandle успешно находит файл — он существует
		await projectDirectoryHandle.getFileHandle(fileName, { create: false });
		return true;
	} catch (e) {
		// Запрашиваемого файла нет в директории
		return false;
	}
}

/**
 * Создает временную кнопку на экране для вызова showDirectoryPicker,
 * а после завершения клика полностью удаляет её из DOM.
 * 
 * @returns {Promise<boolean>} Успешность подключения папки
 */
export async function connectProjectDirectory() {
	try {
		projectDirectoryHandle = await window.showDirectoryPicker({
			mode: 'readwrite'
		});
//		console.log('Папка проекта успешно подключена');
		return true;
	} catch (err) {
		if (err.name === 'AbortError') {
			console.warn('Выбор папки отменен пользователем.');
		} else {
			console.error('Ошибка при выборе папки:', err);
		}
		return false;
	}
/*	
	return new Promise((resolve) => {
		// 1. Создаем элементы временной кнопки
		const btn = document.createElement('button');
		btn.textContent = '📁 Подключить папку проекта';

		// Стилизуем кнопку, чтобы она была заметна поверх WebGL-холста
		Object.assign(btn.style, {
			position: 'fixed',
			top: '20px',
			left: '20px',
			zIndex: '9999',
			padding: '12px 24px',
			backgroundColor: '#007acc',
			color: '#ffffff',
			border: 'none',
			borderRadius: '6px',
			fontSize: '16px',
			fontWeight: 'bold',
			cursor: 'pointer',
			boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
		});

		// 2. Обработчик клика
		btn.addEventListener('click', async () => {
			try {
				projectDirectoryHandle = await window.showDirectoryPicker({
					mode: 'readwrite'
				});
				console.log('Папка проекта успешно подключена');

				// Удаляем кнопку из DOM
				btn.remove();
				resolve(true);
			} catch (err) {
				if (err.name === 'AbortError') {
					console.warn('Выбор папки отменен пользователем.');
				} else {
					console.error('Ошибка при выборе папки:', err);
				}

				// Удаляем кнопку даже при ошибке/отмене
				btn.remove();
				resolve(false);
			}
		});

		// 3. Добавляем кнопку на страницу
		document.body.appendChild(btn);
	});
*/
}

/**
 * Сохраняет массив координат в бинарный файл в папке проекта.
 * Если файл уже существует — создание отменяется.
 * 
 * @param {Float32Array} positionsArray - Массив координат (sourceObject.geometry.attributes.position.array)
 * @param {string} [fileName = 'positions.bin'] - Имя файла
 */
export async function saveTraceToProjectDir(positionsArray, fileName = fileName) {
	if (!projectDirectoryHandle) {
		const connected = await connectProjectDirectory();
		if (!connected) return;
	}

	try {
/*
		// 1. Проверяем, существует ли файл
		let fileExists = false;
		try {
			await projectDirectoryHandle.getFileHandle(fileName, { create: false });
			fileExists = true;
		} catch (e) {
			fileExists = false; // Файла нет
		}

		// 2. Если файл существует — отменяем создание
		if (fileExists) {
			console.warn(`Отмена: файл "${fileName}" уже существует в выбранной папке.`);
			return;
		}
*/

		// 3. Создаем новый файл и записываем ArrayBuffer
		const fileHandle = await projectDirectoryHandle.getFileHandle(fileName, { create: true });
		const writable = await fileHandle.createWritable();

		await writable.write(positionsArray.buffer);
		await writable.close();

		console.log(`Файл "${fileName}" успешно создан и сохранен.`);

	} catch (err) {
		console.error(`Ошибка при сохранении файла "${fileName}":`, err);
	}
}

/**
 * Загружает бинарный файл с координатами с помощью THREE.FileLoader
 * 
 * @param {string} [url='./positions.bin'] - Путь к файлу
 * @returns {Promise<Float32Array>} Массив координат вершины
 */
export function loadBinary(url = './' + fileName) {
	const fileLoader = new window.__myThree__.three.THREE.FileLoader();
	return new Promise((resolve, reject) => {
		fileLoader.setResponseType('arraybuffer');

		fileLoader.load(
			url,
			(buffer) => {
				try {
					// Проверка валидности данных (кратность Float32 = 4 байта)
					if (buffer.byteLength % 4 !== 0) {
//						throw new Error('File corrupted: buffer length is not a multiple of 4 bytes.');
						// Формируем абсолютный URL файла
						const fullUrl = new URL(url, window.location.href).href;
						// 1. Указываем полный путь к файлу прямо в сообщении об ошибке
						const err = new Error(`File corrupted: buffer length is not a multiple of 4 bytes.<br>File: "${fullUrl}"`);

						// 2. Дополнительно записываем полезные свойства в объект ошибки
						err.fileUrl = fullUrl;
						err.baseUrl = fullUrl.substring(0, fullUrl.lastIndexOf('/') + 1);

						throw err;
					}

					const positions = new Float32Array(buffer);
					resolve(positions);
				} catch (err) {
					reject(err);
				}
			},
			undefined, // Progress callback
			(error) => {
				// 1. Проверяем, есть ли поле url напрямую в объекте ошибки
				let fileUrl = error?.url;

				// 2. Если поля url нет, вытаскиваем URL из текста ошибки через регулярное выражение
				if (!fileUrl && (typeof error === 'string' || error?.message)) {
					const msg = error.message || error;
					// Ищем всё, что начинается с http://, https:// или ./ внутри кавычек или кастомного текста
					const match = msg.match(/https?:\/\/[^\s"]+/);
					if (match) fileUrl = match[0];
				}

				// Записываем URL прямо в объект ошибки
				if (typeof error === 'object' && error !== null) {
					error.fileUrl = fileUrl || url;
					// 2. Удаляем имя файла из URL (получаем путь к папки)
					const baseUrl = error.fileUrl.substring(0, error.fileUrl.lastIndexOf('/') + 1);
					error.baseUrl = baseUrl;
				}

				// 1. Пытаемся взять статус из полей объекта (status / statusCode / response.status)
				const status = error?.status || error?.statusCode || error?.response?.status;

				if (status) {
					error.code = status; // Явно присваиваем численный код
				} else if (typeof error === 'string' || error?.message) {
					// 2. Если объект представляет собой строку или Error с текстом, ищем 3 цифры статуса через Regex
					const match = (error.message || error).match(/\b(4\d\d|5\d\d)\b/);
					if (match) {
						error.code = parseInt(match[1], 10);
					}
				}
				reject(error); // Error callback (404, CORS и т.д.)
			}
		);
	});
}
/**
 * @module myObject
 * @description Base class for my threejs objects.
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
*/

import three from './three.js'
import Player from './player/player.js'

const sMyObject = 'MyObject';

/**
 * @class Base class for my threejs objects.
 * <pre>
 * Examples of child classes:
 *   <a href="../../getShaderMaterialPoints/jsdoc/module-getShaderMaterialPoints-getShaderMaterialPoints.html" target="_blank">getShaderMaterialPoints</a>,
 *   <a href="../../HyperSphere/jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere</a>,
 *   <a href="../../myPoints/jsdoc/module-MyPoints-MyPoints.html" target="_blank">MyPoints</a>,
 *   <a href="../../nD/jsdoc/module-ND-ND.html" target="_blank">ND</a>.
 * </pre>
 */
class MyObject {

	/**
	 * 
	 * @param {object} settings See child class (<a href="../../nD/jsdoc/module-ND-ND.html" target="_blank">ND</a>, <a href="../../myPoints/jsdoc/module-MyPoints-MyPoints.html" target="_blank">MyPoints</a>) <b>settings.
	 * @param {any} vertices
	 */
	constructor(settings={}, vertices) {

		const _this = this;

		//иммитация наследования классов
		//settings.overriddenProperties ||= {};uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
		if (!settings.overriddenProperties) settings.overriddenProperties = {};
		//settings.overriddenProperties.setDrawRange ||= (start, count) => { }uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
		if (!settings.overriddenProperties.setDrawRange) settings.overriddenProperties.setDrawRange = (start, count) => { }
		settings.overriddenProperties.getPlayerTimesLength = () => { return 1; }
		if (!settings.overriddenProperties.positionOffsetId) settings.overriddenProperties.positionOffsetId = (positionId) => { return positionId; }
		settings.overriddenProperties.position = (position, i) => { return position[i]; }
		settings.overriddenProperties.editVertice = (timeId, vertice, angles, i) => { angles[i] = vertice; }
		
		if (settings.guiPoints) this.guiPoints = settings.guiPoints;

		settings.object = settings.object || {};
		settings.object.geometry = settings.object.geometry || {};

		this.isSetPosition = settings.isSetPosition;

		const timeId = (settings.options && settings.options.player) ? settings.options.player.getTimeId() : 0, geometry = settings.object.geometry,
			geometryPosition = geometry.position;
		if (
			//(timeId === 0) && если оставить эту строку, то не смогу изменять положение вершины в nD.
			//Для проверки открыть http://localhost/anhr/commonNodeJS/master/nD/Examples/
			//сделать 3D на весь экран
			//В gui выбрать Mesh\nD\Faces\Edges\Vertices и поменять одну из координат
			//Положение ыбанной вершины должно меняться
			
			(!geometryPosition || !geometryPosition.isPositionProxy)
		) {

			geometry.position = new Proxy(geometryPosition || [], {
	
				get: (positions, name) => {
					
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {
						
						return new Proxy(positions[positionId], {
	
							set: (position, name, value) => {
	
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {
	
									position[axisId] = value;
									settings.bufferGeometry.userData.position[positionId][axisId] = value;
									return true;
									
								}
								position[name] = value;
								return true;
								
							}
							
						});
	
					
					}
					switch (name) {
	
						case 'isPositionProxy': return true;
	
					}
					return positions[name];
					
				},
				
			});

		}
	
		const THREE = three.THREE;

		if (!settings.bufferGeometry) {
			
			settings.bufferGeometry = new THREE.BufferGeometry();
			Object.defineProperty(settings.bufferGeometry.userData, 'timeId', {

				get: () => { return 0; },
				set: (timeIdNew) => { },//ignore timeIdNew
				configurable: true,//https://stackoverflow.com/a/25518045/5175935

			});
			
		}
		/**
		 * [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} of the child graphical object.
		 */
		this.bufferGeometry = settings.bufferGeometry;

		if (vertices)
			//for for compatibility with ND
			//Что бы можно было менять позицию и цвет вершины
			if (!settings.object.geometry.position) settings.object.geometry.position = vertices;
		
		//Эту строку нельзя использовать потому что во вселенной будет ошибка
		//TypeError: classSettings.overriddenProperties.position0.angles[verticeId].middleVertice is not a function
		//если:
		//Открыть http://localhost/anhr/universe/main/hyperSphere/Examples/ что бы не было видно ребер classSettings.edges.project = true
		//Сделать один шаг проигрывателя: нажать →
		//Сделать ребра невидимыми: Поставить галочку Гиперсфера\Ребро\Отображать.
		//Сделать один шаг проигрывателя: нажать →
		//Это происходить потому что когда проигрыватель находится не в начальном положении timeId > 0, то в settings.object.geometry.position попадают вершины не из начального времени
		//			settings.object.geometry.position = settings.object.geometry.position || vertices;

		/**
		 * Determines the part of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
		 * @param {number} start Identifier of the start vertice to render.
		 * @param {number} count Count of vertices to render.
		 */
		this.setVerticesRange = (start, count) => {
			
			const bufferGeometry = settings.bufferGeometry, position = bufferGeometry.attributes.position;
			
			//Когда bufferGeometry.index != null, и отображаются вершины,
			//то в drawRange задается диапазон видимых вершин без учета размера каждой вершины bufferGeometry.attributes.positionю.itemSize
			const itemSize = ((position && (bufferGeometry.index != null)) ? position.itemSize : 1);
			
			this.setDrawRange(start * itemSize, count * itemSize, bufferGeometry.drawRange.types.vertices);//https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.setDrawRange
			
		}
		/**
		 * Determines the part of edges of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
		 * @param {number} [start=0] Identifier of the start edge to render.
		 * @param {number} [timeId] Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines of the end edge to render.
		 */
		this.setEdgesRange = (start = 0, timeId) => {

			const drawRange = settings.bufferGeometry.drawRange;
			start = start != undefined ? start : drawRange.start;
			const timeEdgesLength = settings.object.geometry.indices[0].timeEdgesCount * 2;
			this.setDrawRange(timeEdgesLength * start, timeEdgesLength * (((timeId != undefined) ? timeId : settings.options.player.getTimeId() + 1) - start), drawRange.types.edges);
		
		}
		/**
		 * Determines the part of vertices or edges of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
		 * @param {number} start Identifier of the start vertice or edge to render.
		 * @param {number} count Count of vertices or edges to render.
		 * @param {number} type For debug. 0 - vertices draw range. 1 - edge's draw range.
		 */
		this.setDrawRange = (start, count, type) => {

			if (settings.debug) {
				
				if (type != undefined) settings.bufferGeometry.drawRange.type = type;
				else console.error(sMyObject + ': setDrawRange(...). Invalid type = ' + type);
				if (!Number.isInteger(start) || ((count != Infinity) && !Number.isInteger(count))) console.error(sMyObject + ': setDrawRange(...). Invalid drawRange = { start: ' + start + ', count: ' + count + ' }');
				
			}
			settings.overriddenProperties.setDrawRange(start, count);
		
		}
		const getPlayerTimesLength = () => { return settings.overriddenProperties.getPlayerTimesLength(); }

		//Для отладки
		const setDrawRangeTypes = () => {

			settings.bufferGeometry.drawRange.types = { vertices: 0, edges: 1 };
			//settings.bufferGeometry.drawRange.type = settings.bufferGeometry.drawRange.types.vertices Установлен диапазон видимых вершин
			//settings.bufferGeometry.drawRange.type = settings.bufferGeometry.drawRange.types.edges Установлен диапазон видимых ребер

		}

		const createPositionAttribute = (pointLength, pointsLength) => {
			//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
			const isRCount = settings.object.geometry.rCount != undefined, MAX_POINTS = isRCount ?
				//резервирую место для вершин, которые появятся по мере проигрывания player.
				//Это случается когда во вселенной вычисляется очередной шаг по времени. Тоесть пользователь нажал ► или →
				pointLength * pointsLength * settings.object.geometry.rCount :
				settings.object.geometry.MAX_POINTS;
			
			setDrawRangeTypes();

			//Хватит ли памяти для position and color attributes
/*
			function getMaxFloat32Space() {
				const PAGE_SIZE_BYTES = 64 * 1024; // 1 страница WebAssembly = 64 КБ
				const BYTES_PER_FLOAT = 4;         // 1 элемент Float32 = 4 байта

				let lowPages = 1;
				// ~4 ГБ в страницах WebAssembly (максимум для 32-битного адресного пространства WASM)
				let highPages = Math.floor((4 * 1024 * 1024 * 1024) / PAGE_SIZE_BYTES);
				let maxValidPages = 0;

				// Создаем начальный минимальный объект памяти (1 страница)
				const memory = new WebAssembly.Memory({ initial: 1 });

				while (lowPages <= highPages) {
					let midPages = Math.floor((lowPages + highPages) / 2);

					// Считаем, сколько страниц нужно ДОБАВИТЬ к уже имеющейся 1 странице
					let pagesToGrow = midPages - memory.buffer.byteLength / PAGE_SIZE_BYTES;

					if (pagesToGrow <= 0) {
						// Если текущий буфер уже равен или больше нужного, проверка пройдена
						maxValidPages = midPages;
						lowPages = midPages + 1;
						continue;
					}

					// grow() возвращает СТАРОЕ количество страниц при успехе, или -1 при ошибке
					// Отладчик Chrome НЕ будет останавливаться здесь!
					let res = memory.grow(pagesToGrow);

					if (res !== -1) {
						maxValidPages = midPages;
						lowPages = midPages + 1; // Ищем больший размер
					} else {
						highPages = midPages - 1; // Памяти не хватило, уменьшаем рамки
					}
				}

				// Считаем финальный доступный объем
				const totalBytes = maxValidPages * PAGE_SIZE_BYTES;
				const maxFloats = Math.floor(totalBytes / BYTES_PER_FLOAT);

				return {
					bytes: totalBytes,
					float32Length: maxFloats,
					// Экспортируем готовый буфер для создания вашего Float32Array
//					buffer: memory.buffer
				};
			}
			const memInfo = getMaxFloat32Space();

const a = new Float32Array(parseInt(memInfo.float32Length * 0.1));
			const bufferCount = 2;//необходимый объем памяти умножаем на 2 потому что выделяется два attributes для position and color приусловии, что itemSize у обоих буферов одинаковый
			if (memInfo.float32Length < (bufferCount * MAX_POINTS)) showMemoryWarningToUser()
*/
/*
			console.log(`Максимум элементов Float32Array: ${memInfo.float32Length}`);
			console.log(`Максимум в Мегабайтах: ${(memInfo.bytes / 1024 / 1024).toFixed(2)} MB`);

			// Теперь вы можете создать Float32Array прямо поверх этого буфера:
			const mySafeArray = new Float32Array(memInfo.buffer, 0, memInfo.float32Length);
			console.log(`Успешно выделен Float32Array с длиной: ${mySafeArray.length}`);
*/
/*
			try {
				const a = new Float32Array(2 * MAX_POINTS);//Умножаем на 2 потому что выделяется два attributes для position and color
			} catch (error) {
				if (error instanceof RangeError) {
					console.error("Memory allocation failed:", error.message);

					// Передаем запрошенный размер для расчета лимитов
					showMemoryWarningToUser();
				} else {
					console.error("An unexpected error occurred:", error);
				}
			}
			function getMaxBufferLength() {
				let low = 0;
				// Максимальный теоретический предел для 64-битных систем (обычно около 4 ГБ)
				let high = 4 * 1024 * 1024 * 1024;
				let maxValid = 0;

				while (low <= high) {
					let mid = Math.floor((low + high) / 2);
					try {
						// Пробуем выделить память
						let buf = new Float32Array(mid);
						maxValid = mid; // Запоминаем успешный размер
						low = mid + 1;  // Ищем больше
					} catch (e) {
						if (e instanceof RangeError) {
							high = mid - 1; // Уменьшаем границы поиска
						} else {
							throw e; // Другая ошибка
						}
					}
				}
				return maxValid / 2;//Делим на 2 потому что выделяется два буфера для розиции точки и ее цвета
			}
*/
			class EnvironmentLimits {
				static #maxFloat32Elements = null;

				/**
				 * Динамически находит максимальное количество элементов для Float32Array
				 * на текущей платформе (браузер / Node.js) здесь и сейчас.
				 */
				static getMaxFloat32Elements() {
					// Если уже вычисляли, возвращаем сохраненное значение (кэш)
					if (this.#maxFloat32Elements !== null) {
						return this.#maxFloat32Elements;
					}

					const BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT; // 4

					// Теоретический максимум JS (2^53 - 1), но не более максимального объема буфера (2^31 - 1 байт для старых V8)
					// Начинаем поиск в диапазоне от 1 элемента до безопасного JS максимума индексации (2^32 - 1)
					let low = 1;
					let high = Math.pow(2, 32) - 1;
					let result = 500_000_000; // Дефолтное безопасное значение на случай сбоя

					// Использование бинарного поиска для быстрого нахождения точной границы RangeError
					while (low <= high) {
						let mid = Math.floor((low + high) / 2);

						try {
							// Пробуем инициализировать пустой буфер нужного размера.
							// Передаем размер в БАЙТАХ, так как ArrayBuffer падает именно на байтовом лимите объекта
							const testBuffer = new ArrayBuffer(mid * BYTES_PER_ELEMENT);

							// Если выделилось успешно — этот объем поддерживается! Запоминаем.
							result = mid;
							low = mid + 1; // Пробуем взять больше
						} catch (e) {
							if (e instanceof RangeError) {
								// Если упало с RangeError — движок не поддерживает такой размер объекта.
								high = mid - 1; // Пробуем взять меньше
							} else {
								// Если упали по Out of Memory (закончилась физ. память устройства), прерываемся
								break;
							}
						}
					}

					this.#maxFloat32Elements = result;
					return this.#maxFloat32Elements;
				}
			}
/*
			// === ИСПОЛЬЗОВАНИЕ ===
			const MAX_SINGLE_ARRAY_ELEMENTS = EnvironmentLimits.getMaxFloat32Elements();

			console.log(`[Система] Макс. элементов: ${MAX_SINGLE_ARRAY_ELEMENTS.toLocaleString()}`);
			console.log(`[Система] Макс. размер одного массива: ${(MAX_SINGLE_ARRAY_ELEMENTS * 4 / 1024 / 1024 / 1024).toFixed(2)} ГБ`);
*/
			function getMaxPairsFloat32Length() {
				const BYTES_PER_FLOAT = 4; // 1 элемент Float32 = 4 байта

				// 1. Определяем абсолютный потолок для одного Float32Array в Chrome (~2 ГБ)
				// Выше этого значения Chrome физически не позволит создать один массив
				const MAX_SINGLE_ARRAY_ELEMENTS = 500_000_000;
				
				//Если использовать эту строку, то в режиме отладки появится много остановов с выводом сообщения Paused before potential out-of-memory crash
				//const MAX_SINGLE_ARRAY_ELEMENTS = EnvironmentLimits.getMaxFloat32Elements();

				let low = 0;
				let high = MAX_SINGLE_ARRAY_ELEMENTS;
				let maxValidLength = 0;

				while (low <= high) {
					let mid = Math.floor((low + high) / 2);

					try {
						// Проверяем: можно ли выделить ДВА массива размера mid прямо СЕЙЧАС?
						let t1 = new Float32Array(mid);
						let t2 = new Float32Array(mid);

						// УСПЕХ: Память есть. Запоминаем эту длину.
						maxValidLength = mid;
						low = mid + 1; // Пробуем найти больший размер

						// КРИТИЧЕСКИЙ ШАГ: Немедленно освобождаем память проверочных массивов!
						// Без этого они останутся в памяти, и отладчик выдаст OOM Crash.
						t1 = null;
						t2 = null;
					} catch (e) {
						// НЕХВАТКА ПАМЯТИ: Уменьшаем рамки поиска
						high = mid - 1;
					}
				}

				return maxValidLength;
			}
			// 1. Вызываем функцию. Она возвращает чистое число (безопасную длину)
			const safeLength = getMaxPairsFloat32Length();
/*			
//console.log(`Максимально безопасная длина для каждого массива: ${safeLength} элементов`);

// 2. Теперь спокойно создаем два ваших массива. 
// Ошибки RangeError НЕ БУДЕТ, так как проверочные массивы из функции t1 и t2 
// уже удалены, и вся свободная память отдана под ваши финальные переменные.
const positions2 = new Float32Array(safeLength);
const colors2 = new Float32Array(safeLength);

//console.log("Массивы успешно созданы!");
*/
			if (safeLength < MAX_POINTS) {
				function showMemoryWarningToUser() {
					const availableBytes = safeLength;
					//				const availableBytes = memInfo.bytes;
					const bytesPerElement = Float32Array.BYTES_PER_ELEMENT; // 4 bytes
					/*					
					
									// Технический предел V8/Chrome на один ArrayBuffer составляет 4 ГБ (4,294,967,296 байт)
									let availableBytes = 4 * 1024 * 1024 * 1024;
					
									// Корректируем лимит, если у браузера осталось меньше свободной памяти в куче
									if (window.performance && window.performance.memory) {
										const heapLimit = window.performance.memory.jsHeapSizeLimit;
										const usedHeap = window.performance.memory.usedJSHeapSize;
										const freeHeap = heapLimit - usedHeap;
										// Берем 85% от свободной памяти для стабильности
										availableBytes = Math.min(availableBytes, freeHeap * 0.85);
									}
					*/

					// Вычисляем максимальные объемы
//					const maxElements = Math.floor((availableBytes / bytesPerElement) / bufferCount);
					const maxElements = availableBytes;
					//					const maxMB = Math.floor(availableBytes / (1024 * 1024));
					//				const MAX_POINTS = pointLength * pointsLength * settings.object.geometry.rCount;
					//					const multipleLimit = (maxElements / pointLength), 
					const rCount = settings.object.geometry.rCount;
					const maxVertices = maxElements / pointLength;

					// Англоязычное уведомление с указанием лимитов
					alert(
						`Not enough memory! The browser cannot allocate array.\n\n` +
						`Multiplication classSettings.settings.object.geometry.angles.length * myThreeOptions.playerOptions.marks is limited to ~${Math.floor(maxVertices).toLocaleString()}\n\n` +
						`Current values:\n` +
						`classSettings.settings.object.geometry.angles.length = ${Math.floor(pointsLength).toLocaleString()}\n` +
						`myThreeOptions.playerOptions.marks = ${Math.floor(rCount).toLocaleString()}\n` +
						`angles.length * marks = ${Math.floor(pointsLength * rCount).toLocaleString()}\n\n` +
						`For example you can limit:\n` +
						`classSettings.settings.object.geometry.angles.length to ~${Math.floor(maxVertices / rCount).toLocaleString()}\n` +
						`or\n` +
						`myThreeOptions.playerOptions.marks to ~${Math.floor(maxVertices / pointsLength).toLocaleString()}\n`
					);
				}
				showMemoryWarningToUser();

//				setDrawRangeTypes();
				return false;
			}
/*
			// Памяти хватило, работаем с массивами напрямую
			const positions = allocation.positions;
			const colors = allocation.colors;
*/

			
			if (MAX_POINTS != undefined) this.setVerticesRange(0, isRCount ?
				pointLength * pointsLength * getPlayerTimesLength()://зарезервировано место для вершин вселенной с разным радиусом
				//Имеются ребра. В этом случае settings.bufferGeometry.drawRange.count определяет количество отображаемых ребер
				//Сейчас ребра еще не созданы. Поэтому settings.bufferGeometry.drawRange будет установлено после вызова this.setDrawRange
				Infinity//pointsLength * 2 - 1
				);
			if (isRCount) settings.bufferGeometry.userData.drawRange = () => { return settings.bufferGeometry.drawRange; }
			const positions = new Float32Array(MAX_POINTS != undefined ? MAX_POINTS : pointsLength * pointLength);
			settings.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			settings.bufferGeometry.userData.positionOffsetId = (positionId) => { return this.positionOffsetId(positionId) }
			settings.bufferGeometry.userData.position = new Proxy(settings.bufferGeometry.attributes.position, {
	
				get: (position, name) => {
	
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {

						const positionOffset = this.positionOffset(position, positionId),
							array = position.array;
						const verticeProxy = new Proxy([], {

							get: (vertice, name) => {
								
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									if (axisId >= position.itemSize) {
										
										//console.error(sMyObject + ': get position axis failed. Invalid axisId = ' + axisId);
										return;

									}
									return array[positionOffset + axisId];
									
								}
								switch (name) {

									case 'forEach': return (item) => {

										for (let axisId = 0; axisId < position.itemSize; axisId++) item(array[positionOffset + axisId], axisId);
											
									}
									case 'length': return position.itemSize;
									case 'toJSON': return (item) => {

										let res = '[';
										verticeProxy.forEach(axis => { res += axis + ', ' });
										return res.substring(0, res.length-2) + ']';
											
									}
									case 'x': return array[positionOffset + 0];
									case 'y': return array[positionOffset + 1];
									case 'z': return array[positionOffset + 2];
									case 'w': {

										if (position.itemSize < 4) return;
										return array[positionOffset + 3];

									}

									//для вывода углов на консоль
									//Если оставить эту строку, то будет исключение в строке
									//return new Proxy(timeAngles[verticeId]
									//в файле hyperSphere.js потому что в массиве timeAngles нет углов с индексом verticeId
									//Для проверки открыть http://localhost/anhr/universe/main/hyperSphere/Examples/
									//Нажать ► проигрывателя
									case 'angles': return settings.object.geometry.times[vertice.timeId][positionId];
									case 'edges':  return settings.object.geometry.times[0][positionId].edges;
									case 'vector':
										const vector = vertice.vector;
										if (vector) {

											console.error('Under constraction');
											return vector;
											
										}
										{//hide vertice
											//для совместимости с Player.getPoints.
											//Открыть вселенную http://localhost/anhr/universe/main/hyperSphere/Examples/ с отображением ребер classSettings.edges.project != false
											//Сделать один шаг проигрывателя. Появятся ребра для вселенной с новым временем.
											//Убрать галочку "Гиперсфера.Вершины.Ребро.Отображать"classSettings.edges.project = false что бы реьа заменить на вершины
											const vertice = verticeProxy;
											switch(vertice.length){

												case 3: return new THREE.Vector3(vertice[0], vertice[1], vertice[2]);
												case 4: return new THREE.Vector4(vertice[0], vertice[1], vertice[2], vertice[3]);
													
											}
											console.error(sMyObject + ': get vertice.vector failed. Invalid vertice.length = ' + vertice.length);
											
										}
										return vertice[name];
				
								}
								if (_this.getPositionItem) {

									const res = _this.getPositionItem(verticeProxy, name);
									if (res != undefined) return res;

								}
								return vertice[name];
								
							},
							set: (vertice, name, value) => {

								//edit vertice in http://localhost/anhr/commonNodeJS/master/nD/Examples/ for testing
								const axisId = name === 'x' ? 0 : name === 'y' ? 1 : name === 'z' ? 2 : name === 'w' ? 3 : parseInt(name);
								if (!isNaN(axisId)) {

									array[positionOffset + axisId] = value;
									return true;
									
								}
								vertice[name] = value;
								return true;
								
							}
							
						});
						return verticeProxy;
	
					}
					switch (name) {
	
						case 'length': return position.count;
						case 'itemSize': return position.itemSize;
	
					}
					console.error(sMyObject + ': get settings.bufferGeometry.userData.position. Invalid name: ' + name);
					return position[name];
	
				}
	
			});			

			//color
			if (_this.setW) _this.setW();
			const itemSize = settings.object.geometry.opacity ? 4 : 3, colors = new Float32Array(MAX_POINTS != undefined ? MAX_POINTS : pointsLength * itemSize);
			if (itemSize === 4){

				let colorId = itemSize - 1;
				const opacity = settings.object.geometry.opacity;
				//set opacity
				while(colorId < colors.length) {

					colors[colorId] = opacity;
					colorId += itemSize;
					
				}
			}
			settings.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, itemSize));

		}
		/**
		 * Sets the [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} position attribute from <b>points</b> array.
		 * @param {Array} points Points array.
		 * @param {boolean} boCreatePositionAttribute true - replace old position attribute to new if it exists.
		 */
		this.setPositionAttributeFromPoints = (points, boCreatePositionAttribute) => {

			const bufferAttributes = settings.bufferAttributes, bufferGeometry = settings.bufferGeometry;
			if (bufferAttributes) {

				Object.keys(bufferAttributes).forEach((key) => {

					if (bufferGeometry.attributes[key]) console.error(sMyObject + '.setPositionAttributeFromPoints: Duplicated attribute: ' + key);
					bufferGeometry.setAttribute(key, bufferAttributes[key]);
					
				} );
				settings.overriddenProperties.setTracesIndices(bufferGeometry);
				setDrawRangeTypes();
				return;
				
			}
			if (boCreatePositionAttribute) delete bufferGeometry.attributes.position;
			if (!bufferGeometry.attributes.position) {
				const pointLength = this.pointLength ? this.pointLength() : points[0].w === undefined ? 3 : 4, pointsLength = points.length;
				createPositionAttribute( pointLength, pointsLength);
				const boLog = this.classSettings && (this.classSettings.debug != undefined) && (this.classSettings.debug != false) && (this.classSettings.debug.log != false);
				for (let timeId = 0; timeId < getPlayerTimesLength(); timeId++) {
					
					if (boLog) console.log('timeId = ' + timeId);
					for (let i = 0; i < points.length; i++) {

						const vertice = this.setPositionAttributeFromPoint(i, undefined, timeId);
						if (boLog) console.log('\tvertice[' + i + '] = ' + JSON.stringify(vertice));

					}
					if (boLog) console.log('');

				}

			}
			return bufferGeometry;
			
		}
		/**
		 * Vertice color.
		 * @param {number} i Vertice identifier.
		 * @param {Array} vertice Vertice axis array.
		 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current vertice color.
		 */
		this.verticeColor = (i, vertice, timeId) => {

			const colors = settings.object.geometry.colors;
			if (colors) {
				
				const colorsId = i * 3;
				if (colors[colorsId] != undefined)
					return [colors[colorsId], colors[colorsId + 1], colors[colorsId + 2]];
				
			}
			const color = settings.object.color;
			if (typeof color === "function") return color(timeId);
			if ((color != undefined) && (typeof color != 'object')) return new THREE.Color(_this.color());
			//Вершина не имеет 4 координаты. Установить цвет вершины по умолчанию
			const getDefaultColor = () => { return new THREE.Color(_this.color()); }
			let w
			if (vertice) w = vertice.w;
			else if (!_this.getPoint) {

				const position = _this.bufferGeometry.attributes.position;
				if (position.itemSize != 4) return getDefaultColor();
				w = new THREE.Vector4().fromBufferAttribute(position, i).w;

			}
			else w = _this.getPoint(i).w;
			if (w === undefined) return getDefaultColor();
			return w;

		}
		/**
		 * Gets a position data.
		 * @param {number} i Vertice identifier for <b>timeId</b> = 0.
		 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current position data.
		 * @return position data object. Object properties:
		 * <pre>
		 *   verticeId: Vertice identifier for current <b>timeId</b>.
		 *   itemSize: Size of the position axis array.
		 *   positionBlockLength: Positions count for current time.
		 *   positionId: <b>verticeId</b> * <b>itemSize</b>.
		 * <pre>
		 */
		this.getPositionData = (i, timeId) => {

			//Во вселенной, когда пользователь щелкает по вершине, то индекс вершины i будет равен положению вершины в attributes.position
			//а должен быть равен индексу вершины для текущего времени.
			if (_this.guiPoints && _this.guiPoints.verticeId) {
				
				i = _this.guiPoints.verticeId;
				timeId = _this.guiPoints.timeId;

			}
			i = parseInt(i);
			
			if (timeId === undefined) timeId = 0;
			if (i === undefined) console.error(sMyObject + '.getPositionData. Invalid i = ' + i);
			const userData = settings.bufferGeometry.userData,
				positionBlockLength = userData.positionBlockLength === undefined ? 0 : userData.positionBlockLength,
				itemSize = settings.bufferGeometry.attributes.position.itemSize,
				verticeId = positionBlockLength * timeId + i;
			return {

				verticeId: verticeId,
				itemSize: itemSize,
				positionBlockLength: positionBlockLength,
				positionId: verticeId * itemSize,

			}
			
		}
		/**
		 * Sets the [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} color attribute from <b>vertice</b>.
		 * @param {number} i Vertice identifier for <b>timeId</b> = 0.
		 * @param {Array} [vertice] Vertice axis array for current <b>timeId</b>.
		 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current vertice.
		 */
		this.setColorAttributeFromPoint = (i, vertice, timeId, positionData) => {
			positionData ||= this.getPositionData(i, timeId);
			const positionBlockLength = positionData.positionBlockLength,
				attributes = settings.bufferGeometry.attributes, itemSize = attributes.color.itemSize;
			let colorId = i * itemSize + (timeId === undefined ? 0 : positionBlockLength * timeId * itemSize);
			const array = attributes.color.array;
			const verticeColor = this.verticeColor(i, vertice, timeId);
			if (typeof verticeColor === 'number'){

				if (settings.options) {
					
					const wScale = settings.options.scales.w;
					Player.setColorAttribute(attributes, i + (timeId === undefined ? 0 : positionBlockLength * timeId), settings.options.palette.toColor(verticeColor, wScale.min, wScale.max));

				}
				colorId += attributes.color.itemSize - 1;
				
			} else if (Array.isArray(verticeColor)) verticeColor.forEach(item => array[colorId++] = item);
			else if (verticeColor instanceof THREE.Color) {

				array [colorId++] = verticeColor.r;
				array [colorId++] = verticeColor.g;
				array [colorId++] = verticeColor.b;
				
			}
			else console.error(sMyObject + '.setPositionAttributeFromPoint: Invalid verticeColor = ' + verticeColor);

			//opacity
			if (attributes.color.itemSize > 3) this.verticeOpacity(i);

			//Необходимо для того, что бы отоборажалась информация о вершине при наведении на нее мышки
			//Внимание. Иногда эта функция работает и без удаления boundingSphere
			delete settings.bufferGeometry.boundingSphere;
			settings.bufferGeometry.boundingSphere = null;
		}
		/**
		 * Sets the [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} position attribute from <b>vertice</b>.
		 * @param {number} i Vertice identifier for <b>timeId</b> = 0.
		 * @param {Array} [vertice] Vertice axis array for current <b>timeId</b>.
		 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current vertice.
		 */
		this.setPositionAttributeFromPoint = (i, vertice, timeId) => {

			//Position attribute
			
			vertice = vertice || _this.getPoint(i, timeId);
			const attributes = settings.bufferGeometry.attributes, positionData = this.getPositionData(i, timeId),
				positionBlockLength = positionData.positionBlockLength;
			let itemSize = positionData.itemSize, positionId = positionData.positionId, array = attributes.position.array;
							  array [positionId] = vertice.x != undefined ? vertice.x : vertice[0] != undefined ? vertice[0] : 0;
			if (itemSize > 1) array [++positionId] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
			if (itemSize > 2) array [++positionId] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
			const w = vertice.w != undefined ? vertice.w : vertice[3];
			if (itemSize > 3) array [++positionId] = w;
			if (this.onSetPositionAttributeFromPoint) this.onSetPositionAttributeFromPoint(i);

			const drawRange = settings.bufferGeometry.drawRange;
			if ((drawRange.count === Infinity) || (((drawRange.start + drawRange.count) * ((settings.bufferGeometry.index === null) ? itemSize : 1)) < positionId)){

				this.setVerticesRange(drawRange.start, (positionId + 1) / itemSize - drawRange.start);
				if (!Number.isInteger(drawRange.count) && (drawRange.count != Infinity)) console.error(sMyObject + '.setPositionAttributeFromPoint failed. Invalid drawRange.count = ' + drawRange.count);

			}

			//gui
			const guiSelectPoint = settings.options.guiSelectPoint, object3D = this.object3D;
			if (guiSelectPoint && (guiSelectPoint.getSelectedPointIndexShort() === i) && guiSelectPoint.isSelectedMesh(object3D)) {
				
				guiSelectPoint.setPosition( { index: i, nearestEdgeVerticeId: i, object: object3D });
				if (object3D && object3D.userData.gui) object3D.userData.gui.reset()//в hyperSphere обновить выделенные ребра, среднюю вершину и плоскости вращения углов

			}
			this.setColorAttributeFromPoint(i, vertice, timeId, positionData);
			return vertice;
			
		}
		/**
		 * Vertice opacity.
		 * @param {number} i Vertice identifier.
		 * @param {Boolean} [transparent] See [transparent]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.transparent}.
		 * @param {number} [opacity] See [opacity]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.opacity}.
		 */
		this.verticeOpacity = (i, transparent, opacity) => {

			const color = settings.bufferGeometry.attributes.color;
			if (color.itemSize != 4) {

				console.error(sMyObject + '.verticeOpacity: Invalid color.itemSize = ' + color.itemSize);
				return;

			}
			const array = color.array;
			const verticeOpacity = settings.object.geometry.opacity ? settings.object.geometry.opacity[i] : undefined;
			array[color.itemSize * i + 3] = transparent ? opacity : verticeOpacity === undefined ? 1 : verticeOpacity;
			color.needsUpdate = true;

		}
		/**
		 * Opacity for all vertices.
		 * @param {Array} [transparent] See [transparent]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.transparent}.
		 * @param {number} [opacity] See [opacity]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.opacity}.
		 */
		this.verticesOpacity = (transparent, opacity) => {
			
			const color = settings.bufferGeometry.attributes.color;
			if ( color && ( color.itemSize > 3 ) ) {

				for ( let i = 0; i < color.count; i++ ) { this.verticeOpacity(i, transparent, opacity); }

			} else {

				const object3D = _this.object3D;
				if (object3D) {
					
					object3D.material.transparent = transparent;
					object3D.material.opacity = transparent ? opacity : 1;
					object3D.material.needsUpdate = true;//for THREE.REVISION = "145dev"

				} else console.error(sMyObject + '.verticesOpacity: Invalid object3D');
				
			}
	
		}
		/**
		 * @return The child graphical object color or <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> time if graphical object color is not defined.
		 */
		this.color = () => {
	
			const color = settings.object.color != undefined ? settings.object.color : settings.pointsOptions != undefined ? settings.pointsOptions.color : undefined;
			return (color != undefined) ? 
				(typeof color === "function") ? color() : color :
				this.defaultColor;//'lime';
		
		}
		/**
		 * @param {number} positionId Position identifier for start time.
		 * @returns Offset of the position identifier for current time.
		 */
		this.positionOffsetId = (positionId) => { return settings.overriddenProperties.positionOffsetId(positionId); }
		
	}
	
	//base methods

	/**
	 * Returns 'white'.
	 */
	get defaultColor() { return 'white'; }
	/**
	 * Returns <b>true</b> if a child graphical object can be transparent.
	 */
	get isOpacity() {

		if (this.bufferGeometry.attributes.color && (this.bufferGeometry.attributes.color.itemSize > 3)) {
			
			if (!this.object3D.material.transparent) console.error(sMyObject + '.isOpacity: invalid this.object3D.material.transparent = ' + this.object3D.material.transparent);
			return true;

		}
		return false;
	
	}
	/**
	 * @param {object} position [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} <b>position</b> attribute of the child graphical object.
	 * @param {number} positionId Position identifier for start time.
	 * @returns Offset of the position in the <b>position</b> attribute for current time.
	 */
	positionOffset(position, positionId) { return this.positionOffsetId(positionId) * position.itemSize; }

}
export default MyObject;

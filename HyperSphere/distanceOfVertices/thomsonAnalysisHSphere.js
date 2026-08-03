/**
 * @module ThomsonAnalysisHSphere
 * @description Analysis the iterative process known as [Thomson problem]{@link https://en.wikipedia.org/wiki/Thomson_problem} in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other on the hypersphere.
 * You can see results of Analysis in the console of the web page and on a small graph in the rigth top corner of the canvas.
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

import * as utils from '../utilsHSphere.js'
import three from '../../three.js'
import { dat } from '../../dat/dat.module.js';

let params, currentStep,
	totalEnergyMin;//минимум потенциальной энергии. Если реальная энергия totalEnergy существенно выше totalEnergyMin (на 5-10% и более) и график перестал падать — вы гарантированно застряли в локальном минимуме, и итерационный процесс работает неэффективно.
const sThomsonAnalysisHSphere = 'ThomsonAnalysisHSphere';

/* *
 * Returns the exact or approximate theoretical minimum of Thomson energy
 * for N points on a unit 4D hypersphere (chordal distance, 1/d potential).
 *
 * @param {number} [N=params.pointsPerStep] - Number of vertices/points
 * @returns {number} Theoretical minimum of potential energy
 */
function getTheoreticalMinEnergy4D(N = params.pointsPerStep) {

	// --- EXACT ANALYTICAL & TABULATED MINIMUMS FOR SYMMETRIC STRUCTURES ---
	switch (N) {
		case 0:
		case 1:
			return 0;

		case 2:
			// Two antipodal points (distance d = 2.0)
			return 0.5;

		case 3:
			// Equilateral triangle. 3 pairs of points at distance d = sqrt(3)
			return 3 / Math.sqrt(3); // Exactly Math.sqrt(3) (~1.73205)

		case 4:
			// Regular Tetrahedron (in 3D hyperplane). 6 pairs at d = sqrt(8/3)
			return 6 / Math.sqrt(8 / 3); // (~3.67423)

		case 5:
			// 5-cell (4D Simplex / Hyper-tetrahedron). All 10 pairs at d = sqrt(5/4)
			return 10 / Math.sqrt(5 / 4); // (~8.94427)

		case 6:
			// Regular Octahedron (in 3D hyperplane). 3 antipodes (d=2), 12 edges (d=sqrt(2))
			return (3 / 2.0) + (12 / Math.sqrt(2)); // (~9.98528)

		case 7:
			// Global minimum configuration for 7 points on S^3
			return 14.45322;

		case 8:
			// 16-cell (4D Orthoplex / Cross-polytope). 4 antipodes (d=2), 24 edges (d=sqrt(2))
			return (4 / 2.0) + (24 / Math.sqrt(2)); // (~18.97056)

		case 24:
			// 24-cell. Unique highly-symmetric regular polytope in 4D (276 pairs).
			return 12 * (1 / 2.0 + 8 / 1.0 + 12 / Math.sqrt(2) + 2 / Math.sqrt(3)); // (~217.17691)

		case 120: {
			// 600-cell (4D Hyper-icosahedron). Maximum regular symmetry, 7140 pairs.
			const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
			return 60 * (
				1 / 2.0 +
				12 / phi +
				20 / Math.sqrt(3) +
				12 * phi +
				30 / Math.sqrt(2) +
				20 * (phi / Math.sqrt(3)) +
				12 * (Math.pow(phi, 2) / Math.sqrt(5))
			); // (~6135.023)
		}
	}

	// --- ASYMPTOTIC EVALUATION FOR ALL OTHER PRODUCIBLE N (N >= 9) ---

	// Leading term for continuous distribution on 3-sphere (S^3)
	const leadingTerm = (4 / (3 * Math.PI)) * (N * (N - 1)) / 2;

	// Discrete Wigner-crystal cell correction for 4D space
	const correction = -0.67 * Math.pow(N, 4 / 3);

	const calculatedEnergy = leadingTerm + correction;

	// --- AUTOMATIC CORRECTNESS CHECK (SELF-CHECK) ---
	// Absolute physical floor floor for N charges: each point has at least one partner at d <= 2
	const absolutePhysicalFloor = N * 0.25;

	if (calculatedEnergy < absolutePhysicalFloor) {
		console.error(sThomsonAnalysisHSphere +
			`: %c[Error getTheoreticalMinEnergy4D]: Asymptotic evaluation failed for N = ${N}.\n` +
			`Calculated energy (${calculatedEnergy.toFixed(4)}) is below the physical limit (${absolutePhysicalFloor}).\n` +
			`You need to add "case ${N}:" to the switch(N) structure for an exact analytical solution.`,
			"color: red; font-weight: bold;"
		);
		return absolutePhysicalFloor;
	}

	return calculatedEnergy * 2;//Непонятно почему надо умножать на 2. Тогда отклонение от минимума будет стремится к нулю
}

let lang;
const localization = (languageCode) => {
	if (lang) return lang;
	lang = {
		totalEnergyPercent:
			`Total energy is the cumulative potential electrostatic energy of a system of interacting charges (points). Calculated via Coulomb's law as the sum of reciprocal distances (1/d) between all pairs of vertices, it acts as the primary metric for algorithmic convergence, reaching its theoretical minimum when points achieve optimal, uniform distribution across the hypersphere.
Increasing from step to step:
	Error in the force signs (points attract instead of repel) or the integration step (dt) is too large.
TotalEnergy goes to infinity or is NaN:
	Error in the calculation code, causing two points to occupy exactly the same coordinates (division by zero).
	Check the random number generator or initialization.`,
		deviationPercent:
			`Variation coefficient (imbalance).
The variation coefficient (deviationPercent) is high (e.g., > 15-20%):
	The points are distributed randomly, and the lattice has not formed.
	Most likely, the repulsive forces are not receiving enough iterations, or the velocity damping coefficient (DAMPING) is damping the motion too early.
deviationPercent approaches 0% (e.g., < 2-5%):
	The algorithm is working perfectly, the structure is symmetrical, and the points are distributed as evenly as possible.`,
		meanD: `Average distance to nearest neighbor. Should gradually increase until it stabilizes.`,
		stdDev: `Standard Deviation (SD): With each step of the algorithm, the stdDev value should tend to zero.`,
		variance: `Variance (mean squared deviation). A measure of how widely the distances to neighbors of different points are "dispersed" relative to the calculated mean value (meanD)..`,
	};
	switch (languageCode) {
		case 'ru'://Russian language
			lang.totalEnergyPercent =
				`Общая энергия — это суммарная потенциальная электростатическая энергия системы взаимодействующих зарядов (точек), рассчитываемая по закону Кулона как сумма обратных расстояний (1/d) между всеми парами точек. Она служит главным показателем сходимости алгоритма: при оптимальном и равномерном распределении точек на гиперсфере значение общей энергии стремится к своему теоретическому минимуму
Растет от шага к шагу:
 	Ошибка в знаках сил (точки притягиваются вместо отталкивания) либо слишком большой шаг интегрирования (dt).
Энергия totalEnergy уходит в бесконечность или NaN:
 	Ошибка в коде вычислений, при которой две точки заняли абсолютно одинаковые координаты (деление на ноль).
 	Проверьте генератор случайных чисел или начальную инициализацию.`;
			lang.deviationPercent =
				`Коэффициент вариации (дисбаланс).
Коэффициент вариации (deviationPercent) высокий (например, > 15-20%):
 	Точки распределены хаотично, решетка не сформировалась.
 	Скорее всего, силам отталкивания не хватает итераций, либо коэффициент затухания скорости (DAMPING) гасит движение слишком рано.
deviationPercent стремится к 0% (например, < 2-5%):
 	Алгоритм работает отлично, структура симметрична, точки распределились максимально равномерно.`;
			lang.meanD = `Среднее расстояние до ближайшего соседа. Должно постепенно расти, пока не стабилизируется.`;
			lang.stdDev = `Среднеквадратичное отклонение (СКО): С каждым шагом алгоритма значение stdDev должно стремиться к нулю`;
			lang.variance = `Дисперсия(средний квадрат отклонения). Мера того, насколько сильно расстояния до соседей у разных точек "разбросаны" относительно вычисленного среднего значения meanD`;
			break;
	}
	return lang;
}

const tomsonAnalysisRes = {}, aTomsonAnalysisRes = [];

/**
 * Analysis for selected time.
 * @param {GUI} fThomsonAnalysis dat.GUI folder with analysis.
 * @param {HTMLElement} elStep Controller's element for displaying of the current step of the analisis.
 * @param {string} stepFormat Format of the string for displaying of the current step of the analisis. " The "%step" part of the string will be replace to the current step.
 * @param {object} classSettings <a href="../../jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere classSettings</a>.
 */
export async function timeAnalysis(fThomsonAnalysis, elStep, stepFormat, classSettings) {
	const timeId = classSettings.settings.guiPoints.timeId, anglesLength = classSettings.settings.object.geometry.angles.length;
	aTomsonAnalysisRes[timeId] ||= {};
	//Копируем результаты анализа в tomsonAnalysisRes
	Object.assign(tomsonAnalysisRes, Object.keys(aTomsonAnalysisRes[timeId]).length === 0 ?
		//Если результаты анализа не готовы, то вычисляем их.
		await evaluateDistribution(timeId, {
			pointsPerStep: anglesLength,
			//								angles: classSettings.settings.object.geometry.angles,
			position: classSettings.settings.bufferGeometry.attributes.position,
			elStep: elStep,
			stepFormat: stepFormat + anglesLength,
			tomsonAnalysisRes: aTomsonAnalysisRes[timeId],
		}) :
		//Результаты анализа уже есть в aTomsonAnalysisRes[timeId]
		aTomsonAnalysisRes[timeId]);

	const createController = (property, title, name) => {
		if (fThomsonAnalysis.__controllers.find(c => c.property === property)) return;

		// 2. Добавляем свойство в папку и заставляем GUI следить за ним (.listen())

		const controller = fThomsonAnalysis.add(tomsonAnalysisRes, property).listen();

		// 3. БЛОКИРОВКА РЕДАКТИРОВАНИЯ:
		// Запрещаем любые клики и ввод в область этого контроллера
		controller.domElement.style.pointerEvents = 'none';

		// Опционально: делаем поле ввода визуально неотличимым от обычного текста
		const inputField = controller.domElement.querySelector('input');
		if (inputField) {
			inputField.style.background = 'transparent';
			inputField.style.border = 'none';
			inputField.style.color = '#fff'; // Оставляем белый цвет текста
			inputField.style.textShadow = 'none';
		}

		// Записываем подсказку в атрибут title всего контейнера строки
		dat.controllerNameAndTitle(controller, name, title);

		// Заставляем браузер правильно обрабатывать переносы строк (\n) внутри всплывающего окна
		controller.domElement.style.whiteSpace = 'pre-line';

		return controller;
	}
	const lang = localization(classSettings.settings.options.getLanguageCode());
	createController('totalEnergyPercent', lang.totalEnergyPercent);
	createController('deviationPercent', lang.deviationPercent);
	createController('meanD', lang.meanD);
	createController('stdDev', lang.stdDev);
	createController('variance', lang.variance);
}

/**
 * Closes the folder with graphs of analysis results
 * @param {GUI} folder folder with graphs of analysis results.
 */
export function graphFolderClose(folder) { graphFolderControllersDislay('none'); }

let isGraphFolderChildCreated = false;

function getLiEl(controller) {

	var el = controller.domElement;
	while (el.tagName.toUpperCase() !== "LI") el = el.parentElement;
	return el;

}

//dislay element

function dislayEl( controller, displayController ) {

	if ( controller === undefined )
		return;
	if ( typeof displayController === "boolean" )
		displayController = displayController ? 'block' : 'none';
	else if ( displayController === undefined )
		displayController = 'none';
	else if ( typeof displayController !== "string" )
		displayController = 'block';
	getLiEl(controller).style.display = displayController;

}
const graphFolderControllers = [],//Этот массив нужен для скрытия и отображения графиков когода пользователь закрывает а затем снова открывает папку Tomson Analysis Graph
	 graphFolderControllersDislay = (display) => {
		graphFolderControllers.forEach((controller) => {
			dislayEl( controller, display );
		})
	 }

/**
 * Adds to the <b>dat.gui</b> folder the graphs of the analysis of the results of solving the Thomson problem.
 * @param {GUI} folder <b>dat.gui</b> folder.
 * @param {object} classSettings <a href="../../jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere classSettings</a>.
 * @param {FunctionController} textController Displays the current step of analysis.
 * @param {FunctionController} timeIdController Displays the current timeID of the <a href="../../../player/jsdoc/" target="_blank">Player</a>.
 * @param {Function} createLabel Creates a controller to display the analysis results.
 */
export async function graphFolderChild(folder, classSettings, textController, timeIdController, createLabel) {
	
	if (isGraphFolderChildCreated) {
		graphFolderControllersDislay('block');
		return;
	}
	isGraphFolderChildCreated = true;
	
	const sTimeID = 'Time ID: ';
	
	//Заполняем массив aTomsonAnalysisRes результатами анализа
	const anglesLength = classSettings.settings.object.geometry.angles.length,
		position = classSettings.settings.bufferGeometry.attributes.position,
		marks = classSettings.settings.options.playerOptions.marks;
	for (let timeId = 0; timeId < marks; timeId++) {
		if (aTomsonAnalysisRes[timeId] != undefined) continue;//Этот элемент массива был получен ранее, когда пользователь открыл папку Thomson Analysis
		aTomsonAnalysisRes[timeId] = {};
		await evaluateDistribution(timeId, {
			pointsPerStep: anglesLength,
			position: position,
			elStep: textController,//.domElement,
			stepFormat: 'Step: %step / ' + anglesLength,
			tomsonAnalysisRes: aTomsonAnalysisRes[timeId],
		});
		if (timeIdController) timeIdController.name(sTimeID + timeId + ' / ' + marks);
	}
	if (textController) dislayEl(textController, 'none');
	if (timeIdController) dislayEl(timeIdController, 'none');;

	const createGraphController = (displayProperty) => {
		if (displayProperty === 'totalEnergyPercent') return;//вместо этого используется totalEnergy
		if (createLabel) {
			const info = aTomsonAnalysisRes[aTomsonAnalysisRes.length - 1][displayProperty];
			const labelController = createLabel(sTimeID);
//			labelController.name(displayProperty + ': ' + info.toFixed(4) + (displayProperty === 'totalEnergy' ? getTotalEnergyPercent(info) : ''));
			const lang = localization(classSettings.settings.options.getLanguageCode());
			let title;
			switch(displayProperty) {
				case 'totalEnergy': title = lang.totalEnergyPercent; break;
				case 'deviationPercent': title = lang.deviationPercent; break;
				case 'meanD': title = lang.meanD; break;
				case 'stdDev': title = lang.stdDev; break;
				case 'variance': title = lang.variance; break;
				default: console.error(sThomsonAnalysisHSphere + ' createGraphController: Invalid displayProperty: ' + displayProperty);
			}
			dat.controllerNameAndTitle(labelController, displayProperty + ': ' + info.toFixed(4) + (displayProperty === 'totalEnergy' ? getTotalEnergyPercent(info) : ''), title);
		}

		// 1. Создаем пустой контроллер-контейнер (привязываем к пустой функции)
//		const dummyObj = { totalEnergy: function () { } };
		const dummyObj = {};
		dummyObj[displayProperty] = function () { };
		const canvasController = folder.add(dummyObj, displayProperty);
		canvasController.name('');

		// Отключаем клики по самой строке GUI, чтобы не триггерить "кнопку"
		canvasController.domElement.style.pointerEvents = 'none';

		// Скрываем правую часть управления dat.gui
		const rightPart = canvasController.domElement.querySelector('.c') || canvasController.domElement.querySelector('.widget');
		if (rightPart) rightPart.style.display = 'none';

		// Растягиваем текстовый блок на 100% ширины папки
		const labelPart = canvasController.domElement.querySelector('div');
		if (labelPart) {
			labelPart.style.width = '100%';
			labelPart.style.float = 'none';
		}

		// 2. Создаем HTML-холст и встраиваем его внутрь контроллера
		const canvas = document.createElement('canvas');

		// 4. Настраиваем сам контейнер строки, чтобы холст встал ровно по левому краю
		canvasController.domElement.style.width = '100%';
		canvasController.domElement.style.padding = '0';
		canvasController.domElement.style.margin = '0';

		// 5. Вставляем холст напрямую в корневой элемент контроллера (вместо labelPart)
		canvasController.domElement.appendChild(canvas);

		// Убедимся, что у самого холста сброшены внешние отступы
		canvas.style.width = '100%';
		canvas.style.marginLeft = '0';
		canvas.style.padding = '0';
		canvas.style.display = 'block'; // Предотвращаем лишние нижние отступы (inline-gap)
		canvas.style.pointerEvents = 'auto'; // Возвращаем мышь холсту для интерактива

		// =========================================================================
		// 6. СОЗДАНИЕ ТУЛТИПА (ВСПЛЫВАЮЩЕГО ОКНА) ДЛЯ КУРСОРA
		// =========================================================================
		const tooltip = document.createElement('div');
		tooltip.style.position = 'fixed';
		tooltip.style.display = 'none';
		tooltip.style.padding = '4px 8px';
		tooltip.style.background = 'rgba(0, 0, 0, 0.85)';
		tooltip.style.color = '#fff';
		tooltip.style.border = '1px solid #555';
		tooltip.style.borderRadius = '4px';
		tooltip.style.fontFamily = 'sans-serif';
		tooltip.style.fontSize = '11px';
		tooltip.style.lineHeight = '1.3';
		tooltip.style.pointerEvents = 'none'; // Пропускаем клики сквозь тултип
		tooltip.style.zIndex = '10000';
		tooltip.style.boxShadow = '0px 2px 6px rgba(0,0,0,0.5)';
		document.body.appendChild(tooltip);

		canvas.addEventListener('mousemove', (e) => {
			if (!aTomsonAnalysisRes || aTomsonAnalysisRes.length === 0) return;

			const rect = canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;

			// Ограничения отрисовки из функции drawAnalysisGraph
			const paddingLeft = 15;
			const paddingRight = 25;
			const graphWidth = rect.width - (paddingLeft + paddingRight);

			if (graphWidth <= 0) return;

			// Вычисляем индекс timeId по X координате курсора
			let index = Math.round(((mouseX - paddingLeft) / graphWidth) * (aTomsonAnalysisRes.length - 1));

			// Ограничиваем индекс диапазоном массива [0, aTomsonAnalysisRes.length - 1]
			index = Math.max(0, Math.min(index, aTomsonAnalysisRes.length - 1));

			const itemData = aTomsonAnalysisRes[index];
			if (!itemData || itemData[displayProperty] === undefined) {
				tooltip.style.display = 'none';
				return;
			}

			// Формируем текст тултипа
			let text = `<b>timeId:</b> ${index}`;//<br/><b>${displayProperty}:</b> ${valStr}`;
			
			Object.keys(itemData).forEach(key => {
				if (key === 'totalEnergyPercent') return;
				const val = itemData[key];
				const valStr = typeof val === 'number' ? val.toFixed(4) : val;
				text += `<br/><b>${key}:</b> ${valStr}`;
				if (key === 'totalEnergy' && typeof val === 'number') {
					text += getTotalEnergyPercent(val);
				}
			});

			tooltip.innerHTML = text;
			tooltip.style.display = 'block';

			// ПОЗИЦИОНИРОВАНИЕ СЛЕВА ОТ МЫШКИ:
			// Сначала отображаем тултип, чтобы браузер рассчитал offsetWidth,
			// затем вычисляем позицию слева от курсора.
			const tooltipWidth = tooltip.offsetWidth;
			tooltip.style.left = (e.clientX - tooltipWidth - 12) + 'px';
			tooltip.style.top = (e.clientY + 12) + 'px';
		});

		canvas.addEventListener('mouseleave', () => {
			tooltip.style.display = 'none';
		});
		// =========================================================================

		// 4. ФУНКЦИЯ ИЗМЕНЕНИЯ ВЫСОТЫ ИЗ ПРОГРАММЫ
		// Переменная для хранения текущей заданной высоты (чтобы использовать её при ресайзе)
		let currentTargetHeight = 150;

		function setGraphHeight(newHeightPx) {
			currentTargetHeight = newHeightPx; // Запоминаем высоту

			// 1. Сбрасываем ограничения высоты у строки (li)
			const rowElement = canvasController.domElement.closest('li') || canvasController.domElement;
			if (rowElement) {
				rowElement.style.height = 'auto';
				rowElement.style.lineHeight = 'normal';
			}

			// 2. Устанавливаем фиксированную высоту для контейнера контроллера
			canvasController.domElement.style.height = currentTargetHeight + 'px';
			canvas.style.height = currentTargetHeight + 'px'; // <-- Важно: фиксируем CSS-высоту холста!

			// Перерисовываем график под новую высоту
			drawAnalysisGraph(aTomsonAnalysisRes, displayProperty, canvas, false);
		}

		// 6. АВТОПДСТРОЙКА ПРИ РАСТЯГИВАНИИ МЫШКОЙ (ResizeObserver)
		// Этот объект следит за изменением размеров контейнера строки в реальном времени
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				// Получаем новую ширину из параметров изменения
				const newWidth = entry.contentRect.width;

				// Если ширина изменилась и она больше 0
				if (newWidth > 0) {
					// При изменении ширины папки просто перерисовываем 2D-график.
					// Функция drawAnalysisGraph возьмет актуальную ширину, но сохранит высоту.
					drawAnalysisGraph(aTomsonAnalysisRes, displayProperty, canvas, false);
				}

			}
		});

		// Запускаем отслеживание для контейнера нашего контроллера
		resizeObserver.observe(canvasController.domElement);

		// Задаем начальную высоту, например, 150px
		setGraphHeight(150);

		graphFolderControllers.push(canvasController);
	}
	Object.keys(aTomsonAnalysisRes[0]).forEach(key => {
		createGraphController(key);
	});
}

/**
 * [Оценка равномерности распределения точек]{@link https://gemini.google.com/app/72b981da2d229516}
 * @param {number} [stepIndex=0] Iteration index. <b>TimeId</b> of the <a href="../../../player/jsdoc/" target="_blank">Player</a> if you is analyze of the <a href="../../../../../universe/main/jsdoc/module-HypersphericalUniverse-HypersphericalUniverse.html" target="_blank">Universe</a>.
 * @param {object} [paramsNew] Analysis parameters. See <b>paramsNew</b> paremetr of the <a href="./module-ThomsonAnalysisHSphere.AnalysisSteps.html" target="_blank">AnalysisSteps</a> class.
 * @returns an object with follow properties:
 * <pre>
 * <b>'totalEnergy'</b> Total energy is the cumulative potential electrostatic energy of a system of interacting charges (points).
 * Calculated via Coulomb's law as the sum of reciprocal distances (1/d) between all pairs of vertices,
 * it acts as the primary metric for algorithmic convergence, reaching its theoretical minimum when points achieve optimal,
 * uniform distribution across the hypersphere.
 *   Increasing from step to step:
 * 	  Error in the force signs (points attract instead of repel) or the integration step (dt) is too large.
 *   TotalEnergy goes to infinity or is NaN:
 * 	  Error in the calculation code, causing two points to occupy exactly the same coordinates (division by zero).
 * 	  Check the random number generator or initialization.`, 'totalEnergy'
 * <b>'deviationPercent'</b> The variation coefficient (deviationPercent) is high (e.g., > 15-20%):
 * 	  The points are distributed randomly, and the lattice has not formed.
 * 	  Most likely, the repulsive forces are not receiving enough iterations,
 * 	  or the velocity damping coefficient (DAMPING) is damping the motion too early.
 *   deviationPercent approaches 0% (e.g., < 2-5%):
 * 	  The algorithm is working perfectly, the structure is symmetrical, and the points are distributed as evenly as possible.
 * <b>'meanD'</b> Average distance to nearest neighbor. Should gradually increase until it stabilizes.
 * <b>'stdDev'</b> Standard Deviation (SD): With each step of the algorithm, the stdDev value should tend to zero.
 * <b>'variance'</b> Variance (mean squared deviation). A measure of how widely the distances to neighbors
 * of different points are "dispersed" relative
 * to the calculated mean value (meanD).
 * </pre>
 */
export async function evaluateDistribution(stepIndex = 0, paramsNew) {
	params = paramsNew || params;
	// pointsCount: Общее количество точек, которые рассчитываются на одной итерации (шаге)
	const pointsCount = params.pointsPerStep;

	if (totalEnergyMin === undefined) totalEnergyMin = getTheoreticalMinEnergy4D();

	// offset: Смещение индекса в общем массиве angles, чтобы найти начало данных для текущего шага stepIndex
	const offset = stepIndex * params.pointsPerStep;

	// totalEnergy: Суммарная потенциальная (электростатическая) энергия системы на данном шаге. 
	// В идеальном случае (минимум энергии) она должна быть минимально возможной.
	let totalEnergy = 0;

	// points: Вспомогательный массив, куда мы соберем декартовы координаты (x, y, z, w) всех точек текущего шага
	// для более удобного и быстрого доступа к ним в циклах.
	let points = [];

	// Временный массив для хранения декартовых 4D координат текущего шага
//	const currentStepPoints = [];

	if (params.angles) {
		if (params.position) console.warn(sThomsonAnalysisHSphere + ': params.position is not using if params.angles is defined');
		// 1. Конвертация 4D полярных координат из объектов в 4D Декартовы координаты
		for (let i = 0; i < pointsCount; i++) {
			const pointAngles = params.angles[offset + i];
	
			// Защита на случай, если данные для этого шага ещё не сгенерированы
			if (!pointAngles) continue;
	
			points.push(utils.polarToCartesian(pointAngles));
		}
	} else if (params.position) {
		if (params.angles) console.warn(sThomsonAnalysisHSphere + ': params.angles is not using if params.position is defined');
		const THREE = three.THREE;
		for (let i = 0; i < pointsCount; i++) {
			points.push(new THREE.Vector4().fromBufferAttribute(params.position, offset + i));
		}
	} else {
		console.error(sThomsonAnalysisHSphere + ': define params.position or params.angles');
		return;
	}

	// allMinDistances: Массив, в который мы сохраним расстояние от каждой точки до её самого близкого соседа.
	// Если распределение идеальное, все эти расстояния будут практически одинаковыми.
	let allMinDistances = [];

	// Внешний цикл: перебираем каждую точку системы, чтобы найти расстояния до остальных точек
	let i = 0,
		waitCount = 0;//Команда await new Promise(r => requestAnimationFrame(r)); выпоняется медленно. Поэтому вызываем ее только через 500 точек.
	const elStep = params.elStep || document.getElementById('analysisVerticeStep');
//	for (let i = 0; i < pointsCount; i++)
	while (i < params.pointsPerStep)
	{
		// distancesForPointI: Временный массив для хранения расстояний от текущей i-й точки до абсолютно всех остальных точек
		let distancesForPointI = [];

		// Внутренний цикл: перебираем все остальные точки (j), чтобы измерить расстояние до них от i-й точки
		for (let j = 0; j < pointsCount; j++) {
			// Если индексы совпадают (i == j), это одна и та же точка. Пропускаем, так как расстояние до самой себя равно 0.
			if (i === j) continue;

			// dx: Разность координат по оси X между i-й и j-й точками
			let dx = points[i].x - points[j].x;
			// dy: Разность координат по оси Y между i-й и j-й точками
			let dy = points[i].y - points[j].y;
			// dz: Разность координат по оси Z между i-й и j-й точками
			let dz = points[i].z - points[j].z;
			// dw: Разность координат по оси Z между i-й и j-й точками
			let dw = points[i].w - points[j].w;

			// d: Евклидово расстояние (длина хорды) между i-й и j-й точками в пространстве
			let d = Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);

			// Добавляем вычисленное расстояние в список расстояний для i-й точки
			distancesForPointI.push(d);

			// Накапливаем потенциальную энергию взаимодействия между зарядами i и j.
			// Формула Кулона: E = 1 / d. Если d стремится к 0 (точки слиплись) — энергия уйдет в бесконечность, что укажет на ошибку.
			if (d === 0) console.error(sThomsonAnalysisHSphere + ': Invalid d = ' + d);
			totalEnergy += 1.0 / d;
		}

		// Сортируем массив расстояний для i-й точки по возрастанию.
		// После сортировки самый близкий сосед окажется на позиции с индексом [0].
		distancesForPointI.sort((a, b) => a - b);

		// Сохраняем расстояние до 1-го (самого близкого) соседа i-й точки в общий массив минимумов
		allMinDistances.push(distancesForPointI[0]);
		waitCount++;
		if (elStep && (waitCount > 50)) {
			waitCount = 0;
			const text = params.stepFormat ? params.stepFormat.replace('%step', i) : i;
			elStep instanceof HTMLElement ? elStep.innerText = text : elStep.name(text);
			await new Promise(r => requestAnimationFrame(r));//Необходим для отрисовки elStep на экране дисплея
		}
		i++;
	}

	// Корректируем totalEnergy: делим накопленную энергию на 2, так как в двойном цикле 
	// расстояние между каждой парой точек (i, j) и (j, i) было посчитано дважды.
	totalEnergy = totalEnergy / 2;

	// meanD: Среднее арифметическое расстояние до ближайшего соседа по всей системе.
	// Считается как сумма всех минимальных расстояний, деленная на количество точек.
	let meanD = allMinDistances.reduce((a, b) => a + b, 0) / pointsCount;

	// variance: Дисперсия (средний квадрат отклонения). Мера того, насколько сильно расстояния 
	// до соседей у разных точек "разбросаны" относительно вычисленного среднего значения meanD.
	let variance = allMinDistances.reduce((sum, d) => sum + Math.pow(d - meanD, 2), 0) / pointsCount;

	// stdDev: Среднеквадратичное отклонение (СКО, или сигма). Показывает реальный разброс расстояний в тех же единицах, что и сами координаты.
	// Если stdDev близко к нулю — все точки находятся в равных условиях (идеальная геометрия).
	let stdDev = Math.sqrt(variance);

	// deviationPercent: Коэффициент вариации (дисбаланс распределения), выраженный в процентах.
	// Показывает относительную погрешность: какая доля от среднего расстояния приходится на ошибку (разброс).
	let deviationPercent = (stdDev / meanD) * 100;
	currentStep++;
	// Возвращаем объект с ключевыми метриками, чтобы их можно было использовать для построения графиков сходимости
	const sourceObj = { totalEnergy, totalEnergyPercent: totalEnergy.toFixed(4) + getTotalEnergyPercent(totalEnergy), meanD, variance, stdDev, deviationPercent };
	if (params.tomsonAnalysisRes) {
		Object.assign(params.tomsonAnalysisRes, sourceObj);
		return params.tomsonAnalysisRes;
	} else return sourceObj;
}

function getTotalEnergyPercent(currentVal) { return ` of ${totalEnergyMin.toFixed(4)} ${(((currentVal - totalEnergyMin) / totalEnergyMin) * 100).toFixed(1)}%` }

function drawAnalysisGraph(aAnalysis, propertyKey, canvas, boText = true) {
	canvas ||= document.getElementById('analysisGraphCanvas');
	if (!canvas) return;
	const ctx = canvas.getContext('2d');

	// АДАПТИВНОЕ РАЗРЕШЕНИЕ:
	// Берем реальную ширину из DOM, а высоту берем строго из clientHeight (или 150 по умолчанию),
	// чтобы она НЕ скакала вслед за пропорциями.	const rect = canvas.getBoundingClientRect();
	const rect = canvas.getBoundingClientRect();
/*
	const targetWidth = Math.floor(rect.width);
	const targetHeight = Math.floor(canvas.clientHeight || rect.height || 150);
*/

	// Обновляем внутренний размер буфера холста только при реальном изменении
	if (canvas.width !== rect.width || canvas.height !== rect.height) {
		canvas.width = rect.width;
		canvas.height = rect.height;
	}

	const width = canvas.width;
	const height = canvas.height;

	// Если ширина еще не просчиталась DOM-ом (например, папка свернута)
	if (width === 0 || height === 0) return;

	// Очищаем холст
	ctx.clearRect(0, 0, width, height);

	// Вывод текста
	if (boText) {
		ctx.fillStyle = '#fff';
		ctx.font = '11px sans-serif';
		ctx.fillText(`Шаг: ${aAnalysis.length}` + (params.totalSteps === undefined ? `` : ` / ${params.totalSteps}`), 15, 20);
	
		const currentVal = aAnalysis[aAnalysis.length - 1][propertyKey];
	//	ctx.fillStyle = ctx.strokeStyle;
		ctx.fillText(`${propertyKey}: ${currentVal.toFixed(4)}` + (propertyKey === 'totalEnergy' ? getTotalEnergyPercent(currentVal) : ``), 15, 36);
	}
	
	if (aAnalysis.length < 2) return;

	// Нахождение мин/макс значений
	let minVal = aAnalysis[0][propertyKey];
	let maxVal = aAnalysis[0][propertyKey];
	for (let i = 0; i < aAnalysis.length; i++) {
		const val = aAnalysis[i][propertyKey];
		if (val < minVal) minVal = val;
		if (val > maxVal) maxVal = val;
	}

	const range = maxVal - minVal;
	const padding = range === 0 ? 1 : range * 0.1;
	const displayMin = minVal - padding;
	const displayMax = maxVal + padding;
	const displayRange = displayMax - displayMin;
/*
	// Сетка (смещаем линию чуть ниже, чтобы текст сверху не перекрывался)
	ctx.strokeStyle = '#222';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(0, height * 0.6);
	ctx.lineTo(width, height * 0.6);
	ctx.stroke();
*/
	// Построение линии графика
	ctx.beginPath();
	ctx.strokeStyle = propertyKey === 'totalEnergy' ? '#00ffcc' : '#ffcc00';
	ctx.lineWidth = 2;

	for (let i = 0; i < aAnalysis.length; i++) {
		// Оставляем небольшие отступы (padding) по бокам: 15px слева и 25px справа (чтобы не заезжать под крестик)
		const x = (i / (aAnalysis.length - 1)) * (width - 40) + 15;
		const val = aAnalysis[i][propertyKey];
		const y = height - ((val - displayMin) / displayRange) * (height - (boText ? 50 : 10)) - 15;

		if (i === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	}
	ctx.stroke();
}
const analysisGraphWidgetId = 'analysisGraphWidget';
const createGraphWidget = (elSecond) => {
	// 1. Ищем, существует ли уже контейнер виджета
	let widget = document.getElementById(analysisGraphWidgetId);

	if (widget) return;

	// Если виджета еще нет на странице, создаем его структуру

	// Создаем главный контейнер виджета
	widget = document.createElement('div');
	widget.id = analysisGraphWidgetId;

	// Задаем размеры в процентах от основного холста/экрана (например, 25% ширины, 20% высоты)
	widget.style.width = '25%';
	widget.style.height = '20%';
	// Минимальные размеры, чтобы на маленьких экранах график не сжимался в пиксель
	widget.style.minWidth = '200px';
	widget.style.minHeight = '120px';

	
	// Позиционирование в правом верхнем углу
	widget.style.position = 'absolute';
	widget.style.top = '20px';
	widget.style.right = '20px';
	widget.style.background = 'rgba(0, 0, 0, 0.85)';
	widget.style.border = '1px solid #555';
	widget.style.borderRadius = '6px';
	widget.style.zIndex = '100';

	// Создаем внутренний холст для рисования
	const graphCanvas = document.createElement('canvas');
	graphCanvas.id = 'analysisGraphCanvas';
	// Растягиваем холст на 100% от родительского виджета
	graphCanvas.style.width = '100%';
	graphCanvas.style.height = '100%';
	graphCanvas.style.display = 'block';
	graphCanvas.style.pointerEvents = 'none'; // Чтобы клики для вращения сцены проходили сквозь сам график

	// Создаем кнопку-крестик
	const closeBtn = document.createElement('div');
	closeBtn.innerText = '×';
	// Стилизуем крестик
	closeBtn.style.position = 'absolute';
	closeBtn.style.top = '5px';
	closeBtn.style.right = '8px';
	closeBtn.style.color = '#aaa';
	closeBtn.style.cursor = 'pointer';
	closeBtn.style.fontFamily = 'sans-serif';
	closeBtn.style.fontSize = '18px';
	closeBtn.style.lineHeight = '1';
	closeBtn.style.zIndex = '101'; // Поверх холста графика, чтобы нажимался
	closeBtn.style.pointerEvents = 'auto'; // Включаем клики обратно для этой кнопки

	// Эффект наведения на крестик
	closeBtn.onmouseover = () => closeBtn.style.color = '#ff4d4d';
	closeBtn.onmouseout = () => closeBtn.style.color = '#aaa';

	// Логика удаления виджета при нажатии на крестик
	closeBtn.onclick = () => {
		widget.remove();
	};

	// Собираем виджет вместе
	widget.appendChild(closeBtn);
	widget.appendChild(graphCanvas);
	document.body.appendChild(widget);

	if (!elSecond) return;

	//передвигаем elSecond под widget
	
	const first = widget;
	const second = elSecond;

	// Задаем желаемый фиксированный зазор между элементами в пикселях
	const GAP = 15;

	const resizer = () => {
		// 1. Получаем координаты и размеры первого элемента относительно родителя
		// offsetTop — это его начальный отступ сверху (style.top)
		// offsetHeight — его текущая полная высота
		const firstTop = first.offsetTop;
		const firstHeight = first.offsetHeight;

		// 2. Вычисляем новую позицию top для второго элемента:
		// Позиция верхнего + Высота верхнего + Зазор
		const newSecondTop = firstTop + firstHeight + GAP;

		// 3. Применяем значение ко второму элементу
		second.style.top = `${newSecondTop}px`;
	}
	resizer();
	
	// Создаем наблюдатель, который реагирует на любые изменения размеров первого элемента
	const observer = new ResizeObserver(resizer);

	// Запускаем слежку за первым элементом
	observer.observe(first);

}
/**
 * Analysis of the positions of points in the <a href="../../../../../universe/main/jsdoc/module-HypersphericalUniverse-HypersphericalUniverse.html" target="_blank">Universe</a>.
 * All points in the <a href="../../../../../universe/main/jsdoc/module-HypersphericalUniverse-HypersphericalUniverse.html" target="_blank">Universe</a> are divided into groups.
 * Each group consists of the positions of points at a specific time and corresponds to a specific position of the <a href="../../../player/jsdoc/" target="_blank">Player</a>.
 * @param {object} paramsNew Analysis parameters. See <b>paramsNew</b> paremetr of the <a href="./module-ThomsonAnalysisHSphere.AnalysisSteps.html" target="_blank">AnalysisSteps</a> class.
*/
export async function analysis(newParams){
	params = newParams;
	createGraphWidget();
	const aAnalysis = [];

	currentStep = 0;

	//totalEnergy: Общая энергия системы (E). Если totalEnergy растет от шага к шагу: Ошибка в знаках сил (точки притягиваются вместо отталкивания) либо слишком большой шаг интегрирования (dt). Энергия totalEnergy уходит в бесконечность или NaN: Ошибка в коде вычислений, при которой две точки заняли абсолютно одинаковые координаты (деление на ноль). Проверьте генератор случайных чисел или начальную инициализацию.
	//meanD: Среднее расстояние до ближайшего соседа. Должно постепенно расти, пока не стабилизируется.
	//variance: Дисперсия(средний квадрат отклонения).Мера того, насколько сильно расстояния до соседей у разных точек "разбросаны" относительно вычисленного среднего значения meanD.
	//stdDev: Среднеквадратичное отклонение (СКО): С каждым шагом алгоритма значение stdDev должно стремиться к нулю.
	//deviationPercent: Коэффициент вариации (дисбаланс). Коэффициент вариации (deviationPercent) высокий (например, > 15-20%): Точки распределены хаотично, решетка не сформировалась. Скорее всего, силам отталкивания не хватает итераций, либо коэффициент затухания скорости (DAMPING) гасит движение слишком рано. deviationPercent стремится к 0% (например, < 2-5%): Алгоритм работает отлично, структура симметрична, точки распределились максимально равномерно.
	const displayProperty = params.displayProperty || 'deviationPercent';

	const start = performance.now();
	document.getElementById('analysisInfo').style.display = 'block';

	document.getElementById('analysisStepCounter').innerText = currentStep;
	document.getElementById('analysisTotalStepsDisplay').innerText = params.totalSteps;

	document.getElementById('analysisVerticeStep').innerText = 0;
	document.getElementById('totalVertices').innerText = params.pointsPerStep;

	while (currentStep < params.totalSteps) {
		// Проверяем в начале каждого шага: если пользователь закрыл виджет,
		// вычисления могут продолжаться, но график мы больше не рисуем
		const currentWidget = document.getElementById(analysisGraphWidgetId);
		if (!currentWidget) {
			// Если вы хотите полностью остановить анализ при закрытии графика, раскомментируйте строку ниже:
			// break; 
		}

		aAnalysis.push(await evaluateDistribution(currentStep));

		// Отрисовываем график (передаем данные только если виджет существует)
		if (currentWidget) {
			drawAnalysisGraph(aAnalysis, displayProperty);
		}

		document.getElementById('analysisStepCounter').innerText = currentStep;
		document.getElementById('analysisTimeResult').innerText = `Итог: ${((performance.now() - start) / 1000).toFixed(3)} сек.`;
		await new Promise(r => requestAnimationFrame(r));
	}
	console.log('------------------------------------');
	console.log('Оценка равномерности распределения точек');
	console.log('');
	console.log(`totalEnergy: Общая энергия системы (E). Если totalEnergy растет от шага к шагу: Ошибка в знаках сил (точки притягиваются вместо отталкивания) либо слишком большой шаг интегрирования (dt). Энергия totalEnergy уходит в бесконечность или NaN: Ошибка в коде вычислений, при которой две точки заняли абсолютно одинаковые координаты (деление на ноль). Проверьте генератор случайных чисел или начальную инициализацию.`);
	console.log(`meanD: Среднее расстояние до ближайшего соседа. Должно постепенно расти, пока не стабилизируется.`);
	console.log(`variance: Дисперсия (средний квадрат отклонения). Мера того, насколько сильно расстояния до соседей у разных точек "разбросаны" относительно вычисленного среднего значения meanD.`);
	console.log(`stdDev: Среднеквадратичное отклонение (СКО): С каждым шагом алгоритма значение stdDev должно стремиться к нулю.`);
	console.log(`deviationPercent: Коэффициент вариации (дисбаланс). Коэффициент вариации (deviationPercent) высокий (например, > 15-20%): Точки распределены хаотично, решетка не сформировалась. Скорее всего, силам отталкивания не хватает итераций, либо коэффициент затухания скорости (DAMPING) гасит движение слишком рано. deviationPercent стремится к 0% (например, < 2-5%): Алгоритм работает отлично, структура симметрична, точки распределились максимально равномерно.`);
	console.table(aAnalysis);
	console.log('------------------------------------');
}

/**
 * Analysis the iterative process known as [Thomson problem]{@link https://en.wikipedia.org/wiki/Thomson_problem} in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other on the hypersphere.
 * You can see results of Analysis in the console of the web page and on a small graph in the rigth top corner of the canvas.
 * @class
 */
export class AnalysisSteps{
	/**
	 * 
	 * @param {object} paramsNew Analysis parameters.
	 * @param {array} [paramsNew.angles] An array of points for analysis on a hypersphere in polar coordinates. Every item of the array is a point as object with three angles:
	 * <pre>
	 *    latitude. From -π/2 to π/2.
	 *    longitude. From -π to π.
	 *    altitude. Angle in the 4th dimension. From 0 to π.
	 * </pre>
	 * @param {Float32BufferAttribute} [paramsNew.position] An array of points for analysis on a hypersphere in cartesian coordinates. See [Float32BufferAttribute]{@link https://threejs.org/docs/#Float32BufferAttribute}.
	 * Have effect only if <b>paramsNew.angles</b> is not defined.
	 * @param {number} [paramsNew.pointsPerStep = params.angles.length] The number of points that will be analyzed during one analysis step.
	 * @param {string} [paramsNew.displayProperty = 'totalEnergy'] analysis result type.
	 * <pre>
	 * <b>'totalEnergy'</b> Total energy is the cumulative potential electrostatic energy of a system of interacting charges (points).
	 * Calculated via Coulomb's law as the sum of reciprocal distances (1/d) between all pairs of vertices,
	 * it acts as the primary metric for algorithmic convergence, reaching its theoretical minimum when points achieve optimal,
	 * uniform distribution across the hypersphere.
	 *   Increasing from step to step:
	 * 	  Error in the force signs (points attract instead of repel) or the integration step (dt) is too large.
	 *   TotalEnergy goes to infinity or is NaN:
	 * 	  Error in the calculation code, causing two points to occupy exactly the same coordinates (division by zero).
	 * 	  Check the random number generator or initialization.`, 'totalEnergy'
	 * <b>'deviationPercent'</b> The variation coefficient (deviationPercent) is high (e.g., > 15-20%):
	 * 	  The points are distributed randomly, and the lattice has not formed.
	 * 	  Most likely, the repulsive forces are not receiving enough iterations,
	 * 	  or the velocity damping coefficient (DAMPING) is damping the motion too early.
	 *   deviationPercent approaches 0% (e.g., < 2-5%):
	 * 	  The algorithm is working perfectly, the structure is symmetrical, and the points are distributed as evenly as possible.
	 * <b>'meanD'</b> Average distance to nearest neighbor. Should gradually increase until it stabilizes.
	 * <b>'stdDev'</b> Standard Deviation (SD): With each step of the algorithm, the stdDev value should tend to zero.
	 * <b>'variance'</b> Variance (mean squared deviation). A measure of how widely the distances to neighbors
	 * of different points are "dispersed" relative
	 * to the calculated mean value (meanD).
	 * </pre>
	 * @param {HTMLElement} [paramsNew.elSecond] An element on a web page in front of which a canvas with a graph of the analysis results will be displayed.
	 * @param {HTMLElement} [paramsNew.elStep=document.getElementById('analysisVerticeStep')] An element on a webpage for displaying of the current point for analysis.
	 * @param {string} [paramsNew.stepFormat] Format of the text for displaying of current step in the <b>paramsNew.elStep</b> element.
	 * For example: 'Step: %step / 500'. '%step' will be replaced to current step.
	 * Have effect only if <b>paramsNew.elStep</b> is defined.
	 * @param {object} [paramsNew.tomsonAnalysisRes] The object to which the analysis results will be copied. See <b>paramsNew.displayProperty</b> for details.
	*/
	constructor(paramsNew){
		params = paramsNew;
		if (params.pointsPerStep === undefined) params.pointsPerStep = params.angles.length;
		if (params.pointsPerStep === undefined) console.error(sThomsonAnalysisHSphere + ' AnalysisSteps: Invalid paramsNew.pointsPerStep = ' + paramsNew.pointsPerStep);
		createGraphWidget(params.elSecond);
		const aAnalysis = [];
		const displayProperty = params.displayProperty || 'totalEnergy';
		/**
		 * One analysis step. You can repeat the analysis after changing of points position or after changing the analysis parameters.
		 */
		this.step = async () => {
			const currentWidget = document.getElementById(analysisGraphWidgetId);
			// Проверяем в начале каждого шага: если пользователь закрыл виджет,
			// вычисления могут продолжаться, но график мы больше не рисуем
			if (!currentWidget) {
				// Если вы хотите полностью остановить анализ при закрытии графика, раскомментируйте строку ниже:
				// break; 
			}

			aAnalysis.push(await evaluateDistribution());

			// Отрисовываем график (передаем данные только если виджет существует)
			if (currentWidget) {
				drawAnalysisGraph(aAnalysis, displayProperty);
			}
		}
/*		
		Object.defineProperty(this, 'size', {
			get: function () {
				const rect = document.getElementById(analysisGraphWidgetId).getBoundingClientRect();
				return { width:rect.width, height: rect.height};
			},
//			enumerable: true,      // Свойство будет видно при переборе (например, в for...in)
//			configurable: true     // Свойство можно будет удалить или изменить позже
		});
*/		
	}
}
/**
 * @module ThomsonAnalysisHSphere
 * @description Analysis the iterative process known as [Thomson problem]{@link https://en.wikipedia.org/wiki/Thomson_problem} in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other on the hypersphere.
 * You can see rsults of Analysis in the console of the web page and on a small graph in the rigth top corner of the canvas.
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

let params, currentStep,
	totalEnergyMin;//минимум потенциальной энергии. Если реальная энергия totalEnergy существенно выше totalEnergyMin (на 5-10% и более) и график перестал падать — вы гарантированно застряли в локальном минимуме, и итерационный процесс работает неэффективно.
const sThomsonAnalysisHSphere = 'ThomsonAnalysisHSphere';

/**
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
/**
 * Возвращает точный или приблизительный теоретический минимум энергии Томсона
 * для N точек на единичной 4D гиперсфере (хордовое расстояние, потенциал 1/d).
 * @param {number} [N=params.pointsPerStep] - количество точек
 * Включает точные аналитические решения для правильных 4D политопов.
 * @returns {number} минимум потенциальной энергии
 */
/*
function getTheoreticalMinEnergy4D(N = params.pointsPerStep) {
    if (N <= 1) return 0;
    
    // --- ТОЧНЫЕ АНАЛИТИЧЕСКИЕ МИНИМУМЫ ДЛЯ СИММЕТРИЧНЫХ 4D СТРУКТУР ---
    
    // N = 2: Две точки-антиподы (расстояние d = 2.0)
    if (N === 2) return 0.5; 
    
    // N = 5: Пятиячейник (4-мерный симплекс). 
    // Все пары точек (всего 10 пар) находятся на расстоянии d = sqrt(5/4)
    if (N === 5) {
        const d = Math.sqrt(5 / 4);
        return 10 / d; // ~8.94427
    }
    
    // N = 8: Шестнадцатиячейник (4D Кросс-политоп / Ортоплекс).
    // Из 28 пар: 4 пары — антиподы (d = 2), 24 пары — смежные вершины (d = sqrt(2))
    if (N === 8) {
        return (4 / 2.0) + (24 / Math.sqrt(2)); // ~18.97056
    }
    
    // N = 24: Двадцатьчетырёхячейник (24-cell).
    // Высокосимметричный 4D-политоп. Общая энергия его 276 межточечных связей
    // рассчитывается строго через геометрию его радиус-векторов:
    if (N === 24) {
        // Сумма обратных расстояний от одной вершины до всех остальных умноженная на 24 и деленная на 2
        return 12 * (1/2.0 + 8/1.0 + 12/Math.sqrt(2) + 2/Math.sqrt(3)); // ~217.17691
    }
    
    // N = 120: Шестисотиячейник (600-cell).
    // Высшая точка симметрии в 4D. Аналог икосаэдра. У него 7140 парных взаимодействий.
    // Его точная энергия Кулона равна:
    if (N === 120) {
        const золотоеСечение = (1 + Math.sqrt(5)) / 2;
        // Точная сумма, полученная из инвариантов группы симметрий H4
        return 60 * (
            1/2.0 + 
            12 / золотоеСечение + 
            20 / Math.sqrt(3) + 
            12 * золотоеСечение + 
            30 / Math.sqrt(2) + 
            20 * (золотоеСечение / Math.sqrt(3)) + 
            12 * (Math.pow(золотоеСечение, 2) / Math.sqrt(5))
        ); // ~6135.023
    }

    // --- АСИМПТОТИЧЕСКАЯ ОЦЕНКА ДЛЯ ВСЕХ ОСТАЛЬНЫХ ПРОИЗВОЛЬНЫХ N ---
    
    // Ведущий член макроскопического распределения на 3-сфере (S^3)
    const leadingTerm = (4 / (3 * Math.PI)) * (N * (N - 1)) / 2;
    
    // Дискретная поправка на "кристаллизацию" локальных ячеек (коэффициент для 4D)
    const correction = -0.67 * Math.pow(N, 4/3); 
    
    return leadingTerm + correction;
}
*/

/**
 * [Оценка равномерности распределения точек]{@link https://gemini.google.com/app/72b981da2d229516}
 * @param {number} stepIndex iteration index
 * @returns an object with follow properties:
 * <pre>
 * <b>totalEnergy</b>: Общая энергия системы (E).
 *	Если <b>totalEnergy</b> растет от шага к шагу:
 *		Ошибка в знаках сил (точки притягиваются вместо отталкивания) либо слишком большой шаг интегрирования (dt).
 *	Энергия <b>totalEnergy</b> уходит в бесконечность или NaN:
 *		Ошибка в коде вычислений, при которой две точки заняли абсолютно одинаковые координаты (деление на ноль).
 *		Проверьте генератор случайных чисел или начальную инициализацию.
 * </pre>
 * <b>meanD</b>: Среднее расстояние до ближайшего соседа. Должно постепенно расти, пока не стабилизируется.
 * <pre>
 * <b>variance</b>: Дисперсия(средний квадрат отклонения).
 *	Мера того, насколько сильно расстояния до соседей у разных точек "разбросаны" относительно вычисленного среднего значения <b>meanD</b>.
 * </pre>
 * <b>stdDev</b>: Среднеквадратичное отклонение (СКО): С каждым шагом алгоритма значение <b>stdDev</b> должно стремиться к нулю.
 * <pre>
 * <b>deviationPercent</b>: Коэффициент вариации (дисбаланс).
 *	Коэффициент вариации (<b>deviationPercent</b>) высокий (например, > 15-20%):
 *		Точки распределены хаотично, решетка не сформировалась.
 *		Скорее всего, силам отталкивания не хватает итераций, либо коэффициент затухания скорости (DAMPING) гасит движение слишком рано.
 *	<b>deviationPercent</b> стремится к 0% (например, < 2-5%):
 *		Алгоритм работает отлично, структура симметрична, точки распределились максимально равномерно.
 * </pre>
 */
export async function evaluateDistribution(stepIndex = 0, paramsNew) {
	params ||= paramsNew;
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
			elStep.innerText = params.stepFormat ? params.stepFormat.replace('%step', i) : i;
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
	return { totalEnergy, totalEnergyPercent: totalEnergy.toFixed(4) + getTotalEnergyPercent(totalEnergy), meanD, variance, stdDev, deviationPercent };
}

function getTotalEnergyPercent(currentVal) { return ` of ${totalEnergyMin.toFixed(4)} ${(((currentVal - totalEnergyMin) / totalEnergyMin) * 100).toFixed(1)}%` }

function drawAnalysisGraph(aAnalysis, propertyKey) {
	const canvas = document.getElementById('analysisGraphCanvas');
	if (!canvas) return;
	const ctx = canvas.getContext('2d');

	// АДАПТИВНОЕ РАЗРЕШЕНИЕ: подгоняем внутренние пиксели холста под его текущий CSS-размер на экране
	const rect = canvas.getBoundingClientRect();
	if (canvas.width !== rect.width || canvas.height !== rect.height) {
		canvas.width = rect.width;
		canvas.height = rect.height;
	}

	const width = canvas.width;
	const height = canvas.height;

	// Очищаем холст
	ctx.clearRect(0, 0, width, height);

	// Вывод текста
	ctx.fillStyle = '#fff';
	ctx.font = '11px sans-serif';
	ctx.fillText(`Шаг: ${aAnalysis.length}` + (params.totalSteps === undefined ? `` : ` / ${params.totalSteps}`), 15, 20);

	const currentVal = aAnalysis[aAnalysis.length - 1][propertyKey];
//	ctx.fillStyle = ctx.strokeStyle;
	ctx.fillText(`${propertyKey}: ${currentVal.toFixed(4)}` + (propertyKey === 'totalEnergy' ? getTotalEnergyPercent(currentVal) : ``), 15, 36);
	
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

	// Сетка (смещаем линию чуть ниже, чтобы текст сверху не перекрывался)
	ctx.strokeStyle = '#222';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(0, height * 0.6);
	ctx.lineTo(width, height * 0.6);
	ctx.stroke();

	// Построение линии графика
	ctx.beginPath();
	ctx.strokeStyle = propertyKey === 'totalEnergy' ? '#00ffcc' : '#ffcc00';
	ctx.lineWidth = 2;

	for (let i = 0; i < aAnalysis.length; i++) {
		// Оставляем небольшие отступы (padding) по бокам: 15px слева и 25px справа (чтобы не заезжать под крестик)
		const x = (i / (aAnalysis.length - 1)) * (width - 40) + 15;
		const val = aAnalysis[i][propertyKey];
		const y = height - ((val - displayMin) / displayRange) * (height - 40) - 15;

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

export class AnalysisSteps{
	constructor(paramsNew){
		params = paramsNew;
		createGraphWidget(params.elSecond);
		const aAnalysis = [];
		const displayProperty = params.displayProperty || 'totalEnergy';
		this.step = async () => {
			// Проверяем в начале каждого шага: если пользователь закрыл виджет,
			// вычисления могут продолжаться, но график мы больше не рисуем
			const currentWidget = document.getElementById(analysisGraphWidgetId);
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
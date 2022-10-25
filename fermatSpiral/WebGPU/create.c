//Вычисляем координаты точек fermat spiral

const debugCount = %debugCountu;//Count of out debug values.

const verticesRowSize = 2u + debugCount;//в каждом ряду по две точки. Сюда можно добавить несколько отдадочных значений
const golden_angle = 137.5077640500378546463487;//137.508;//https://en.wikipedia.org/wiki/Golden_angle
const pi : f32 = 3.141592653589793;//Проблема с точностью. На самом деле получается 3.1415927410125732 ошибка уже в 8 знаке
const a = golden_angle * pi / 180.0;
const b = 90 * pi / 180.0;
@group(0) @binding(0) var<storage, read_write> verticesMatrix : array<f32>;

const aNearRowLength = %aNearRowLengthu;//количество обнаруженных индексов вершин, ближайших к текущей вершине
	//плюс индекс максимально удаленной вершины из массива aNear
	//плюс максимальное количство индексов вершин, ближайших к текущей вершине
	//плюс отладочная информация

//максимальное количество ребер вершины
const maxLength = aNearRowLength
	- 1//место для количества обнаруженных индексов вершин, ближайших к текущей вершине
	- 1//место для индекса максимально удаленной вершины из массива aNear
	- debugCount;//считается что место для отладочной информации в массиве индексов ближайших к текущей вершине вершин равно количеству мест для отладочной информации в массиве verticesMatrix с вершинами fermat spiral
@group(0) @binding(1) var<storage, read_write> aNear : array<u32>;//индексы ближайших к текущей вершине вершин
/*
struct ANear {
size: u32,//
index : array<u32>,//индексы ближайших к текущей вершине вершин
}
@group(0) @binding(1) var<storage, read_write> aNear : ANear;
*/
@group(0) @binding(2) var<storage, read_write> aNearDistance : array<f32>;//distance between current vertice and nearest vertices.

//params

struct Params {
c: f32,//constant scaling factor. See Fermat's spiral https://en.wikipedia.org/wiki/Fermat%27s_spiral for details.
}
@group(0) @binding(3) var<uniform> params : Params;
/*
struct ParamsU {
//a: u32,
phase: u32,
}
@group(0) @binding(3) var<uniform> paramsU : ParamsU;
*/
@group(0) @binding(4) var<uniform> phase : u32;

@compute @workgroup_size(1)//, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {

	let i = global_id.x;//fermatSpiral vertice index

//	switch (paramsU.phase)
	switch (phase)
	{

		//Vertices
		case 0: {
			let angleInRadians = f32(i) * a - b;
			let radius = params.c * sqrt(f32(i));
			var index = i * verticesRowSize;
			verticesMatrix[index] = radius * cos(angleInRadians);
			index++;
			verticesMatrix[index] = radius * sin(angleInRadians);

			//debug
/*
			if (debugCount > 0) {
				index++;
				//verticesMatrix[index] = f32(global_id.x);
				verticesMatrix[index] = pi;
			}
			if (debugCount > 1) {
				index++;
				//verticesMatrix[index] = f32(paramsU.phase);
				verticesMatrix[index] = angleInRadians;
			}
*/
			break;
		}

		//aNear
		case 1: {
			var index = i * aNearRowLength;
			var aNearLengthIndex = index;//индекс места для количества обнаруженных индексов вершин, ближайших к текущей вершине
			var iMaxIndex = index + 1;//индекс места для хранения индекса максимально удаленной вершины из массива aNear
			var aNearIndex = index + 2;//индекс индекса первой обнаруженной вершины, ближайших к текущей вершине
			let vertex1Index = i * verticesRowSize;
//			let vertex1 = verticesMatrix[vertex1Index];
			let vertex1 = vec2(verticesMatrix[vertex1Index], verticesMatrix[vertex1Index + 1]);
//			aNear[index] = u32(abs(vertex1.x * 100000.0f));
//			index++;
//			var aNearDistanceIndex = index;
			var aNearDistanceIndex = i * maxLength;//в этом массиве нет отладочной информации
/*
			aNear[index] = u32(abs(verticesMatrix[verticesRowSize] * 100000.0f));
			index++;
			aNear[index] = u32(abs(verticesMatrix[21 * verticesRowSize] * 100000.0f));
*/
			//			aNear[index] = u32(0.02701997011899948f * 1000.0f);
//			aNear[index] = global_id.x;
//			let vertex2 = verticesMatrix[vertex1Index + 1];
//			aNearDistance[aNearDistanceIndex + 1] = vertex2;
			var verticesMatrixLength = arrayLength(&verticesMatrix) / verticesRowSize;//22
			for (var j = 0u; j < verticesMatrixLength; j++) {
				if (i == j) { continue; }
				let vertex2Index = j * verticesRowSize;
				let vertex2 = vec2(verticesMatrix[vertex2Index], verticesMatrix[vertex2Index + 1]);
				let vecDistance = distance(vertex1, vertex2);
				if (aNear[aNearLengthIndex] < maxLength) {

					aNear[aNearIndex + aNear[aNearLengthIndex]] = j;//запомнить индекс текущей ближайшей вершины в ячейке с индексом, равным индексу первой обнаруженной вершины плюс клличество уже обнаруженных вершин
					aNearDistance[aNearDistanceIndex + aNear[aNearLengthIndex]] = vecDistance;
					aNear[aNearLengthIndex]++;
					getMax(iMaxIndex, aNearLengthIndex, i);

				} else {

				}
/*
if (j == 2) {
//	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vecDistance;

	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vertex1.x;
	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vertex1.y;
	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vertex2.x;
	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vertex2.y;
}
*/

			}
/*
			var indexDebug = index + aNearRowLength - debugCount;
			aNear[indexDebug] = aNearIndex;// verticesMatrixLength;
			indexDebug++;
			aNear[indexDebug] = aNearLengthIndex;
*/
			break;
		}

		//error message
		default: {
/*
			let zero = 0;
			let error = 1 / zero;
			aNear[i] = error;
*/
		}
	}
}

//Найти индекс максимально удаленной вершины из массива aNear
fn getMax(iMaxIndex : u32, aNearLengthIndex : u32, i : u32) {

//	aNear[iMaxIndex] = aNear[aNearLengthIndex];
	var iMax = 0u;//aNear[iMaxIndex];
	let aNearDistanceIndex = i * maxLength;
	for (var aNearIndex = 0u; aNearIndex < aNear[aNearLengthIndex]; aNearIndex++) {

		if (aNearDistance[aNearDistanceIndex + iMax] < aNearDistance[aNearDistanceIndex + aNearIndex]) { iMax = aNearIndex; }
		/*
		//debug
		if (i == 1) {
			verticesMatrix[i * verticesRowSize + 2] = aNearDistance[aNearDistanceIndex + iMax];
			verticesMatrix[i * verticesRowSize + 3] = aNearDistance[aNearDistanceIndex + i];
			aNear[i * aNearRowLength + 9] = aNearDistanceIndex;
			aNear[i * aNearRowLength + 10] = iMax;
		}
		*/

	}
	aNear[iMaxIndex] = iMax;
/*
	for (var i = 0; i < aNear.length; i++) {

		if (iMax == = undefined) iMax = i;
		else if (aNear[iMax].distance < aNear[i].distance) iMax = i;

	}
	if (iMax != undefined) aNear.iMax = iMax;
	else console.error('FermatSpiral: Vector aNear add getMax. Invalid iMax = ' + iMax);
*/

}

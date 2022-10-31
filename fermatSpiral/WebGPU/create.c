//Вычисляем координаты точек fermat spiral

const debugCount = %debugCountu;//Count of out debug values.

const verticesRowSize = 2u + debugCount;//в каждом ряду по две точки. Сюда можно добавить несколько отдадочных значений
const golden_angle = 137.5077640500378546463487;//137.508;//https://en.wikipedia.org/wiki/Golden_angle
const pi : f32 = 3.141592653589793;//Проблема с точностью. На самом деле получается 3.1415927410125732 ошибка уже в 8 знаке
const a = golden_angle * pi / 180.0;
const b = 90 * pi / 180.0;

const aNearRowLength = %aNearRowLengthu;//количество обнаруженных индексов вершин, ближайших к текущей вершине
//плюс индекс максимально удаленной вершины из массива aNear
//плюс максимальное количство индексов вершин, ближайших к текущей вершине
//плюс отладочная информация

//максимальное количество ребер вершины
const maxLength = aNearRowLength
- 1//место для количества обнаруженных индексов вершин, ближайших к текущей вершине
- 1//место для индекса максимально удаленной вершины из массива aNear
- debugCount;//считается что место для отладочной информации в массиве индексов ближайших к текущей вершине вершин равно количеству мест для отладочной информации в массиве verticesMatrix с вершинами fermat spiral

@group(0) @binding(0) var<storage, read_write> verticesMatrix : array<f32>;
struct ANearItem {
length: u32,//количества обнаруженных индексов вершин, ближайших к текущей вершине
iMax: u32,
aNear : array<u32, maxLength>,
debug: array<u32, debugCount>,
}
@group(0) @binding(1) var<storage, read_write> aNear : array<ANearItem>;//<u32>;//индексы ближайших к текущей вершине вершин
@group(0) @binding(2) var<storage, read_write> aNearDistance : array<f32>;//distance between current vertice and nearest vertices.
struct Edges {
length: u32,
indices : array<u32>,
}
@group(0) @binding(3) var<storage, read_write> edges : Edges;

//params

struct Params {
c: f32,//constant scaling factor. See Fermat's spiral https://en.wikipedia.org/wiki/Fermat%27s_spiral for details.
}
@group(0) @binding(4) var<uniform> params : Params;
@group(0) @binding(5) var<uniform> phase : u32;

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
//			var aNearItem = aNear[i];
			var aNearLengthIndex = index;//индекс места для количества обнаруженных индексов вершин, ближайших к текущей вершине
			var iMaxIndex = index + 1;//индекс места для хранения индекса максимально удаленной вершины из массива aNear
			var aNearIndex = index + 2;//индекс индекса первой обнаруженной вершины, ближайших к текущей вершине
			let vertice1Index = i * verticesRowSize;
			let vertice1 = vec2(verticesMatrix[vertice1Index], verticesMatrix[vertice1Index + 1]);
			var aNearDistanceIndex = i * maxLength;//в этом массиве нет отладочной информации
			var verticesMatrixLength = arrayLength(&verticesMatrix) / verticesRowSize;//22
			for (var j = 0u; j < verticesMatrixLength; j++) {
				if (i == j) { continue; }
				let vertice2Index = j * verticesRowSize;
				let vertice2 = vec2(verticesMatrix[vertice2Index], verticesMatrix[vertice2Index + 1]);
				let vecDistance = distance(vertice1, vertice2);
//				if (aNear[aNearLengthIndex] < maxLength)
				if (aNear[i].length < maxLength) {

//					aNear[aNearIndex + aNear[aNearLengthIndex]] = j;//запомнить индекс текущей ближайшей вершины в ячейке с индексом, равным индексу первой обнаруженной вершины плюс клличество уже обнаруженных вершин
					aNear[i].aNear[aNear[i].length] = j;//добавить индекс текущей ближайшей вершины
//					aNearDistance[aNearDistanceIndex + aNear[aNearLengthIndex]] = vecDistance;
					aNearDistance[aNearDistanceIndex + aNear[i].length] = vecDistance;
//					aNear[aNearLengthIndex]++;
					aNear[i].length++;
					getMax(/*iMaxIndex, aNearLengthIndex, */i);

				} else {

//					let aNearDistanceMaxIndex = aNearDistanceIndex + aNear[iMaxIndex];
					let aNearDistanceMaxIndex = aNearDistanceIndex + aNear[i].iMax;
					if (aNearDistance[aNearDistanceMaxIndex] > vecDistance) {

						/*
						//debug
						if ((i == 1) && (j == 9)) {
							var indexDebug = index + aNearRowLength - debugCount;
							aNear[indexDebug] = i;// aNear[iMaxIndex];
							indexDebug++;
							aNear[indexDebug] = j;
							verticesMatrix[i * verticesRowSize + 2 + 0] = vecDistance;
							verticesMatrix[i * verticesRowSize + 2 + 1] = aNearDistance[aNearDistanceMaxIndex];
						}
						*/

						aNearDistance[aNearDistanceMaxIndex] = vecDistance;
//						aNear[aNear.iMax] = newItem;
						getMax(/*iMaxIndex, aNearLengthIndex, */i);

					}

				}
/*
if (j == 2) {
//	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vecDistance;

	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vertice1.x;
	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vertice1.y;
	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vertice2.x;
	aNearDistanceIndex++;
	aNearDistance[aNearDistanceIndex] = vertice2.y;
}
*/

			}
//			for (var k = 0u; k < aNear[aNearLengthIndex]; k++)
			for (var k = 0u; k < aNear[i].length; k++) {
				let i1 = aNear[aNearIndex + k];
				var boDuplicate = false;
				edges.length = 123;
				edges.indices[5] = 456;
				/*
				//debug
				if (k == 1) {
					var indexDebug = index + aNearRowLength - debugCount;
					aNear[indexDebug] = i1;
					indexDebug++;
					aNear[indexDebug] = aNearLengthIndex;
				}
				*/
				//for (var j = 0u; j < edges.length; j++){}
			}
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
fn getMax(
//	iMaxIndex : u32,//индекс места для хранения индекса максимально удаленной вершины из массива aNear
//	aNearLengthIndex : u32,//индекс места для количества обнаруженных индексов вершин, ближайших к текущей вершине
	i : u32//fermatSpiral vertice index
) {

	var iMax = 0u;
	let aNearDistanceIndex = i * maxLength;
//	var aNearItem = aNear[i];
//	for (var aNearIndex = 0u; aNearIndex < aNear[aNearLengthIndex]; aNearIndex++)
	for (var aNearIndex = 0u; aNearIndex < aNear[i].length; aNearIndex++) {

		if (aNearDistance[aNearDistanceIndex + iMax] < aNearDistance[aNearDistanceIndex + aNearIndex]) { iMax = aNearIndex; }
		/*
		//debug
		if (i == 1) {
			verticesMatrix[i * verticesRowSize + 2 + 0] = aNearDistance[aNearDistanceIndex + iMax];
			verticesMatrix[i * verticesRowSize + 2 + 1] = aNearDistance[aNearDistanceIndex + i];
			aNear[i * aNearRowLength + 9] = aNearDistanceIndex;
			aNear[i * aNearRowLength + 10] = iMax;
		}
		*/

	}
//	aNear[iMaxIndex] = iMax;
	aNear[i].iMax = iMax;

}

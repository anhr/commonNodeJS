//Вычисляем координаты точек точки fermat spiral
const debugCount = %debugCountu;//Count of out debug values.

const rowSize = 2u + debugCount;//в каждом ряду по две точки. Сюда можно добавить несколько отдадочных значений
const golden_angle = 137.5077640500378546463487;//137.508;//https://en.wikipedia.org/wiki/Golden_angle
const pi = 3.141592653589793;
const a = golden_angle * pi / 180.0;
const b = 90 * pi / 180.0;
@group(0) @binding(0) var<storage, read_write> verticesMatrix : array<f32>;

const aNearRowLength = %aNearRowLengthu;//у каждой вершины по индекса ближайших вершин
@group(0) @binding(1) var<storage, read_write> aNear : array<u32>;

//params

struct Params {
c: f32,//constant scaling factor. See Fermat's spiral https://en.wikipedia.org/wiki/Fermat%27s_spiral for details.
}
@group(0) @binding(2) var<uniform> params : Params;
/*
struct ParamsU {
//a: u32,
phase: u32,
}
@group(0) @binding(3) var<uniform> paramsU : ParamsU;
*/
@group(0) @binding(3) var<uniform> phase : u32;

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
			var index = i * rowSize;
			verticesMatrix[index] = radius * cos(angleInRadians);
			index++;
			verticesMatrix[index] = radius * sin(angleInRadians);

			//debug
			if (debugCount > 0) {
				index++;
				verticesMatrix[index] = f32(global_id.x);
			}
/*
			if (debugCount > 1) {
				index++;
				verticesMatrix[index] = f32(paramsU.phase);
			}
*/
			break;
		}

		//aNear
		case 1: {
			var index = i * aNearRowLength;
			var vertexIndex = i * rowSize;
			aNear[index] = u32(abs(verticesMatrix[vertexIndex] * 100000.0f));
/*
			aNear[index] = u32(abs(verticesMatrix[rowSize] * 100000.0f));
			index++;
			aNear[index] = u32(abs(verticesMatrix[21 * rowSize] * 100000.0f));
*/
			//			aNear[index] = u32(0.02701997011899948f * 1000.0f);
			index++;
			aNear[index] = global_id.x;
			index++;
//			aNear[index] = paramsU.phase;
			aNear[index] = phase;
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

//Вычисляем координаты точек точки fermat spiral
const debugCount = %debugCountu;//Count of out debug values.
const rowSize = 2u + debugCount;//в каждом ряду по две точки. Сюда можно добавить несколько отдадочных значений

const golden_angle = 137.5077640500378546463487;//137.508;//https://en.wikipedia.org/wiki/Golden_angle
const pi = 3.141592653589793;
const a = golden_angle * pi / 180.0;
const b = 90 * pi / 180.0;
/*
const dimension = 2u;//Dimension of resultMatrix
struct Matrix {//5.2.10. Structure Types https://gpuweb.github.io/gpuweb/wgsl/#struct-types
	dimension: f32,
//	size: VectorF32,//vec2<f32>,
	size : array<f32, dimension>,//5.2.9. Array Types https://gpuweb.github.io/gpuweb/wgsl/#fixed-size-array
	numbers : array<f32>,
}
*/

//@group(0) @binding(0) var<storage, read_write> resultMatrix : Matrix;
@group(0) @binding(0) var<storage, read_write> resultMatrix : array<f32>;

//params
struct Params {
//count: f32,//fermatSpiral points count
c : f32,//constant scaling factor. See Fermat's spiral https://en.wikipedia.org/wiki/Fermat%27s_spiral for details.
}
@group(0) @binding(1) var<uniform> params : Params;

//@compute @workgroup_size(8, 8)
//@compute @workgroup_size(8)
//@compute @workgroup_size(%workgroup_size)
@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {

/*
//	debugMatrix.size = vec2(500, 2);

	resultMatrix.dimension = f32(dimension);//fermatSpiral points count. Каждый ряд это координата точки 
	//	resultMatrix.size = vec2(params.count, 2);//каждый ряд это координаты точки fermat spiral
	resultMatrix.size[0] = params.count;//fermatSpiral points count. Каждый ряд это координата точки 
	resultMatrix.size[1] = 2 + 1;//в каждом ряду по две точки. Сюда можно добавить несколько отдадочных значений
//	resultMatrix.size[2] = 2;//for debug
*/
//	let resultCell = vec2(global_id.x, global_id.y);
	let i = global_id.x;//fermatSpiral vertice index

	let angleInRadians = f32(i) * a - b;
	let radius = params.c * sqrt(f32(i));
//	let vertice = vec2(radius * cos(angleInRadians), radius * sin(angleInRadians));
/*
					const angleInRadians = i * a - b;
					const radius = settings.c * Math.sqrt(i);
					points.push(new Vector([radius * Math.cos(angleInRadians), radius * Math.sin(angleInRadians)]));
*/
//	let result = vec2(123.4, 456.7);
/*
	var result = 0.0;
	for (var i = 0u; i < u32(firstMatrix.size.y); i = i + 1u) {
		let a = i + resultCell.x * u32(firstMatrix.size.y);
		let b = resultCell.y + i * u32(secondMatrix.size.y);
		result = result + firstMatrix.numbers[a] * secondMatrix.numbers[b];
	}
*/
	//сейчас resultCell.y = 0
//	let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);

	/*//Не использую что бы не делать лишних вычислений
	//Индекс resultMatrix равен произведению resultCell.x на произведение значений от resultMatrix.size[1] до resultMatrix.size[dimension - 1]
	var size = resultMatrix.size[1];
	for (var i = 2u; i < dimension; i++) {
		size *= resultMatrix.size[i];
	}
	let index = resultCell.y + resultCell.x * u32(size);
	*/
	//let index = resultCell.y + resultCell.x * u32(resultMatrix.size[1] * resultMatrix.size[2]);
//	let index = resultCell.y + resultCell.x * u32(resultMatrix.size[1]);
//	let index = i * u32(resultMatrix.size[1]);
	var index = i * rowSize;
/*
	resultMatrix.numbers[index] = result.x;
	resultMatrix.numbers[index + 1] = result.y;

	//debug
	resultMatrix.numbers[index + 2] = f32(global_id.x);
//	resultMatrix.numbers[index + 3] = f32(global_id.y);
*/
	resultMatrix[index] = radius * cos(angleInRadians);
	index++;
	resultMatrix[index] = radius * sin(angleInRadians);
	//resultMatrix[index] = result.y;

	//debug
	if (debugCount > 0) {
		index++;
		resultMatrix[index] = f32(global_id.x);
	}
	//	resultMatrix[index + 3] = f32(global_id.y);
/*
resultMatrix.numbers[index + 4] = 45.6;
resultMatrix.numbers[index + 5] = 47.8;
*/
	//	resultMatrix.numbers[index] = f32(resultCell.x * u32(resultMatrix.size[1] + resultMatrix.size[2]));

	//debug
	//resultMatrix.numbers[index + 1] = global_id.x;
	//resultMatrix.numbers[index + 2] = global_id.y;
	/*
	let debugIndex = index * 2u;
	debugMatrix.numbers[debugIndex] = global_id.x;
	debugMatrix.numbers[debugIndex + 1] = global_id.y;
*/
}

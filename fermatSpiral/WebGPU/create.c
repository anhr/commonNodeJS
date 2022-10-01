//Вычисляем координаты точек точки fermat spiral
const dimension = 3;//Dimension of resultMatrix
struct Matrix {//5.2.10. Structure Types https://gpuweb.github.io/gpuweb/wgsl/#struct-types
	dimension: f32,
//	size: VectorF32,//vec2<f32>,
	size : array<f32, dimension>,//5.2.9. Array Types https://gpuweb.github.io/gpuweb/wgsl/#fixed-size-array
	numbers : array<f32>,
}


//@group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
//@group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
@group(0) @binding(0) var<storage, read_write> resultMatrix : Matrix;
/*
//debug
struct DebugMatrix {
size: vec2<u32>,
numbers : array<u32>,
}
@group(0) @binding(3) var<storage, read_write> debugMatrix : DebugMatrix;
*/
//params
struct Params {
	count: f32,//fermatSpiral points count
}
@binding(1) @group(0) var<uniform> params : Params;

//@compute @workgroup_size(8, 8)
@compute @workgroup_size(8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {

/*
	// Guard against out-of-bounds work group sizes
	if (global_id.x >= u32(firstMatrix.size.x) || global_id.y >= u32(secondMatrix.size.y)) {
		return;
	}
*/
//	debugMatrix.size = vec2(500, 2);

	resultMatrix.dimension = dimension;//fermatSpiral points count. Каждый ряд это координата точки 
	//	resultMatrix.size = vec2(params.count, 2);//каждый ряд это координаты точки fermat spiral
	resultMatrix.size[0] = params.count;//fermatSpiral points count. Каждый ряд это координата точки 
	resultMatrix.size[1] = 3;//в каждом ряду по две точки
	resultMatrix.size[2] = 2;//for debug
	let resultCell = vec2(global_id.x, global_id.y);
	let result = vec2(123.4, 456.7);
//	result = 123.4;
	/*
	var result = 0.0;
	for (var i = 0u; i < u32(firstMatrix.size.y); i = i + 1u) {
		let a = i + resultCell.x * u32(firstMatrix.size.y);
		let b = resultCell.y + i * u32(secondMatrix.size.y);
		result = result + firstMatrix.numbers[a] * secondMatrix.numbers[b];
	}
*/
//	let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
	let index = resultCell.y + resultCell.x * u32(resultMatrix.size[1] * resultMatrix.size[2]);
	resultMatrix.numbers[index] = result.x;
	resultMatrix.numbers[index + 1] = result.y;

	//debug
	resultMatrix.numbers[index + 2] = f32(global_id.x);
	resultMatrix.numbers[index + 3] = f32(global_id.y);

resultMatrix.numbers[index + 4] = 45.6;
resultMatrix.numbers[index + 5] = 47.8;
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

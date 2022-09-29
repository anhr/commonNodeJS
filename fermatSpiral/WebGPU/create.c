//Вычисляем координаты точек точки fermat spiral
struct Matrix {
size: vec2<f32>,
numbers : array<f32>,
}


@group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
@group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
@group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

//debug
struct DebugMatrix {
size: vec2<u32>,
numbers : array<u32>,
}
@group(0) @binding(3) var<storage, read_write> debugMatrix : DebugMatrix;
//@group(0) @binding(4) var<storage, read_write> debugIndex : u32;
//var<private> debugIndex = 0u;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {

/*
	// Guard against out-of-bounds work group sizes
	if (global_id.x >= u32(firstMatrix.size.x) || global_id.y >= u32(secondMatrix.size.y)) {
		return;
	}
*/
	debugMatrix.size = vec2(500, 2);
//	debugMatrix.numbers[20] = 789.1;

//	resultMatrix.size = vec2(firstMatrix.size.x, secondMatrix.size.y);
	resultMatrix.size = vec2(500, 2);//каждый ряд это координаты точки fermat spiral
	let resultCell = vec2(global_id.x, global_id.y);
	var result = 123.4;
/*
	var result = 0.0;
	for (var i = 0u; i < u32(firstMatrix.size.y); i = i + 1u) {
		let a = i + resultCell.x * u32(firstMatrix.size.y);
		let b = resultCell.y + i * u32(secondMatrix.size.y);
		result = result + firstMatrix.numbers[a] * secondMatrix.numbers[b];
	}
*/
	let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
	resultMatrix.numbers[index] = result;
/*
	debugIndex = debugIndex + 1u;
	debugMatrix.numbers[index] = debugIndex;
*/
	let debugIndex = index * 2u;
	debugMatrix.numbers[debugIndex] = global_id.x;
	debugMatrix.numbers[debugIndex + 1] = global_id.y;
}

/**
 * @module WebGPU
 * @description [WebGPU]{@link https://gpuweb.github.io/gpuweb/}. GPU Compute on the web.
 * @see [Get started with GPU Compute on the web]{@link https://web.dev/gpu-compute/}
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

//import loadScript from '../loadScriptNodeJS/loadScript.js'
import loadFile from '../loadFileNodeJS/loadFile.js'

class WebGPU {

	/**
	 * [WebGPU]{@link https://gpuweb.github.io/gpuweb/}. GPU Compute on the web.
	 * @param {object} settings The following settings are available
	 * @param {object} [settings.input] Input values for WebGPU. The following Input values are available:
	 * @param {Array} [settings.input.matrices] Array of input matrices. See [Shader programming]{@link  https://web.dev/gpu-compute/#shader-programming}.
	 * <pre>
	 * Example:
	 * <b>[
	 *   [
	 *      [1, 2, 3, 4],
	 *      [5, 6, 7, 8]
	 *   ],
	 *   [
	 *      [1, 2],
	 *      [3, 4],
	 *      [5, 6],
	 *      [7, 8],
	 *   
	 *]</b>
	 * </pre>
	 * @param {object} [settings.input.params] input parameters list
	 * @param {object} [settings.input.params.type=Uint32Array] type of the input parameters list. Allowed <b>Float32Array</b> and <b>Uint32Array</b>.
	 * <pre>
	 * Example:
	 * <b>params: {
	 *   type: Float32Array,
	 *   c: 0.04,
	 *   count: 10,
	 *},</b>
	 * </pre>
	 * @param {Function} [settings.out] <b>function(out)</b> called when output data is ready. <b>out</b> argument is array of output data. See [ArrayBuffer]{@link https://webidl.spec.whatwg.org/#idl-ArrayBuffer}.
	 * @param {Number} [settings.resultMatrixBufferSize] The size of the output buffer in bytes.
	 * @param {Array} [settings.workgroupCount=[1]] For dispatch work to be performed with the current GPUComputePipeline.
	 * <pre>
	 * See [dispatchWorkgroups]{@link https://gpuweb.github.io/gpuweb/#dom-gpucomputepassencoder-dispatchworkgroups} of [GPUComputePipeline]{@link https://gpuweb.github.io/gpuweb/#gpucomputepipeline}.
	 * <b>workgroupCount[0]</b> is <b>workgroupCountX</b>
	 * <b>workgroupCount[1]</b> is <b>workgroupCountY</b>
	 * <b>workgroupCount[2]</b> is <b>workgroupCountZ</b>
	 * </pre>
	 * @param {USVString} [settings.shaderCode] The [WGSL]{@link https://gpuweb.github.io/gpuweb/wgsl/} source code for the shader module. See [USVString]{@link https://webidl.spec.whatwg.org/#idl-USVString}.
	 * @param {String} [settings.shaderCodeFile] The name of the file with [WGSL]{@link https://gpuweb.github.io/gpuweb/wgsl/} source code.
	 * Have effect only if the <b>shaderCode</b> undefined.
	 * @param {Function} [settings.shaderCodeText] <b>function(text)</b> called after downloading of the shader code from file and before creating of the Shader Module.
	 * See [createShaderModule(descriptor)]{@link https://gpuweb.github.io/gpuweb/#dom-gpudevice-createshadermodule}
	 * <pre>
	 * The <b>text</b> argument is text of the shader code. You can modify shader code and return new text.
	 * Example:
	 * <b>shaderCodeText: function (text) {
	 *   return text.replace( '%debugCount', 1 );
	 *},</b>
	 * </pre>
	 */
	constructor(settings) {

		let gpuDevice = null;

		//https://gpuweb.github.io/gpuweb/#initialization-examples
		async function initializeWebGPU() {

			// Check to ensure the user agent supports WebGPU.
//			if (!('gpu' in navigator))
			if ( !WebGPU.isSupportWebGPU() )
			{
				console.error("WebGPU: User agent doesn't support WebGPU. WebGPU is available for now in Chrome Canary https://www.google.com/intl/ru/chrome/canary/ on desktop behind an experimental flag. You can enable it at chrome://flags/#enable-unsafe-webgpu. The API is constantly changing and currently unsafe. As GPU sandboxing isn't implemented yet for the WebGPU API, it is possible to read GPU data for other processes! Don't browse the web with it enabled.");
				return;
			}

			// Request an adapter.
			const gpuAdapter = await navigator.gpu.requestAdapter();

			// requestAdapter may resolve with null if no suitable adapters are found.
			if (!gpuAdapter) {
				console.error('No WebGPU adapters found.');
				return false;
			}

			// Request a device.
			// Note that the promise will reject if invalid options are passed to the optional
			// dictionary. To avoid the promise rejecting always check any features and limits
			// against the adapters features and limits prior to calling requestDevice().
			gpuDevice = await gpuAdapter.requestDevice();

			// requestDevice will never return null, but if a valid device request can't be
			// fulfilled for some reason it may resolve to a device which has already been lost.
			// Additionally, devices can be lost at any time after creation for a variety of reasons
			// (ie: browser resource management, driver updates), so it's a good idea to always
			// handle lost devices gracefully.
			gpuDevice.lost.then((info) => {
				console.error(`WebGPU device was lost: ${info.message}`);

				gpuDevice = null;

				// Many causes for lost devices are transient, so applications should try getting a
				// new device once a previous one has been lost unless the loss was caused by the
				// application intentionally destroying the device. Note that any WebGPU resources
				// created with the previous device (buffers, textures, etc) will need to be
				// re-created with the new one.
				if (info.reason != 'destroyed') {
					initializeWebGPU();
				}
			});

			onWebGPUInitialized();

//			return true;

		}

		function onWebGPUInitialized() {

			const input = settings.input;
			let bindGroupLayout, bindGroup,
				paramBuffer;
			if (input) {

				if (input.matrices)
					input.matrices.forEach(inputMatrux => {

						//create matrix
						const matrix = [
							inputMatrux.length,//rows
							inputMatrux[0].length,//columns
						];
						inputMatrux.forEach(row => row.forEach(value => matrix.push(value)));
						inputMatrux.matrix = new Float32Array(matrix);

						inputMatrux.gpuBuffer = gpuDevice.createBuffer({
							mappedAtCreation: true,
							size: inputMatrux.matrix.byteLength,
							usage: GPUBufferUsage.STORAGE
						});
						new Float32Array(inputMatrux.gpuBuffer.getMappedRange()).set(inputMatrux.matrix);
						inputMatrux.gpuBuffer.unmap();

					});

				//params

				if (input.params) {

					let paramBufferSize = 0,
						dataType;//true - Uint32Array, false - Float32Array
					Object.keys(input.params).forEach( function (key) {
		
						if (key === 'type') return;
						const param = input.params[key];
						if (typeof param === "number") {

							input.params.type ||= Uint32Array;
							function isInt(n) { return n % 1 === 0; }
							const isInteger = isInt(param);
							if(
//								(isInteger && (input.params.type === Float32Array)) ||
								(!isInteger && (input.params.type === Uint32Array))
							) {

								console.error('WebGPU: Invalid ' + key + ' = ' + param + ' parameter type. ' + (input.params.type === Uint32Array ? 'Integer' : 'Float' ) + ' is allowed only.' );
								return;
								
							}
							paramBufferSize += input.params.type.BYTES_PER_ELEMENT;
/*							
							function isInt(n) { return n % 1 === 0; }
							const arrayType = isInt(param);
							if ((dataType != undefined ) && (dataType != arrayType) ) {

								console.error('WebGPU: different types of parameters is not allowed');
								return;
								
							}
							else dataType = arrayType;
							if (arrayType)
								paramBufferSize += Uint32Array.BYTES_PER_ELEMENT;
							else paramBufferSize += Float32Array.BYTES_PER_ELEMENT;
*/							

						} else console.error('WebGPU: Invalid param: ' + param);
					} );
/*					
					console.warn('сейчас возможен только один параметр с плавающей точкой')
					const paramBufferSize = 1 * Float32Array.BYTES_PER_ELEMENT;
*/	 
					paramBuffer = gpuDevice.createBuffer({

						size: paramBufferSize,
						usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,

					});
					gpuDevice.queue.writeBuffer(

						paramBuffer,
						0,
						new Float32Array([
							input.params.count,
						])
					);

				}

			}

			// Result Matrix

/*
			if (settings.resultMatrixBufferSize === undefined) {

				console.error('WebGPU: Invalid settings.resultMatrixBufferSize = ' + settings.resultMatrixBufferSize);
				return;

			}
*/
			let resultMatrixBuffer, resultMatrixBufferSize;
			if (settings.resultMatrixBufferSize !== undefined) {

				//resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + settings.resultMatrixBufferSize);
				resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * settings.resultMatrixBufferSize;
				resultMatrixBuffer = gpuDevice.createBuffer({

					size: resultMatrixBufferSize,
					usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC

				});

			}

			// Bind group layout and bind group

			const entriesBindGroupLayout = [], entriesBindGroup = [];
			let binding = 0;
			if (input && input.matrices) for (var i = 0; i < input.matrices.length; i++) {

				entriesBindGroupLayout.push({

					binding: binding,//i,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "read-only-storage" }

				});
				entriesBindGroup.push({

					binding: binding,//i,
					resource: { buffer: input.matrices[i].gpuBuffer }

				});
				binding++;

			}
			entriesBindGroupLayout.push({

				binding: binding,//input.length,
				visibility: GPUShaderStage.COMPUTE,
				buffer: { type: "storage" }

			});
			entriesBindGroup.push({

				binding: binding,//input.length,
				resource: { buffer: resultMatrixBuffer }

			});
			binding++;
			if (paramBuffer) {

				//				const binding = input.length + 2;
				entriesBindGroupLayout.push({

					binding: binding,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "uniform" }

				});
				entriesBindGroup.push({
					binding: binding,
					resource: { buffer: paramBuffer, }
				});
				binding++;

			}


			bindGroupLayout = gpuDevice.createBindGroupLayout({ entries: entriesBindGroupLayout });

			bindGroup = gpuDevice.createBindGroup({

				layout: bindGroupLayout,
				entries: entriesBindGroup

			});

			// Compute shader code

			const shaderCode = settings.shaderCode;
			if (shaderCode)
				onLoad(shaderCode)
			else loadFile.async(settings.shaderCodeFile, { onload: function (shaderCode, url ) { onLoad(shaderCode) } } );
			async function onLoad(shaderCode) {

				if (settings.shaderCodeText) shaderCode = settings.shaderCodeText(shaderCode);
				const shaderModule = gpuDevice.createShaderModule({ code: shaderCode });

				// Pipeline setup

				const computePipeline = gpuDevice.createComputePipeline({
					layout: gpuDevice.createPipelineLayout({
						bindGroupLayouts: [bindGroupLayout]
					}),
					compute: {
						module: shaderModule,
						entryPoint: "main"
					}
				});

				// Commands submission

				//https://gpuweb.github.io/gpuweb/#dom-gpudevice-createcommandencoder
				const commandEncoder = gpuDevice.createCommandEncoder();

				const passEncoder = commandEncoder.beginComputePass();
				passEncoder.setPipeline(computePipeline);
				passEncoder.setBindGroup(0, bindGroup);//set @group(0) in the shading code

				let workgroupCount = [];
				if (input && input.matrices)
					input.matrices.forEach((item, i) => workgroupCount.push(Math.ceil(item.matrix[i] / 8)));
				else {
					
//					console.log('under constaction')
					if (settings.workgroupCount) workgroupCount = settings.workgroupCount;
					else {
						
						workgroupCount.push(1);
	//					workgroupCount.push(1);

					}

				}
				const workgroupCountX = workgroupCount[0], workgroupCountY = workgroupCount[1], workgroupCountZ = workgroupCount[3];

				//https://gpuweb.github.io/gpuweb/#dom-gpucomputepassencoder-dispatchworkgroups
				passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY, workgroupCountZ);
				passEncoder.end();

				// Get a GPU buffer for reading in an unmapped state.
				const gpuReadBuffer = gpuDevice.createBuffer({
					size: resultMatrixBufferSize,
					usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
				});

				// Encode commands for copying buffer to buffer.
				commandEncoder.copyBufferToBuffer(
					resultMatrixBuffer, // source buffer
					0, // source offset
					gpuReadBuffer, // destination buffer
					0, // destination offset
					resultMatrixBufferSize // size
				);

				// Submit GPU commands.
				const gpuCommands = commandEncoder.finish();
				gpuDevice.queue.submit([gpuCommands]);

				// Read buffer.
				await gpuReadBuffer.mapAsync(GPUMapMode.READ);
				const arrayBuffer = gpuReadBuffer.getMappedRange();
				if (settings.out) settings.out(arrayBuffer);

			}

		}

		initializeWebGPU();

	}

}

/**
 * @returns true if your browser supports [WebGPU]{@link https://gpuweb.github.io/gpuweb/}.
 * WebGPU is available for now in [Chrome Canary]{@link https://www.google.com/intl/ru/chrome/canary/} on desktop behind an experimental flag.
 * You can enable it at <b>chrome://flags/#enable-unsafe-webgpu</b>.
 * The API is constantly changing and currently unsafe.
 * As GPU sandboxing isn't implemented yet for the WebGPU API, it is possible to read GPU data for other processes! Don't browse the web with it enabled.
 * */
WebGPU.isSupportWebGPU = function () { return 'gpu' in navigator; }

/**
 * Converts the <b>out</b> array to matrix.
 * @param {ArrayBuffer} out out [ArrayBuffer]{@link https://webidl.spec.whatwg.org/#idl-ArrayBuffer}. See <b>settings.out</b> param of WebGPU for details.
 * @param {Array} [size] size of result matrix.
 * <pre>
 * <b>size.length</b> is dimension of result matrix.
 * <b>size[0]</b> is first dimension.
 * ---
 * <b>size[i]</b> is next dimension.
 * ---
 * <b>size[size.length - 1]</b> is last dimension.
 * Esample:
 * <b>[
 *   10,//rows count
 *   2//columns count
 * ]
 * </b>
 * creates two dimesional matrix with 10 rows and 2 columns.
 * 
 * If <b>size</b> is undefined, then dimension and size of result matrix must be defined in the header of the out:
 * First item of the out is dimension of result matrix.
 * Second item of the out is first dimension.
 * ---
 * Next item of the out is next dimension.
 * ---
 * dimension item of the out is last dimension.
 * Example:
 * <b>
 * const array = new Float32Array(out);
 * </b>
 * if
 * <b>
 * array[0] = 2//two dimesional matrix
 * array[1] = 10//rows count
 * array[2] = 2//columns count
 * </b>
 * then result matrix is two dimensional matrix with ten rows and two columns.
 * </pre>
 * @returns result matrix.
 */
WebGPU.out2Matrix = function(out, size) {
	
	const array = out.type ? new out.type(out) : new Float32Array(out),
		matrix = [];
	let valueIndex,
		dimension;//Dimension of resultMatrix
	if (size){

		dimension = size.length;
		valueIndex = 0;
		
	} else {
		
		dimension = array[0];
		valueIndex = dimension + 1;

	}
	function iteration (level, matrixLevel) {

		if (level > dimension) return;
		const levelCount = size ? size[level -1] : array[level];
		for (let i = 0; i < levelCount; i++){

			const matrixNextLevel = [];
			matrixLevel.push(matrixNextLevel);
			if (level === (dimension - 1)) {

				const length = size ? size[dimension - 1] : array[dimension];
				for (let j = 0; j < length; j++) {
					
					matrixNextLevel.push(array[valueIndex]);
					valueIndex++;

				}
				
			} else {
				
				const nextlLevel = level + 1;
				iteration (nextlLevel, matrixNextLevel);

			}

		}
		
	}
	iteration (1, matrix);
	return matrix;

}

export default WebGPU;

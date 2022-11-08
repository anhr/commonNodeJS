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
	 * @param {object} [settings.input.params] The following input parameters types are available
	 * @param {object} [settings.input.params.f32] <b>f32</b> type of [floating point literal]{@link https://gpuweb.github.io/gpuweb/wgsl/#floating-point-literal} list.
	 * Every item of the list is <b>key: value</b> pair. <b>value</b> is any [Number]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number} value.
	 * <pre>
	 * Example:
	 * <b>params: {
	 *   f32: {
	 *     c: 0.04,
	 *     radius: 10
	 *   },
	 *},</b>
	 * </pre>
	 * @param {object} [settings.input.params.u32] <b>u32</b> type of [integer literal]{@link https://gpuweb.github.io/gpuweb/wgsl/#integer-literal} list.
	 * Every item of the list is <b>key: value</b> pair. <b>value</b> is any unsigned integer [Number]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number} value.
	 * <pre>
	 * Example:
	 * <b>params: {
	 *   u32: {
	 *     points: 40,
	 *     count: 1000
	 *   },
	 *}</b>
	 * </pre>
	 * @param {Array} [settings.input.phase] You can divide GPU compute to phases.
	 * <pre>
	 * Every phase calls the [GPUQueue.submit]{@link https://gpuweb.github.io/gpuweb/#dom-gpuqueue-submit} of <b>commandBuffers</b>. Use the <b>phase</b> array for it.
	 * Length of the <b>phase</b> array is count of the phases of GPU computing.
	 * Every item of the <b>phase</b> array is array of the <b>settings.results</b> indexes,
	 * you want to output after the current GPU computing phase.
	 * Use empty item array if you do not want to output any data after current GPU computing phase.
	 * Minimum 1 <b>phase</b> allowed. Default is one phase of GPU computing.
	 * See example of divide of the GPU computing to two phases. 
	 * <b>phase: [
	 *   [],//First phase. No data output.
	 *   [//Second phase.
	 *     0,//Output of the first item of the settings.results array.
	 *     1//Output of the second item of the settings.results array.
	 *   ]
	 * ]</b>
	 * You can see an example of divide in my code. Please open <a href="../../fermatSpiral/fermatSpiral.js" target="_blank">fermatSpiral.js</a> and <a href="../../fermatSpiral/WebGPU/create.c" target="_blank">create.c</a> files for it.
	 * </pre>
	 * @param {Array} [settings.results] Array of descriptions of the output data. See <b>settings.out</b> below.
	 * <pre>
	 * The following descriptions have every <b>settings.results</b> item.
	 *   type: Type of the output data. Available <b>Uint32Array</b> and <b>Float32Array</b> types. Optional. Default type is <b>Float32Array</b>.
	 *   count: Count of output data array items.
	 * Example of <b>settings.results</b> array item:
	 * <b>{
	 *   type: Uint32Array,
	 *   count: 1000
	 *}</b>
	 * </pre>
	 * @param {Function} [settings.out] <b>function(out, i)</b> called when output data is ready.
	 * <pre>
	 * <b>out</b> argument is array of output data. See [ArrayBuffer]{@link https://webidl.spec.whatwg.org/#idl-ArrayBuffer}.
	 * <b>i</b> argument is index of the <b>settings.results</b> array item.
	 * </pre>
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

		}

		function onWebGPUInitialized() {

			const input = settings.input;
			let bindGroupLayout, bindGroup;
			const phase = { param: 0, max: 0 }
			if (input) {

				if (input.matrices)
					input.matrices.forEach(inputMatrix => {

						//create matrix
						const matrix = [
							inputMatrix.length,//rows
							inputMatrix[0].length,//columns
						];
						inputMatrix.forEach(row => row.forEach(value => matrix.push(value)));
						inputMatrix.matrix = new Float32Array(matrix);

						inputMatrix.gpuBuffer = gpuDevice.createBuffer({
							mappedAtCreation: true,
							size: inputMatrix.matrix.byteLength,
							usage: GPUBufferUsage.STORAGE
						});
						new Float32Array(inputMatrix.gpuBuffer.getMappedRange()).set(inputMatrix.matrix);
						inputMatrix.gpuBuffer.unmap();

					});

				if (input.params) {

					function writeBuffer(item, type) {

						let paramBufferSize = 0;
						const data = [];
						Object.keys(item).forEach(key => {

							let param = item[key];
							if (typeof param === "number") {

								function isInt(n) { return n % 1 === 0; }
								const isInteger = isInt(param);
								if ((!isInteger && (type === Uint32Array))) {

									console.error('WebGPU: Invalid ' + key + ' = ' + param + ' parameter type. ' + (type === Uint32Array ? 'Integer' : 'Float') + ' is allowed only.');
									return;

								}
								paramBufferSize += type.BYTES_PER_ELEMENT;
								data.push(param);

							} else console.error('WebGPU: Invalid param: ' + param);

						});
						item.paramBuffer = gpuDevice.createBuffer({

							size: paramBufferSize,
							usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,

						});
						gpuDevice.queue.writeBuffer(

							item.paramBuffer,
							0,
							new type(data)
						);
						item.data = data;
						
					}
					Object.keys(input.params).forEach(key => {

						switch(key){

							case 'f32': writeBuffer(input.params[key], Float32Array); break;
							case 'u32': writeBuffer(input.params[key], Uint32Array); break;
							default: console.error('WebGPU: Invalid input.params "' + key + '" key.');
								
						}
						
					});

				}
				settings.results.forEach((result, i) => {

					if (!result.out) console.error('WebGPU: settings.results[' + i + '].out is undefined.');
					else if ((result.phase !== undefined) && (result.phase > phase.max)) phase.max = result.phase;

				});
				if ( phase.max > 0 ){
					
					phase.paramBuffer = gpuDevice.createBuffer({

						size: Uint32Array.BYTES_PER_ELEMENT,
						usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,

					});
					gpuDevice.queue.writeBuffer(
						phase.paramBuffer,
						0,
						new Uint32Array([phase.param])
					);
					
				}

			}

			// Result Matrix
			if (settings.results)
				settings.results.forEach(resultMatrix => {

					resultMatrix.type ||= Float32Array;
					const bufferSize = resultMatrix.type.BYTES_PER_ELEMENT * resultMatrix.count;
					if (!bufferSize) {

						console.error('WebGPU: "count" key is not defined in the settings.results item.');
						return;
						
					}
					resultMatrix.buffer = gpuDevice.createBuffer({
	
						size: bufferSize,
						usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
	
					});

				});

			// Bind group layout and bind group

			const entriesBindGroupLayout = [], entriesBindGroup = [];
			let binding = 0;
			if (input && input.matrices) for (var i = 0; i < input.matrices.length; i++) {

				entriesBindGroupLayout.push({

					binding: binding,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "read-only-storage" }

				});
				entriesBindGroup.push({

					binding: binding,
					resource: { buffer: input.matrices[i].gpuBuffer }

				});
				binding++;

			}
			if (settings.results) settings.results.forEach(resultMatrix => {
				
				entriesBindGroupLayout.push({
	
					binding: binding,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "storage" }
	
				});
				entriesBindGroup.push({
	
					binding: binding,
					resource: { buffer: resultMatrix.buffer }
	
				});
				binding++;

			});
			if (input.params) {
				
				Object.keys(input.params).forEach(key => {
	
					switch(key){
	
						case 'f32':
						case 'u32':
							entriesBindGroupLayout.push({
			
								binding: binding,
								visibility: GPUShaderStage.COMPUTE,
								buffer: { type: "uniform" }
			
							});
							entriesBindGroup.push({
								binding: binding,
								resource: { buffer: input.params[key].paramBuffer, }
							});
							binding++;
							break;
						default: console.error('WebGPU: Invalid input.params "' + key + '" key.');
							
					}
					
				});

			}

			if ( phase.max > 0 ) {
				
				entriesBindGroupLayout.push({
				
					binding: binding,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "uniform" }
				
				});
				entriesBindGroup.push({
					binding: binding,
					resource: { buffer: phase.paramBuffer, }
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

				function createCommandEncoder() {

					//https://gpuweb.github.io/gpuweb/#dom-gpudevice-createcommandencoder
					const commandEncoder = gpuDevice.createCommandEncoder();

					const passEncoder = commandEncoder.beginComputePass();
					passEncoder.setPipeline(computePipeline);
					passEncoder.setBindGroup(0, bindGroup);//set @group(0) in the shading code

					let workgroupCount = [];
					if (input && input.matrices)
						input.matrices.forEach((item, i) => workgroupCount.push(Math.ceil(item.matrix[i] / 8)));
					else {

						if (settings.workgroupCount) workgroupCount = settings.workgroupCount;
						else workgroupCount.push(1);

					}
					const workgroupCountX = workgroupCount[0], workgroupCountY = workgroupCount[1], workgroupCountZ = workgroupCount[3];

					//https://gpuweb.github.io/gpuweb/#dom-gpucomputepassencoder-dispatchworkgroups
					passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY, workgroupCountZ);
					passEncoder.end();

					if (settings.results)
						settings.results.forEach(resultMatrix => {

							// Get a GPU buffer for reading in an unmapped state.
							resultMatrix.gpuReadBuffer = gpuDevice.createBuffer({
								size: resultMatrix.buffer.size,
								usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
							});

							// Encode commands for copying buffer to buffer.
							commandEncoder.copyBufferToBuffer(
								resultMatrix.buffer, // source buffer
								0, // source offset
								resultMatrix.gpuReadBuffer, // destination buffer
								0, // destination offset
								resultMatrix.buffer.size // size
							);

						});
					return commandEncoder.finish();

				}

				// Submit GPU commands.
				gpuDevice.queue.submit([createCommandEncoder()]);

				// Read buffer.
				if (settings.results) {

					async function waitResult(i) {

						const result = settings.results[i];
						if( !result.out ) {
							
							console.error('WebGPU: settings.results[' + i + '].out is undefined.')
							return;

						}
						if ((result.phase || 0) !== phase.param) return;
						await result.gpuReadBuffer.mapAsync(GPUMapMode.READ);
						result.out(result.gpuReadBuffer.getMappedRange());

					}
					while ( true ){
						
						for (let i = 0; i < settings.results.length; i++) await waitResult(i);
						phase.param++;
						if (phase.param > phase.max) break;
						gpuDevice.queue.writeBuffer(
	
							phase.paramBuffer,
							0,
							new Uint32Array([phase.param])

						);
						gpuDevice.queue.submit([createCommandEncoder()]);
						
					}

				}

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
 * @param {ArrayBuffer} out out [ArrayBuffer]{@link https://webidl.spec.whatwg.org/#idl-ArrayBuffer}. See <b>settings.out</b> param of <b>WebGPU</b> class for details.
 * @param {object} [settings={}] The following settings are available
 * @param {object} [settings.type=Float32Array] type of the <b>out</b> ArrayBuffer. Allowed <b>Float32Array</b> and <b>Uint32Array</b>.
 * @param {Array} [settings.size] size of result matrix.
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
 * @param {Function} [settings.push] <b>function(item)</b>. <b>item</b> - new matrix item.
 * Called when a new matrix item is ready. You can add a new item to your matrix.
 * The result matrix is empty if you have added <b>push</b> to the <b>setting</b> and <b>settings.returnMatrix</b> is not true.
 * @param {boolean} [settings.returnMatrix] true - result matrix is not empty. Has effect only if <b>settings.push</b> is defined.
 * @returns result matrix.
 */
WebGPU.out2Matrix = function(out, settings={}) {
	
	const array = settings.type ? new settings.type(out) : new Float32Array(out),
		matrix = [];
	let valueIndex,
		dimension;//Dimension of resultMatrix
	const size = settings.size;
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
			if (level === (dimension - 1)) {

				const length = size ? size[dimension - 1] : array[dimension];
				for (let j = 0; j < length; j++) {
					
					if (valueIndex >= array.length){

						console.error('WebGPU.out2Matrix: out of the index range of the out array. ' + valueIndex);
						return;
						
					}
					matrixNextLevel.push(array[valueIndex]);
					valueIndex++;

				}
				if (settings.push) settings.push(matrixNextLevel);
				
			} else {
				
				const nextlLevel = level + 1;
				iteration (nextlLevel, matrixNextLevel);

			}
			if (!settings.push || settings.returnMatrix) matrixLevel.push(matrixNextLevel);

		}
		
	}
	iteration (1, matrix);
	return matrix;

}

export default WebGPU;

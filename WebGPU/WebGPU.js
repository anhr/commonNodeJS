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
	 * @param {Array} input Array of input matrix. See [Shader programming]{@link  https://web.dev/gpu-compute/#shader-programming}.
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
	 * @param {ArrayBuffer} out output buffer. See [ArrayBuffer]{@link https://webidl.spec.whatwg.org/#idl-ArrayBuffer}.
	 * @param {object} settings The following settings are available
	 * @param {Number} [settings.resultMatrixBufferSize] The size of the output buffer in bytes.
	 * @param {USVString} [settings.shaderCode] The [WGSL]{@link https://gpuweb.github.io/gpuweb/wgsl/} source code for the shader module. See [USVString]{@link https://webidl.spec.whatwg.org/#idl-USVString}.
	 * @param {String} [settings.shaderCodeFile] The name of the file with [WGSL]{@link https://gpuweb.github.io/gpuweb/wgsl/} source code. Have effect only if the code undefined.
	 */
	constructor(input = [], out, settings) {

		let gpuDevice = null;

		//https://gpuweb.github.io/gpuweb/#initialization-examples
		async function initializeWebGPU() {

			// Check to ensure the user agent supports WebGPU.
			if (!('gpu' in navigator)) {
				console.error("User agent doesn't support WebGPU. WebGPU is available for now in Chrome Canary https://www.google.com/intl/ru/chrome/canary/ on desktop behind an experimental flag. You can enable it at chrome://flags/#enable-unsafe-webgpu. The API is constantly changing and currently unsafe. As GPU sandboxing isn't implemented yet for the WebGPU API, it is possible to read GPU data for other processes! Don't browse the web with it enabled.");
				return false;
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

			// requestDevice will never return null, but if a valid device request can�t be
			// fulfilled for some reason it may resolve to a device which has already been lost.
			// Additionally, devices can be lost at any time after creation for a variety of reasons
			// (ie: browser resource management, driver updates), so it�s a good idea to always
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

			return true;

		}

		function onWebGPUInitialized() {

			input.forEach(inputMatrux => {

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

			// Result Matrix

/*				
			const resultMatrixBufferSize =
				Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix[0] * secondMatrix[1]);
*/
			const resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + settings.resultMatrixBufferSize);
			const resultMatrixBuffer = gpuDevice.createBuffer({

				size: resultMatrixBufferSize,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC

			});

			// Bind group layout and bind group
			
			const entriesBindGroupLayout = [], entriesBindGroup = [];
			for ( var i = 0; i < input.length; i++ ) {
				
				entriesBindGroupLayout.push( {
					
					binding: i,
					visibility: GPUShaderStage.COMPUTE,
					buffer: { type: "read-only-storage" }
					
				} );
				entriesBindGroup.push( {
					
					binding: i,
					resource: { buffer: input[i].gpuBuffer }
					
				} );

			}
			entriesBindGroupLayout.push( {
				
				binding: input.length,
				visibility: GPUShaderStage.COMPUTE,
				buffer: { type: "storage" }
				
			} );
			entriesBindGroup.push( {
				
				binding: input.length,
				resource: { buffer: resultMatrixBuffer }
				
			} );
			const bindGroupLayout = gpuDevice.createBindGroupLayout({ entries: entriesBindGroupLayout });
			
			const bindGroup = gpuDevice.createBindGroup({
				
				layout: bindGroupLayout,
				entries: entriesBindGroup
				
			});

			// Compute shader code

			const shaderCode = settings.shaderCode;
			if (shaderCode)
				onLoad(shaderCode)
			else {

//				loadScript.async(settings.shaderCodeFile);
				loadFile.sync(settings.shaderCodeFile, {
					async: true,
					onload: function (shaderCode, url ) { onLoad(shaderCode) }
				});

			}
			async function onLoad(shaderCode) {

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
				passEncoder.setBindGroup(0, bindGroup);

				const workgroupCount = [];
				input.forEach((item, i) => workgroupCount.push(Math.ceil(item.matrix[i] / 8)));
				const workgroupCountX = workgroupCount[0], workgroupCountY = workgroupCount[1], workgroupCountZ = workgroupCount[3];
				/*			
							const workgroupCountX = Math.ceil(firstMatrix[0] / 8);
							const workgroupCountY = Math.ceil(secondMatrix[1] / 8);
				*/
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
					resultMatrixBuffer /* source buffer */,
					0 /* source offset */,
					gpuReadBuffer /* destination buffer */,
					0 /* destination offset */,
					resultMatrixBufferSize /* size */
				);

				// Submit GPU commands.
				const gpuCommands = commandEncoder.finish();
				gpuDevice.queue.submit([gpuCommands]);

				// Read buffer.
				await gpuReadBuffer.mapAsync(GPUMapMode.READ);
				const arrayBuffer = gpuReadBuffer.getMappedRange();
				out(arrayBuffer);
				//			console.log(new Float32Array(arrayBuffer));

			}

		}

		initializeWebGPU();

		//https://web.dev/gpu-compute/
		async function f() {

			if (!("gpu" in navigator)) {
				console.log("WebGPU is not supported. WebGPU is available for now in Chrome Canary https://www.google.com/intl/ru/chrome/canary/ on desktop behind an experimental flag. You can enable it at chrome://flags/#enable-unsafe-webgpu. The API is constantly changing and currently unsafe. As GPU sandboxing isn't implemented yet for the WebGPU API, it is possible to read GPU data for other processes! Don't browse the web with it enabled.");
				return;
			}

			const adapter = await navigator.gpu.requestAdapter();
			if (!adapter) {
				console.log("Failed to get GPU adapter.");
				return;
			}
			const device = await adapter.requestDevice();

			// First Matrix

			const firstMatrix = new Float32Array([
				2 /* rows */,
				4 /* columns */,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8
			]);

			const gpuBufferFirstMatrix = device.createBuffer({
				mappedAtCreation: true,
				size: firstMatrix.byteLength,
				usage: GPUBufferUsage.STORAGE
			});
			const arrayBufferFirstMatrix = gpuBufferFirstMatrix.getMappedRange();
			new Float32Array(arrayBufferFirstMatrix).set(firstMatrix);
			gpuBufferFirstMatrix.unmap();

			// Second Matrix

			const secondMatrix = new Float32Array([
				4 /* rows */,
				2 /* columns */,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8
			]);

			const gpuBufferSecondMatrix = device.createBuffer({
				mappedAtCreation: true,
				size: secondMatrix.byteLength,
				usage: GPUBufferUsage.STORAGE
			});
			const arrayBufferSecondMatrix = gpuBufferSecondMatrix.getMappedRange();
			new Float32Array(arrayBufferSecondMatrix).set(secondMatrix);
			gpuBufferSecondMatrix.unmap();

			// Result Matrix

			const resultMatrixBufferSize =
				Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix[0] * secondMatrix[1]);
			const resultMatrixBuffer = device.createBuffer({
				size: resultMatrixBufferSize,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
			});

			// Bind group layout and bind group

			const bindGroupLayout = device.createBindGroupLayout({
				entries: [

					//input
					{
						binding: 0,
						visibility: GPUShaderStage.COMPUTE,
						buffer: {
							type: "read-only-storage"
						}
					},
					{
						binding: 1,
						visibility: GPUShaderStage.COMPUTE,
						buffer: {
							type: "read-only-storage"
						}
					},

					//output
					{
						binding: 2,
						visibility: GPUShaderStage.COMPUTE,
						buffer: {
							type: "storage"
						}
					}
				]
			});

			const bindGroup = device.createBindGroup({
				layout: bindGroupLayout,
				entries: [
					{
						binding: 0,
						resource: {
							buffer: gpuBufferFirstMatrix
						}
					},
					{
						binding: 1,
						resource: {
							buffer: gpuBufferSecondMatrix
						}
					},
					{
						binding: 2,
						resource: {
							buffer: resultMatrixBuffer
						}
					}
				]
			});

			// Compute shader code

			const shaderModule = device.createShaderModule({
				code: `
	  struct Matrix {
		size : vec2<f32>,
		numbers: array<f32>,
	  }

	  @group(0) @binding(0) var<storage, read> firstMatrix : Matrix;
	  @group(0) @binding(1) var<storage, read> secondMatrix : Matrix;
	  @group(0) @binding(2) var<storage, read_write> resultMatrix : Matrix;

	  @compute @workgroup_size(8, 8)
	  fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
		// Guard against out-of-bounds work group sizes
		if (global_id.x >= u32(firstMatrix.size.x) || global_id.y >= u32(secondMatrix.size.y)) {
		  return;
		}

		resultMatrix.size = vec2(firstMatrix.size.x, secondMatrix.size.y);

		let resultCell = vec2(global_id.x, global_id.y);
		var result = 0.0;
		for (var i = 0u; i < u32(firstMatrix.size.y); i = i + 1u) {
		  let a = i + resultCell.x * u32(firstMatrix.size.y);
		  let b = resultCell.y + i * u32(secondMatrix.size.y);
		  result = result + firstMatrix.numbers[a] * secondMatrix.numbers[b];
		}

		let index = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
		resultMatrix.numbers[index] = result;
	  }
	`
			});

			// Pipeline setup

			const computePipeline = device.createComputePipeline({
				layout: device.createPipelineLayout({
					bindGroupLayouts: [bindGroupLayout]
				}),
				compute: {
					module: shaderModule,
					entryPoint: "main"
				}
			});

			// Commands submission

			const commandEncoder = device.createCommandEncoder();

			const passEncoder = commandEncoder.beginComputePass();
			passEncoder.setPipeline(computePipeline);
			passEncoder.setBindGroup(0, bindGroup);
			const workgroupCountX = Math.ceil(firstMatrix[0] / 8);
			const workgroupCountY = Math.ceil(secondMatrix[1] / 8);
			passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
			passEncoder.end();

			// Get a GPU buffer for reading in an unmapped state.
			const gpuReadBuffer = device.createBuffer({
				size: resultMatrixBufferSize,
				usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
			});

			// Encode commands for copying buffer to buffer.
			commandEncoder.copyBufferToBuffer(
				resultMatrixBuffer /* source buffer */,
				0 /* source offset */,
				gpuReadBuffer /* destination buffer */,
				0 /* destination offset */,
				resultMatrixBufferSize /* size */
			);

			// Submit GPU commands.
			const gpuCommands = commandEncoder.finish();
			device.queue.submit([gpuCommands]);

			// Read buffer.
			await gpuReadBuffer.mapAsync(GPUMapMode.READ);
			const arrayBuffer = gpuReadBuffer.getMappedRange();
			console.log(new Float32Array(arrayBuffer));
			return 1;

		}
		f();

	}

}

export default WebGPU;

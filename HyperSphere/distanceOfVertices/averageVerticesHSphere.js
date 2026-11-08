/**
 * @module averageVerticesHSphere
 * @description Thomson problem on the hypersphere with noise regularization.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 * @license under the Apache License, Version 2.0
 */
import averageVerticesBase from './averageVertices.js'
import * as utils from '../utilsHSphere.js'
import RandomVertice from '../RandomVertice/randomVerticeHSphere.js';

/**
 * Sample a uniformly random point inside a 4D ball of radius sigma.
 * Isotropic, bounded, independent per call. Does NOT mutate the input.
 * @param {{x:number,y:number,z:number,w:number}} p
 * @param {number} sigma
 * @returns {{x:number,y:number,z:number,w:number}}
 */
function addNoise4D(p, sigma) {
	if (!(sigma > 0)) return { x: p.x, y: p.y, z: p.z, w: p.w };

	// Uniform in 4D ball: direction uniform on S^3, radius r = sigma * U^(1/4), U ~ U(0,1)
	// Direction on S^3 via normalized 4D Gaussian (Box-Muller is not needed; use rejection on S^3? No—use Gaussian).
	// Simple and robust: 4 independent standard normals, normalize.
	const g = () => {
		// Marsaglia polar method for standard normal (no Math.log(0) issues)
		let u, v, s;
		do {
			u = 2 * Math.random() - 1;
			v = 2 * Math.random() - 1;
			s = u * u + v * v;
		} while (s >= 1 || s === 0);
		const mul = Math.sqrt(-2 * Math.log(s) / s);
		return u * mul; // one normal; caller pairs with v*mul for another if needed
	};
	const nx = g(), ny = g(), nz = g(), nw = g();
	const len = Math.hypot(nx, ny, nz, nw);
	if (len === 0) return { x: p.x, y: p.y, z: p.z, w: p.w }; // extremely unlikely
	const dir = { x: nx / len, y: ny / len, z: nz / len, w: nw / len };

	// radius with density ∝ r^{d-1}, d=4 => r = sigma * U^{1/4}
	const U = Math.random();
	const r = sigma * Math.pow(U, 1 / 4);

	return {
		x: p.x + dir.x * r,
		y: p.y + dir.y * r,
		z: p.z + dir.z * r,
		w: p.w + dir.w * r,
	};
}

/**
 * Child function to override some base functions for hypersphere.
 * @param {Object} data See <b>data</b> parameter of the base averageVertices.
 */
const averageVertices = (data) => {
	averageVerticesBase(data, {
		getPoint(index, array) {
			const offset = index * this.itemSize;
			return {
				get x() { return array[offset + 0]; },
				set x(value) { array[offset + 0] = value; },

				get y() { return array[offset + 1]; },
				set y(value) { array[offset + 1] = value; },

				get z() { return array[offset + 2]; },
				set z(value) { array[offset + 2] = value; },

				get w() { return array[offset + 3]; },
				set w(value) { array[offset + 3] = value; },
			};
		},
		get itemSize() { return 4; },
		velocitiesInitValues: () => ({ x: 0, y: 0, z: 0, w: 0 }),
		anglesInitValues: [0, 0, 0],
		utils: utils,
		RandomVertice: RandomVertice,

		// NEW: noise regularization hook used by the base
		addNoise: (p, sigma) => addNoise4D(p, sigma),

		setForse: (forces, d, m, iStride) => {
			forces[iStride] += d.x * m;
			forces[iStride + 1] += d.y * m;
			forces[iStride + 2] += d.z * m;
			forces[iStride + 3] += d.w * m;
		},
		d: (p1, p2) => ({ x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w }),
		d2: (d) => d.x * d.x + d.y * d.y + d.z * d.z + d.w * d.w,
		dist: (pt) => Math.hypot(pt.x, pt.y, pt.z, pt.w),
		angles: (angles) => [angles[0], angles[1], angles[2]],
		forceVertice: (pSrc, pDest, force, eta, velocity, BETA = 0.85, verify) => {
			velocity.x = BETA * velocity.x + eta * force.x;
			velocity.y = BETA * velocity.y + eta * force.y;
			velocity.z = BETA * velocity.z + eta * force.z;
			velocity.w = BETA * velocity.w + eta * force.w;

			const updated = {
				x: pSrc.x + velocity.x,
				y: pSrc.y + velocity.y,
				z: pSrc.z + velocity.z,
				w: pSrc.w + velocity.w,
			};
			const nextR = data.this.classSettings.overriddenProperties.rTime();
			const mag = Math.hypot(updated.x, updated.y, updated.z, updated.w);
			pDest.x = (updated.x / mag) * nextR;
			pDest.y = (updated.y / mag) * nextR;
			pDest.z = (updated.z / mag) * nextR;
			pDest.w = (updated.w / mag) * nextR;
			verify(pDest, nextR);
		},
	});
}
averageVertices.verticeProxy = averageVerticesBase.verticeProxy;
averageVertices.webGPU = { compute: (compute) => { compute() } }; // no-op stub
export default averageVertices;
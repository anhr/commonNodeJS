/**
 * @module averageVerticesSphere
 * @description An iterative process known as [Thomson problem]{@link https://en.wikipedia.org/wiki/Thomson_problem} in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other on the sphere.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @author [deepseek private]{@link https://chat.deepseek.com/a/chat/s/2489a216-f67e-44e1-8d79-3457009fff5c}
 * @author [deepseek public]{@link https://chat.deepseek.com/share/kmxly0rk7261jjab9u}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/
import averageVerticesBase from './averageVertices.js'
import * as utils from '../utilsSphere.js'
import { RandomVerticeSphere as RandomVertice } from '../RandomVertice/randomVerticeSphere.js';

/**
 * Sample from a truncated von Mises-Fisher (vMF) distribution on S^2,
 * centered at p, with angular radius thetaMax and concentration kappa > 0.
 *
 * Density: f(theta) ∝ sin(theta) * exp(kappa * cos(theta)), theta in [0, thetaMax].
 * - kappa -> 0:   reduces to "uniform by area in the geodesic cap" (density ∝ sin theta).
 * - kappa large:  sharply peaked at theta = 0 (density maximal at the center p).
 *
 * Sampling: rejection sampling with the uniform-by-area cap as proposal:
 *   - draw theta from C1 (proposal, density ∝ sin theta on [0, thetaMax]);
 *   - accept with probability exp(kappa * (cos(theta) - 1)) (max = 1 at theta = 0);
 *   - repeat until accept.
 * Acceptance rate is high for kappa * thetaMax^2 <= ~10; still fine for larger kappa
 * (the proposal is already concentrated near the center).
 *
 * Note: because the cap is bounded (theta <= thetaMax), the distribution has
 * NO heavy tail, so E[|F|^2] is finite. This is the "flat cloud on the sphere"
 * that you described: strictly on S^2, symmetric around p, peaked at p.
 *
 * @param {{x:number,y:number,z:number}} p  unit vector (|p| = 1)
 * @param {number} sigmaGeo  angular radius thetaMax in radians, in (0, pi]
 * @param {number} kappa     concentration, kappa > 0 (larger => narrower cloud)
 * @returns {{x:number,y:number,z:number}}  unit vector on S^2
 */
function addNoise3D_geo_vmf(p, sigmaGeo, kappa) {
	if (!(sigmaGeo > 0) || !(kappa > 0)) {
		return { x: p.x, y: p.y, z: p.z };
	}
	const thetaMax = Math.min(sigmaGeo, Math.PI);
	const cosThetaMax = Math.cos(thetaMax);

	// Tangent basis at p (same as C1)
	const n = { x: p.x, y: p.y, z: p.z };
	const a = (Math.abs(n.x) < 0.9) ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
	const dot = a.x * n.x + a.y * n.y + a.z * n.z;
	let t1 = { x: a.x - dot * n.x, y: a.y - dot * n.y, z: a.z - dot * n.z };
	const t1len = Math.hypot(t1.x, t1.y, t1.z);
	t1 = { x: t1.x / t1len, y: t1.y / t1len, z: t1.z / t1len };
	const t2 = {
		x: n.y * t1.z - n.z * t1.y,
		y: n.z * t1.x - n.x * t1.z,
		z: n.x * t1.y - n.y * t1.x,
	};

	// Rejection loop
	let cosTheta = 1;
	for (let iter = 0; iter < 1000; iter++) {
		// proposal: uniform by area in cap
		const U = Math.random();
		cosTheta = 1 - U * (1 - cosThetaMax);
		// accept with probability exp(kappa * (cosTheta - 1)) in [0, 1]
		const accept = Math.exp(kappa * (cosTheta - 1));
		if (Math.random() < accept) break;
	}
	const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
	const phi = 2 * Math.PI * Math.random();

	const ct = Math.cos(theta), st = Math.sin(theta);
	const cp = Math.cos(phi), sp = Math.sin(phi);
	return {
		x: n.x * ct + (t1.x * cp + t2.x * sp) * st,
		y: n.y * ct + (t1.y * cp + t2.y * sp) * st,
		z: n.z * ct + (t1.z * cp + t2.z * sp) * st,
	};
}

/**
 * Child function to override some base functions for sphere. See <b>overrides</b> parameter of the base <a href="./module-averageVertices.html" target="_blank">averageVertices</a> function.
 * @param {Object} data See <b>data</b> parameter of the base <a href="./module-averageVertices.html" target="_blank">averageVertices</a>
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
			};
		},
		get itemSize() { return 3; },
		a: 0.5,
		velocitiesInitValues: () => { return {x: 0, y: 0, z: 0 }; },
		setVelocities: (velociti, DAMPING, force) => {
			velociti.x = velociti.x * DAMPING + force.x;
			velociti.y = velociti.y * DAMPING + force.y;
			velociti.z = velociti.z * DAMPING + force.z;
		},
		anglesInitValues: [0, 0],
		utils: utils,
		RandomVertice: RandomVertice,
		p: 0.99,//Hyperbola parametr. See RandomVertice.calculateHyperbola
		force: () => { return {x: 0, y: 0, z: 0 }; },
		/**
		 * Sample a uniformly random point inside a 3D ball of radius sigma.
		 * Isotropic, bounded, independent per call. Does NOT mutate the input.
		 * @param {{x:number,y:number,z:number}} p
		 * @param {number} sigma
		 * @returns {{x:number,y:number,z:number}}
		 */
		addNoise: (p, sigma) => {
			const R = Math.hypot(p.x, p.y, p.z);
			const pn = { x: p.x / R, y: p.y / R, z: p.z / R };
			const q = addNoise3D_geo_vmf(pn, sigma, 4 / (sigma * sigma));
			return { x: q.x * R, y: q.y * R, z: q.z * R };
		},
//		setForse: (force, d, dist, m) => { force.x += (d.x / dist) * m; force.y += (d.y / dist) * m; force.z += (d.z / dist) * m; },
		setForse: (forces, d, m, iStride) => {
			forces[iStride] += d.x * m;
			forces[iStride + 1] += d.y * m;
			forces[iStride + 2] += d.z * m;
		},
		d: (p1, p2) => { return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z} },
		d2: (d) => { return d.x * d.x + d.y * d.y + d.z * d.z },
		dist: (pt) => Math.hypot(pt.x, pt.y, pt.z),
		angles: (angles) => { return [angles[0], angles[1]]; },
		vertice: (p, velociti) => { return { x: p.x + velociti.x, y: p.y + velociti.y, z: p.z + velociti.z } },
		forceVertice: (pSrc, pDest, force, eta, velocity, BETA = 0.85, verify) => {
			velocity.x = BETA * velocity.x + eta * force.x;
			velocity.y = BETA * velocity.y + eta * force.y;
			velocity.z = BETA * velocity.z + eta * force.z;

			const updated = {
				x: pSrc.x + velocity.x,
				y: pSrc.y + velocity.y,
				z: pSrc.z + velocity.z,
			};
			const nextR = data.this.classSettings.overriddenProperties.rTime();
			const mag = Math.hypot(updated.x, updated.y, updated.z);
			pDest.x = (updated.x / mag) * nextR;
			pDest.y = (updated.y / mag) * nextR;
			pDest.z = (updated.z / mag) * nextR;
			verify(pDest, nextR);
		},
	});
}
averageVertices.verticeProxy = averageVerticesBase.verticeProxy;
averageVertices.addNoise = (p, sigma) => { return addNoise3D_geo_vmf(p, sigma); };
export default averageVertices;
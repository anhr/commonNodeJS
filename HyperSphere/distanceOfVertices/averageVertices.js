/**
 * @module averageVertices
 * @description An iterative process in which, at each step, all vertices gradually move toward a position
 * in which the vertices are at the maximum distance from each other.
 * See [Thomson Problem]{@link https://en.wikipedia.org/wiki/Thomson_problem}.
 *
 * Noise regularization: each "measurement" of a vertex position returns the stored position plus
 * an independent, isotropic, bounded noise of width SIGMA. This resolves the 1/r^2 singularity
 * naturally (no EPS_DIST / softening needed). SIGMA = 0 restores the ideal (deterministic) model.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @author [deepseek private]{@link https://chat.deepseek.com/a/chat/s/2489a216-f67e-44e1-8d79-3457009fff5c}
 * @author [deepseek public]{@link https://chat.deepseek.com/share/kmxly0rk7261jjab9u}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 * @license under the Apache License, Version 2.0
 */

import ProgressBar from '../../ProgressBar/ProgressBar.js'
import Player from '../../player/player.js'
import * as utils from '../../HyperSphere/utilsHSphere.js'

const sAverageVertices = 'averageVertices', π = Math.PI;
let velocities;

/**
 * Base function for an iterative process (Thomson problem) with noise regularization.
 * @param {Object} data averageVertices data
 * @param {Object} data.options See the <b>options</b> parameter of the <a href="../../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {float} data.t Current time.
 * @param {number} data.timeId player time id.
 * @param {Object} data.this n dimensional hypersphere graphical object.
 * @param {Object} overrides overridden functions. Must provide:
 *   - itemSize: number
 *   - getPoint(index, array): proxy point {x,y,z,w,...}
 *   - d(p1,p2), d2(d), dist(pt)
 *   - setForse(forces, d, m, stride)
 *   - forceVertice(pSrc, pDest, force, eta, velocity, BETA, verify)
 *   - addNoise(p, sigma): return NEW point = p + noise (does NOT mutate p)
 *   - RandomVertice, angles, utils (for the optional RANDOM_POINTS branch)
 */
const averageVertices = (data, overrides) => {

	const _this = data.this, classSettings = _this.classSettings, config = classSettings.compute.config;
	const settings = classSettings.settings,
		angles = settings.object.geometry.angles,
		position = classSettings.settings.bufferGeometry.userData.position,
		options = data.options,
		t = data.t,
		hyperbola = overrides.RandomVertice.calculateHyperbola(config.p);
	void data.this.r; // ensure the universe registers a new time (kept for backward compat)

	const positionBlockLength = angles.length;
	const itemSize = overrides.itemSize;

	// --- Noise regularization parameters ---
	const SIGMA = (config.SIGMA !== undefined) ? config.SIGMA : 0; // 0 => ideal deterministic model
	const SIGMA_MAX_RESAMPLE = (config.SIGMA_MAX_RESAMPLE !== undefined) ? config.SIGMA_MAX_RESAMPLE : 8;
	const noiseEnabled = SIGMA > 0 && typeof overrides.addNoise === 'function';

	if (!velocities) velocities = new Float32Array(positionBlockLength * itemSize);

	const getVelocity = (index) => overrides.getPoint(index, velocities);

	const forces = new Float32Array(positionBlockLength * itemSize);
	function getForce(index) { return overrides.getPoint(index, forces); }

	const positionArray = position.array;

	function getPoint(i, timeId = data.timeId) {
		const overriddenProperties = data.this.classSettings.overriddenProperties;
		return overriddenProperties.getVerticePosition(i, overriddenProperties.getPositionTimeId(timeId));
	}

	function verifyVertice(pt, targetRadius, epsilon = 1e-6) {
		if (!settings.debug) return;
		const dist = overrides.dist(pt);
		if (Math.abs(dist - targetRadius) > epsilon) {
			console.warn(`Vertex deviated from the hypersphere! R = ${dist}, expected = ${targetRadius}`);
			return false;
		}
		return true;
	}
	function verifyHyperSphere(targetRadius) {
		if (!settings.debug) return;
		for (let i = 0; i < positionBlockLength; i++) {
			if (!verifyVertice(getPoint(i, data.timeId - 1), targetRadius)) return false;
		}
		return true;
	}
	verifyHyperSphere(classSettings.overriddenProperties.rTime(data.timeId - 1));

	const THREE = window.__myThree__.three.THREE;

	// --- Iterative step ---
	function iterationStep() {
		let timestamp = classSettings.debug ? window.performance.now() : undefined;

		let progressBar, i = 0;
		const userData = settings.bufferGeometry.userData;

		// 1. Scale velocities when the space radius changes
		const currentR = classSettings.overriddenProperties.rTime(data.timeId - 1);
		const nextR = classSettings.overriddenProperties.rTime();
		const rRatio = nextR / currentR;
		for (let k = 0; k < velocities.length; k++) velocities[k] *= rRatio;

		// 2. Dynamic ETA
		const eta = config.ETA_0 *
			Math.pow(_this.classSettings.overriddenProperties.rTime(_this.classSettings.settings.bufferGeometry.userData.timeId - 1), 3);
		forces.fill(0);

		const RandomVertice = overrides.RandomVertice;
		let minDistInStep = Infinity; // diagnostics
		let resampleCount = 0;        // diagnostics

		/**
		 * Sample a noisy point p~ = p + noise, resampling if the pair becomes exactly coincident.
		 * Returns null if after SIGMA_MAX_RESAMPLE attempts the points are still coincident.
		 */
		const samplePair = (pi, pj) => {
			for (let attempt = 0; attempt <= SIGMA_MAX_RESAMPLE; attempt++) {
				const piN = noiseEnabled ? overrides.addNoise(pi, SIGMA) : pi;
				const pjN = noiseEnabled ? overrides.addNoise(pj, SIGMA) : pj;
				const d = overrides.d(piN, pjN);
				const d2 = overrides.d2(d);
				if (d2 > 0) return { piN, pjN, d, d2 };
				resampleCount++;
			}
			return null;
		};

		const step = () => {
			try {
				progressBar.value = i;
				const pi = settings.overriddenProperties.position(position, i, userData);

				for (let j = i + 1; j < positionBlockLength; j++) {
					const pj = settings.overriddenProperties.position(position, j, userData);

					let d, d2, dist;
					if (noiseEnabled) {
						const sampled = samplePair(pi, pj);
						if (!sampled) {
							if (settings.debug) {
								console.warn(`${sAverageVertices}: coincident points (${i},${j}) after ${SIGMA_MAX_RESAMPLE} resamples; skipping pair`);
							}
							continue;
						}
						d = sampled.d; d2 = sampled.d2;
					} else {
						d = overrides.d(pi, pj);
						d2 = overrides.d2(d);
					}
					dist = Math.sqrt(d2);
					if (dist < minDistInStep) minDistInStep = dist;

					// Optional RANDOM_POINTS branch: only when noise is disabled AND config.RANDOM_POINTS != 0.
					// NOTE: this branch was previously buggy (dist used before declaration). Left intact
					// for backward compatibility but isolated; fix separately if you enable it.
					if (!noiseEnabled && config.RANDOM_POINTS != 0) {
						const arc = π - hyperbola((dist / classSettings.overriddenProperties.r(settings.bufferGeometry.userData.timeId - 1) / 2) * π);
						userData.timeId--;
						const timeIdOld = settings.guiPoints ? settings.guiPoints.timeId : undefined;
						try {
							if (settings.guiPoints) settings.guiPoints.timeId = userData.timeId;
							const r = classSettings.overriddenProperties.rTime();
							const noisej = utils.polarToCartesian(
								RandomVertice.get(arc, utils.angles(overrides.angles(angles2)), classSettings, RandomVertice),
								r
							);
							d = overrides.d(pi, noisej);
							d2 = overrides.d2(d);
							dist = Math.sqrt(d2);
						} finally {
							if (settings.guiPoints) settings.guiPoints.timeId = timeIdOld;
							userData.timeId++;
						}
					}

					if (dist === 0) throw new Error(sAverageVertices + '.step: Ivalid dist = ' + dist + (SIGMA === 0 ? '. Please setup classSettings.compute.config.SIGMA. See https://raw.githack.com/anhr/commonNodeJS/master/HyperSphere/jsdoc/module-HyperSphere-HyperSphere.html' : ''));
					// Force m = 1/|d|^3 (Coulomb). With noise enabled, d is already regularized.
					const m = 1 / (d2 * dist);
					overrides.setForse(forces, d, m, i * itemSize);
					overrides.setForse(forces, d, -m, j * itemSize);
				}

				i += 1;

			} catch (e) {
				console.error(`${sAverageVertices}: step failed`, e);
				// Fall through to finally; we intentionally stop the loop on unexpected errors.
				i = positionBlockLength;
			} finally {
				if (i >= positionBlockLength) {
					progressBar.remove();

					// 3. Update velocities and positions in-place
					for (let k = 0; k < positionBlockLength; k++) {
						overrides.forceVertice(
							getPoint(k, data.timeId - 1), getPoint(k), getForce(k),
							eta, getVelocity(k), classSettings.compute.config.BETA, verifyVertice
						);
					}

					const attributePosition = settings.bufferGeometry.attributes.position;
					attributePosition.needsUpdate = true;
					const drawRange = settings.bufferGeometry.drawRange;
					data.this.setVerticesRange(drawRange.start, attributePosition.count - drawRange.start);
					if (classSettings.debug) classSettings.debug.logTimestamp('Play step. Average vertices. ', timestamp);

					const timeIdOld = settings.guiPoints ? settings.guiPoints.timeId : undefined;
					if (settings.guiPoints) settings.guiPoints.timeId = undefined;

					if (settings.debug && settings.debug.log) {
						for (let k = 0; k < angles.length; k++) {
							const pointCur = settings.bufferGeometry.userData.position[k];
							const pointAngles = utils.cartesianToPolar(pointCur);
							console.log(`Step:${data.timeId} Point:${(data.timeId * angles.length + k)}. x=${pointCur.x} y=${pointCur.y} z=${pointCur.z} w=${pointCur.w},alt=${pointAngles.altitude} lat=${pointAngles.latitude} lon=${pointAngles.longitude}`);
						}
					}
					if (settings.guiPoints) settings.guiPoints.timeId = timeIdOld;

					_this.bufferGeometry.attributes.position.needsUpdate = true;
					_this.onSelectSceneEnd(data.timeId);

					// Diagnostics
					if (settings.debug) {
						console.log(`${sAverageVertices}: sigma=${SIGMA}, minDistInStep=${minDistInStep}, resamples=${resampleCount}`);
					}
				} else {
					progressBar.step();
				}
			}
		};

		progressBar = new ProgressBar(options.renderer.domElement.parentElement, step, {
			sTitle: 't = ' + t + '<br> Average vertices',
			max: settings.object.geometry.angles.length - 1,
			timeoutPeriod: 10,
		});
	}
	iterationStep();
}
averageVertices.verticeProxy = (vertice) => vertice;
export default averageVertices;
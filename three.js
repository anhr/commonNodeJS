import * as THREE from '../../three.js/dev/build/three.module.js';
/*
import { WEBGL } from '../../three.js/dev/examples/jsm/WebGL.js';
import { OrbitControls } from '../../three.js/dev/examples/jsm/controls/OrbitControls.js';
import { ConvexBufferGeometry } from '../../three.js/dev/examples/jsm/geometries/ConvexGeometry.js';
import StereoEffect from './StereoEffect/StereoEffect.js';
import { SpriteTextGui, SpriteText } from '../../SpriteText/master/SpriteText.js';
import { AxesHelper, AxesHelperOptions } from '../../AxesHelper/master/AxesHelper.js';
*/
/*'Depreacated. Use Player.setTHREE'
Object.assign( THREE.BufferGeometry.prototype, {

	setFromPoints: function ( points, itemSize ) {

		console.warn( 'Depreacated. Use Player.setTHREE' )
		itemSize = itemSize || 3;
		var position = [];

		for ( var i = 0, l = points.length; i < l; i++ ) {

			var point = points[i];
			position.push( point.x, point.y, point.z || 0 );
			if ( itemSize >= 4 )
				position.push( point.w || 0 );

		}

		this.setAttribute( 'position', new THREE.Float32BufferAttribute( position, itemSize ) );

		return this;

	},

} );

//three.js\dev\src\math\Vector4.js
Object.assign( THREE.Vector4.prototype, {

	multiply: function ( v ) {

		console.warn( 'Depreacated. Use Player.setTHREE' )
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
//		this.w *= v.w || 1;
		if ( v.w !== undefined )
			this.w *= v.w;

		return this;

	},

} );
//three.js\dev\src\math\Vector4.js
Object.assign( THREE.Vector4.prototype, {

	add: function ( v, w ) {

		console.warn( 'Depreacated. Use Player.setTHREE' )
		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		if ( v.w !== undefined )
			this.w += v.w;

		return this;

	},

} );
//three.js\dev\src\objects\Points.js
Object.assign( THREE.Points.prototype, {

	raycast: function ( raycaster, intersects ) {

		console.warn( 'Depreacated. Use Player.setTHREE' )
		const _inverseMatrix = new THREE.Matrix4();
		const _ray = new THREE.Ray();
		const _sphere = new THREE.Sphere();
		const _position = new THREE.Vector3();
		function testPoint( point, index, localThresholdSq, matrixWorld, raycaster, intersects, object ) {

			const rayPointDistanceSq = _ray.distanceSqToPoint( point );

			if ( rayPointDistanceSq < localThresholdSq ) {

				const intersectPoint = new THREE.Vector3();

				_ray.closestPointToPoint( point, intersectPoint );
				intersectPoint.applyMatrix4( matrixWorld );

				const distance = raycaster.ray.origin.distanceTo( intersectPoint );

				if ( distance < raycaster.near || distance > raycaster.far ) return;

				intersects.push( {

					distance: distance,
					distanceToRay: Math.sqrt( rayPointDistanceSq ),
					point: intersectPoint,
					index: index,
					face: null,
					object: object

				} );

			}

		}

		const geometry = this.geometry;
		const matrixWorld = this.matrixWorld;
		const threshold = raycaster.params.Points.threshold;

		// Checking boundingSphere distance to ray

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		_sphere.copy( geometry.boundingSphere );
		_sphere.applyMatrix4( matrixWorld );
		_sphere.radius += threshold;

		if ( raycaster.ray.intersectsSphere( _sphere ) === false ) return;

		//

		_inverseMatrix.getInverse( matrixWorld );
		_ray.copy( raycaster.ray ).applyMatrix4( _inverseMatrix );

		const localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
		const localThresholdSq = localThreshold * localThreshold;

		if ( geometry.isBufferGeometry ) {

			const index = geometry.index;
			const attributes = geometry.attributes;
			const positions = attributes.position.array;
			const itemSize = attributes.position.itemSize;

			if ( index !== null ) {

				const indices = index.array;

				for ( let i = 0, il = indices.length; i < il; i++ ) {

					const a = indices[i];

					_position.fromArray( positions, a * itemSize );

					testPoint( _position, a, localThresholdSq, matrixWorld, raycaster, intersects, this );

				}

			} else {

				for ( let i = 0, l = positions.length / itemSize; i < l; i++ ) {

					_position.fromArray( positions, i * itemSize );

					testPoint( _position, i, localThresholdSq, matrixWorld, raycaster, intersects, this );

				}

			}

		} else {

			const vertices = geometry.vertices;

			for ( let i = 0, l = vertices.length; i < l; i++ ) {

				testPoint( vertices[i], i, localThresholdSq, matrixWorld, raycaster, intersects, this );

			}

		}

	},

} );
*/
export {

	THREE,
/*
	WEBGL,
	OrbitControls,
	ConvexBufferGeometry,
	StereoEffect
	SpriteText, SpriteTextGui,
	AxesHelper, AxesHelperOptions,
*/

}

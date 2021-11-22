import { BufferGeometry } from '../../../three.js/dev/src/core/BufferGeometry.js';
import { Float32BufferAttribute } from '../../../three.js/dev/src/core/BufferAttribute.js';
import { Vector3 } from '../../../three.js/dev/src/math/Vector3.js';

import MyPoints from '../myPoints/myPoints.js';

class FibonacciSphereGeometry extends BufferGeometry {

	constructor( radius = 1, widthSegments = 32, heightSegments = 16, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI ) {

		super();
		this.type = 'FibonacciSphereGeometry';

		this.parameters = {
			radius: radius,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		widthSegments = Math.max( 3, Math.floor( widthSegments ) );
		heightSegments = Math.max( 2, Math.floor( heightSegments ) );

		const thetaEnd = Math.min( thetaStart + thetaLength, Math.PI );

		let index = 0;
		const grid = [];

		const vertex = new Vector3();
		const normal = new Vector3();

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// generate vertices, normals and uvs

		function getFibonacciSpherePoints(samples, radius, randomize) {
			// Translated from Python from https://stackoverflow.com/a/26127012
			samples = samples || 1;
			radius = radius || 1;
			randomize = randomize || true;
			var random = 1;
			if (randomize === true) {
				random = Math.random() * samples;
			}

			var points = []
			var offset = 2 / samples
			var increment = Math.PI * (3 - Math.sqrt(5));

			for (var i = 0; i < samples; i++) {
				var y = ((i * offset) - 1) + (offset / 2);
				var distance = Math.sqrt(1 - Math.pow(y, 2));
				var phi = ((i + random) % samples) * increment;
				var x = Math.cos(phi) * distance;
				var z = Math.sin(phi) * distance;
				x = x * radius;
				y = y * radius;
				z = z * radius;
				var point = {
					'x': x,
					'y': y,
					'z': z
				}
				points.push(point);
			}
			return points;
		}
		const numberOfPoints = 5;//1500;
		const radiusOfSphere = 1;
		const fibonacciSpherePoints = getFibonacciSpherePoints(numberOfPoints, radiusOfSphere);

		MyPoints( fibonacciSpherePoints );

		for ( let i = 0; i < fibonacciSpherePoints.length; i ++ ) {

			const vertex = fibonacciSpherePoints[i];
			console.log(i)
			vertices.push( vertex.x, vertex.y, vertex.z );
			
		}
/*
		for ( let iy = 0; iy <= heightSegments; iy ++ ) {

			const verticesRow = [];

			const v = iy / heightSegments;

			// special case for the poles

			let uOffset = 0;

			if ( iy == 0 && thetaStart == 0 ) {

				uOffset = 0.5 / widthSegments;

			} else if ( iy == heightSegments && thetaEnd == Math.PI ) {

				uOffset = - 0.5 / widthSegments;

			}

			for ( let ix = 0; ix <= widthSegments; ix ++ ) {

				const u = ix / widthSegments;

				// vertex

				vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
				vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
				vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				normal.copy( vertex ).normalize();
				normals.push( normal.x, normal.y, normal.z );

				// uv

				uvs.push( u + uOffset, 1 - v );

				verticesRow.push( index ++ );

			}

			grid.push( verticesRow );

		}
*/

		// indices

/*
		for ( let iy = 0; iy < heightSegments; iy ++ ) {

			for ( let ix = 0; ix < widthSegments; ix ++ ) {

				const a = grid[ iy ][ ix + 1 ];
				const b = grid[ iy ][ ix ];
				const c = grid[ iy + 1 ][ ix ];
				const d = grid[ iy + 1 ][ ix + 1 ];

				if ( iy !== 0 || thetaStart > 0 ) indices.push( a, b, d );
				if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, c, d );

			}

		}
*/

		// build geometry

//		this.setIndex( indices );
		this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
//		this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
//		this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

	}

	static fromJSON( data ) {

		return new FibonacciSphereGeometry( data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength );

	}

}

export { FibonacciSphereGeometry };

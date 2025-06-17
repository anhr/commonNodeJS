/**
 * @module AnglesRange
 * @description Hypersphere angles range.
 */
const π = Math.PI,
	rotateLatitude = - π / 2,//Поворачиваем широту на 90 градусов что бы начало координат широты находилось на экваторе;
	anglesRange = {
 
		altitude: {
 
			get angleName() { return 'Altitude'; },

			//Высота меняется в диапазоне 0 180 градусов. В центре гиперсферы вершины белого и синего цвета по краям зеленого
			get min() { return 0; },
			get max() { return π; },
 
		},
		get rotateLatitude() { return rotateLatitude; },
		latitude: {
			
			get angleName() { return 'Latitude'; },
			get min() { return 0 + rotateLatitude; },//-π/2;
			get max() { return π + rotateLatitude; },//π/2;

		},
		longitude: {
 
			get angleName() { return 'Longitude'; },
			get min() { return -π; },
			get max() { return π; },
 
		},
 
	}
export default anglesRange;
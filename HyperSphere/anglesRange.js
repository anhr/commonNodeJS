/**
 * @module AnglesRange
 * @description Hypersphere angles range.
 */
const π = Math.PI,
	rotateLatitude = - π / 2,//Поворачиваем широту на 90 градусов что бы начало координат широты находилось на экваторе;
	anglesRange = {
 
		altitude: {
 
			angleName: 'Altitude',
			min: 0, max: π,//Высота меняется в диапазоне 0 180 градусов. В центре гиперсферы вершины белого и синего цвета по краям зеленого
 
		},
		rotateLatitude: rotateLatitude,
		latitude: {
			
			angleName: 'Latitude',
			min: 0 + rotateLatitude,//- π / 2;
			max: π + rotateLatitude,//π / 2;

		},
		longitude: {
 
			angleName: 'Longitude',
			min: - π,
			max: π,
 
		},
 
	}
export default anglesRange;
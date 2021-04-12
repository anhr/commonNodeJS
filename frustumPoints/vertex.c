//frustumPoints
//#define M_PI 3.1415926535897932384626433832795
//#define debug_version
attribute float size;
varying vec4 vColor;
uniform float pointSize;
uniform sampler2D palette;
uniform sampler2D cloudPoints;//array of all points with cloud. Все точки у которых есть облако. Тоесть есть ключ frustumPoints в параметре 
//uniform float cloudPointsSize;

//function of distance between points in range [0,1]
//	width = distanceTableWidth( distanceTable points count )
//	height = 2
//contains two lines:
//	Every line have x from 0 to width - 1
//	First line (y = 0) is function of distance
//	Second line (y = 1) is distance from cloud point to frustum point
uniform sampler2D distanceTable;
float getDistanceIndex( float distance ){

	const float distanceTableWidth = %distanceTableWidth;
/*
	//Example of distanceTable:
	//distanceTableWidth = 3.
	//distanceTable first line is function of distance or fDistance:
	//1., 0.5, 0.
	//distanceTable second line is distance from cloud point to frustum point or iDistance:
	//0., 0.75, 1.5.

	//i = 2. x = i / iMax = 2 / 2 = 1.
	//i = 1. x = i / iMax = 1 / 2 = 0.5
	//i = 0. x = i / iMax = 0 / 2 = 0.
	//
	//i		x	iDistance	fDistance
	//--------
	//2.	1.	1.5			0.
	//1.	0.5	0.75		0.5
	//0.	0.	0.			1.
*/
	//Example of distanceTable:
	//distanceTableWidth = 5.
	//distanceTable first line is function of distance or fDistance:
	//0: 1
	//1: 0.75
	//2: 0.5
	//3: 0.25
	//4: 0

	//distanceTable second line is distance from cloud point to frustum point or iDistance:
	//5: 0
	//6: 0.125
	//7: 0.25
	//8: 0.375
	//9: 0.5

	float x;//x coordinate in range [0., 1.]
/*
	//i		x		iDistance	fDistance
	//--------
	//4.	1.		0.5			0.
	//3.	0.75	0.375		0.25
	//2.	0.5		0.25		0.5
	//1.	0.25	0.125		0.75
	//0.	0.		0.			1.
	const float iMax = distanceTableWidth - 1.;
	for ( float i = iMax; i >= 0.; i -- ) {
	
		x = i / iMax;
		float iDistance = texture2D( distanceTable, vec2( x, 1. ) ).x;
		if( iDistance <= distance )
			break;
		
	}
*/
	//поиск iDistance методом половинного деления
	//distance = 0.3
	//dx = 1/2 = 0.5 на эту величину надо увеличить или уменьшить x в зависимости от того, distance-iDistance больше или меньше нуля
	//
	//dx	x						iDistance	distance-iDistance
	//-------------------
	//0.5	1.						0.5			0.3-0.5=-0.2<0//Начнем с конца диапазона.
	//0.5	x-dx=1-0.5=0.5			0.25		0.3-0.25=0.05>0
	//0.25	x+dx=0.5+0.25=0.75		0.375		0.3-0.375=-0.075<0
	//0.125	x-dx=0.75-0.125=0.625	0.375 //iDistance не изменилось. Кончаем поиск
	x = 1.; float dx = 0.5;
	float iDistance = -1.;
	for ( float i = distanceTableWidth - 1.; i >= 0.; i -- ) {

		float iDistanceCur = iDistance;
		iDistance = texture2D( distanceTable, vec2( x, 1. ) ).x;
		if ( iDistanceCur == iDistance )
			break;
		if ( distance - iDistance < 0. )
			x -= dx;
		else x += dx;
		dx /= 2.;

	}
	return x;

}

//Cloud Points. See frustumPoints.create.cloud.editShaderText function for details. Example: uniform vec4 CP0_0;
//%cloudPoints

uniform vec3 cameraPositionDefault;//Начальное положение камеры. Это значение не меняется когда пользователь поворачиват камеру
uniform vec4 cameraQuaternion;

#ifdef debug_version
void debug(float value){
	int red = 1;//positive value is red square
	int green = 0;
	if(value < 0.)
	{
		red = 0;
		green = 1;//negative value is green square
		value = - value;
	}
	gl_PointSize =  value;
	vColor = vec4(red,green,0,1);
}
#endif

//I see:
//ERROR: 0:68: 'i' : Loop index cannot be compared with non-constant expression
//if cloudPointsWidth is not const
//For resolving of issue I am replace the cloudPointsWidth to the count of the cloud points
//after loading of this file and before including into THREE.ShaderMaterial.
//See 
//shaderText.vertex = shaderText.vertex.replace(...);
//in the function getShaderMaterialPoints(...)
const float cloudPointsWidth = %scloudPointsWidth;

vec3 pointPosition;

//opacity of the frustum point
//0. - completely transparent
//1. - full opacity
float w = 0.;

//palette texture index of the frustum point in range from -1.0 to 1.0.
//-1. is red color,
// 0. is dark gray,
// 1. is green
float paletteIndex = 0.;

//distance to cloud point
void DTCP(vec4 cloudPoint){
	float dmax = 1.;//0.3;
	float distance = distance( cloudPoint.xyz, pointPosition) / dmax;//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml

	//distance	fDistance
	//0			1
	//1			0
	//10		0
//	float fDistance = texture2D( distanceTable, vec2( distance, 0. ) ).x;

	//Example of distanceTable. See getDistanceIndex for details

	//i is index of the width distanceTable
	//x is index of the width distanceTable in the range from 0. to 1.
	//iDistance distance from distanceTable for current i
	//fDistance is function of distance from distanceTable for current i
	//
	//i		x	iDistance	fDistance
	//--------
	//2.	1.	1.5			0.
	//1.	0.5	0.75		0.5
	//0.	0.	0.			1.

	//distance	x	fDistance
	//10.		1.	0.
	//1.5		1.	0.
	//0.75		0.5	0.5
	//0.		0.	1.
	float fDistance = texture2D( distanceTable, vec2( getDistanceIndex( distance ), 0. ) ).x;
	w += fDistance;
/*
	distance = - distance / dmax + 1.;
	if( distance < 0. )
		distance = 0.;
	w += distance;
*/
	paletteIndex += cloudPoint.w * fDistance;
}
void main() {
	//////////////////////////////////////////////
	//default uniforms and attributes: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

	//default vertex attributes provided by Geometry and BufferGeometry
	//vec3 position: attribute vec3 position

	//vec3 cameraPosition = camera position in world space. Меняется с поворотом камеры
	//mat4 modelViewMatrix = camera.matrixWorldInverse * object.matrixWorld
	//mat4 projectionMatrix = camera.projectionMatrix Represents the information how to project the scene to clip space. Вычисляется из left, width, top, height, near, far усеченной пирамиды frustum перед камерой
	//mat4 viewMatrix = camera.matrixWorldInverse  The view matrix - the inverse of the Camera's matrixWorld.
	//////////////////////////////////////////////

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

	vec3 cPosition = vec3(position.x + cameraPositionDefault.x, position.y + cameraPositionDefault.y, position.z + cameraPositionDefault.z );
//	vec3 cPosition = vec3(position.x + cameraPosition.x, position.y + cameraPosition.y, position.z + cameraPosition.z );

	//Rotate position
	//https://stackoverflow.com/questions/9037174/glsl-rotation-with-a-rotation-vector
	cPosition = cPosition + 2.0*cross(cameraQuaternion.xyz, cross(cameraQuaternion.xyz, cPosition) + cameraQuaternion.w * cPosition);
	gl_Position = projectionMatrix * mvPosition;
//	vec2 cloudPointsSize = textureSize(cloudPoints, 0.);

#ifdef debug_version
//debug(50.0 * cameraQuaternion.w);
//	debug(10.0 * cPosition.z);
//	debug(20.0 * cameraRotationDefault.y);
//	debug(10.0 * position.z);
//	debug(10.0 * cameraPositionDefault.z);
//	debug(10.0 * gl_Position.x);
//	debug(100.0 * cloudPoints0.z);
//	debug(10.0 * cameraPosition.z);
//	debug(20.0 * vec3( 1.0, 1.0, 1.0 ).x);
//	debug(100.0 * texture2D( palette, vec2( 0., 0. ) ).y);
//	debug(20.0 * texture2D( cloudPoints, vec2( 9. / ( cloudPointsWidth - 1. ), 0. ) ).x);
//	debug(20.0 * texture2D( cloudPoints, vec2( 1., 0. ) ).y);
/*
	//ступенчатая зависимость выходного значения от дистанции
	//data = {
	//------------------------
	//x		0.	0.5		1.
	//------------------------
	//y=0.	1,	0.75,	0.5,//function of distance
	//y=1.	0,	0.5,	1,//distance from cloud point to frustum point
	//}
	//x		y	fDistance	distance
	//0.	0.	1.
	//0.5	0.	0.75
	//1.	0.	0.5
	//3.	0.	0.5
	//0.	1.				0.
	//0.5	1.				0.5
	//1.	1.				1.
	float x = 3.;//range from 0. to 1.
	float y = 0.;//range from 0. to 1.
	debug(40.0 * texture2D( distanceTable, vec2( x, y ) ).x);
*/
/*
	//i is index of the width distanceTable
	//x is index of the width distanceTable in the range from 0. to 1.
	//iDistance distance from distanceTable for current i
	//
	//i		x	iDistance	fDistance
	//--------
	//2.	1.	1.5			0.
	//1.	0.5	0.75		0.5
	//0.	0.	0.			1.

	//distance	x	fDistance
	//10.		1.	0.
	//1.5		1.	0.
	//0.75		0.5	0.5
	//0.		0.	1.
	debug(40.0 * texture2D( distanceTable, vec2( getDistanceIndex( 0. ), 0. ) ).x );
*/
/*
	float i = 0.;
	DTCP(texture2D( cloudPoints, vec2( i / ( cloudPointsWidth - 1. ), 0. ) ));
	debug(40.0 * paletteIndex );
*/	
/*
	float distance = 0.75;
	float x = getDistanceIndex( distance );
	float y = 0.;//range from 0. to 1.
	//	First line (y = 0) is function of distance
	//	Second line (y = 1) is distance from cloud point to frustum point
	float fDistance = texture2D( distanceTable, vec2( x, y ) ).x;
	debug(80.0 * fDistance );
*/
//	debug(10.0 * CP0_0.w);
//	debug(1.0 * cloudPointsSize);
#endif
	pointPosition = vec3( cPosition.x, cPosition.y, cPosition.z );
	//distance to cloud points. See frustumPoints.create.cloud.editShaderText function for details. Example: DTCP(CP0_0);
//%DTCP
	for ( float i = 0.; i < cloudPointsWidth; i++ ) {

		//В texture2D второй параметр Texture coordinates is float и лежит в диапазоне от 0. до 1.
		//https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Texture_coordinates
		//Поэтому для получения значения текущей точки с облаком i нужно поделить на общее число точек.
		//Пробовал вместо texture2D использовать texelFetch что бы избежать использовать Texture coordinates is float
		//https://stackoverflow.com/questions/31360409/what-is-texture-coordinate-p-in-texture-sampler2d-lookup-glsl
		//Но получил ошибку компиляции
		//ERROR: 0:310: 'texelFetch' : no matching overloaded function found
#ifndef debug_version
		DTCP(texture2D( cloudPoints, vec2( i / ( cloudPointsWidth - 1. ), 0. ) ));
#endif

	}

	if ( w > 1. ){//перегрузка непрозрачности
#ifndef debug_version
		vColor.g = 0.;
		vColor.b = 0.;
#endif
		w = 1.;
	}
#ifndef debug_version
	//Convert paletteIndex range [-1, 1] to range [0, 1]
	float paletteIndex = ( paletteIndex / 2.) + 0.5;

	//paletteIndex is x coordinate of the palette texture in normalized range from 0.0 to 1.0. https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Texture_coordinates
	//0.0  is red color,
	//0.5 is dark gray,
	//1.0 is green
	vColor = texture2D( palette, vec2( paletteIndex, 0. ) );
	vColor.w = w;
	gl_PointSize = 2. * w + pointSize;
//	gl_PointSize = pointSize;
#endif

}

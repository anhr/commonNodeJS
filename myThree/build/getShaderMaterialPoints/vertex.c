attribute float size;
//attribute vec4 ca;
attribute vec4 color;
varying vec4 vColor;
//uniform vec3 pointsPosition;
uniform float pointSize;
//uniform sampler2D cloudPoints;

void main() {

//vec4 cloudPoint = texture2D( cloudPoints, vec2( 1, 0 ) );
//vec4 cloudPoint = texture2D( pointTexture, pointCoord );

//	vColor = ca;
	vColor = color;
//vColor = vec4( 1.0, 0.0, 1.0, 1.0 );
//printf("GL Vendor : %s\n", "vendor");


	//////////////////////////////////////////////
	//default uniforms and attributes: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

	//default vertex attributes provided by Geometry and BufferGeometry
	//position: attribute vec3 position

	//cameraPosition = camera position in world space
	//modelViewMatrix = camera.matrixWorldInverse * object.matrixWorld
	//projectionMatrix = camera.projectionMatrix
	//////////////////////////////////////////////

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//	gl_PointSize = size * ( 300.0 / -mvPosition.z );
//	gl_PointSize = 0.15 * ( 300.0 / -mvPosition.z );
//pointsPosition.x = 0.4;
//pointsPosition.y = 0.4;
//pointsPosition.z = 2.0;
//	pp.xyz = vec3(pointsPosition.x, pointsPosition.y, pointsPosition.z);
//	vec3 worldPosition = position + pointsPosition;
//worldPosition.z -= 10.0;
//	float distance = distance( cameraPosition, worldPosition);//https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/distance.xhtml

	//если не поделить на mvPosition.z то размер точки будет зивисеть от того, насколько близко пользователь приблизит камеру к точке
	//Другими словами видимый размер точки не должен зависеть от того, что пользователь покрутил колесико на мышке
//	gl_PointSize = distance * ( 10.0 / -mvPosition.z );
	gl_PointSize = pointSize;

//debug
//gl_PointSize = - 30.0 * mvPosition.x;
//gl_PointSize = - 30.0 * mvPosition.y;
//gl_PointSize = - 30.0 * mvPosition.z;
//gl_PointSize = 100.0 / distance;//разный
//gl_PointSize = 5.0;//одинаковый
//gl_PointSize = 150.0 / ( cameraPosition.x + cameraPosition.y + cameraPosition.z );//одинаковый
//gl_PointSize = 50.0 * (pointsPosition.x + pointsPosition.y + pointsPosition.z);
//gl_PointSize = 50.0 * (pp.x + pp.y + pp.z);
//gl_PointSize = v[0];
//gl_PointSize = 50.0 * r;
//gl_PointSize =  10.0 * cloudPoint.r;
//gl_PointSize = 10.0;//cloudPoint.y;

	gl_Position = projectionMatrix * mvPosition;
}

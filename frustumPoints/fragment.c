//ATTENTION! currently is not using!. Use D:\My documents\MyProjects\webgl\three.js\GitHub\myThreejs\master\myPoints\fragment.c
//frustumPoints
//uniform vec4 color;
uniform sampler2D pointTexture;
varying vec4 vColor;
void main() {
	vec4 color = vec4( vColor ) * texture2D( pointTexture, gl_PointCoord );
	gl_FragColor = color;
}

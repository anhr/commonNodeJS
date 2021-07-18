//uniform vec4 color;
uniform sampler2D pointTexture;
varying vec4 vColor;
void main() {
	vec4 color = vec4( vColor ) * texture2D( pointTexture, gl_PointCoord );
	gl_FragColor = color;
}

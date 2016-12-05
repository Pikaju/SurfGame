
uniform float sunX;
uniform float sunY;
uniform float sunZ;

uniform float camX;
uniform float camY;
uniform float camZ;

varying vec4 vertex;
varying vec4 color;
varying vec3 normal;

void main() {
	gl_FragColor = vec4(color.xyz * max(0.2, dot(normal, normalize(vec3(sunX, sunY, sunZ)))), 1);
}
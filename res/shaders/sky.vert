
varying vec4 vertex;
varying vec4 color;
varying vec3 normal;

void main() {
	vertex = gl_Vertex;
	color = gl_Color;
	normal = gl_Normal;
	gl_Position = ftransform();
}
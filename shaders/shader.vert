#version 300 es
uniform mat4 uMatrizProyeccion;
uniform mat4 uMatrizModelo;
layout(location = 0) in vec2 aVertices;
uniform float uPointSize;

void main() {
    gl_Position = uMatrizProyeccion * uMatrizModelo * vec4(aVertices, 0.0, 1.0);
    gl_PointSize = 1.8;
}

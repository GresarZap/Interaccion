import { loadFile } from "../utils/load_file.js";
import { Circulo } from "./circulo.js";
import Ground from "./ground.js";
import { ortho, identidad } from "./mat4.js";
import Snake from "./snake.js";

let gl;
let shaderDeVertice;
let shaderDeFragmento;
let programaID;
let uColor;
let ground;
let circulo;
let snake;
let moving = "ArrowRight";
let canvas;
let width;
let height;
let run;

let MatrizProyeccion = new Array(16);
let uMatrizProyeccion;
let MatrizModelo = new Array(16);
let uMatrizModelo;



let index = 0;

async function main() {
    let corner = await loadFile('/data/background/corner.json');
    corner = await JSON.parse(corner);
    let edge = await loadFile('/data/background/edge.json');
    edge = await JSON.parse(edge);
    let center = await loadFile('/data/background/center.json');
    center = await JSON.parse(center);

    width = 8;
    height = 4;

    console.log('ww:', width * corner.dimensions.width);

    iniWebgl(width * corner.dimensions.width, height * corner.dimensions.height);
    await creaShader();
    vinculaShader();
    background([0, 0, 0, 1]);
    variablesUniform();

    identidad(MatrizModelo);

    ground = new Ground(corner, edge, center, width, height, gl, uMatrizModelo, MatrizModelo);
    proyeccion(0, ground._pixelX, ground.pixelY, 0, -1, 1);
    ground.draw(uColor);

    let origen = ground.edge.dimensions.width / 2 - 10;
    let offset = 20;
    circulo = new Circulo(gl, origen, origen + offset, origen + offset, MatrizModelo, uMatrizModelo);
    circulo.color = [0.0, 0.0, 0.0, 1.0];
    circulo.dibuja(gl, true, uColor, 0, 0);
    snake = new Snake(ground.pixelX, ground.pixelY, 5, origen * 2 + offset * 2, origen * 2 + offset * 2);
    startAutoMove();
}
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            moving = "ArrowUp";
            break;
        case "ArrowDown":
            moving = "ArrowDown";
            break;
        case "ArrowLeft":
            moving = "ArrowLeft";
            break;
        case "ArrowRight":
            moving = "ArrowRight";
            break;
        case "Enter":
            if (run)
                stopAutoMove();
            else
                startAutoMove();
            break;
        default:
            break;
    }
});

function stopAutoMove() {
    clearInterval(run);
    run = null;
}

function startAutoMove() {
    run = setInterval(() => {
        switch (moving) {
            case "ArrowUp":
                if(snake.moveUp()){
                    ground.draw(uColor);
                    // console.log(snake.posY);
                    circulo.dibuja(gl, true, uColor, snake.posX, snake.posY);
                }
                break;
            case "ArrowDown":
                if(snake.moveDown()){
                    ground.draw(uColor);
                    // console.log(snake.posY);
                    circulo.dibuja(gl, true, uColor, snake.posX, snake.posY);
                }
                break;
            case "ArrowLeft":
                if(snake.moveLeft()){
                    ground.draw(uColor);
                    // console.log(snake.posX);
                    circulo.dibuja(gl, true, uColor, snake.posX, snake.posY);
                }
                break;
            case "ArrowRight":
                if(snake.moveRigth()){
                    ground.draw(uColor);
                    // console.log(snake.posX);
                    circulo.dibuja(gl, true, uColor, snake.posX, snake.posY);
                }
                break;
            default:
                break;
        }
    }, 50);
}



function iniWebgl(w, h) {
    // 2. Inicializacion de webgl
    canvas = document.getElementById("webglcanvas");
    resizeCanvas(w, h);
    gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("WebGL 2.0 no es compatible con este navegador.");
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

async function creaShader() {
    // 3. Creacion de Shaders
    // Shader Vertex
    shaderDeVertice = gl.createShader(gl.VERTEX_SHADER);
    const vertexCode = await loadFile('../shaders/shader.vert');
    gl.shaderSource(shaderDeVertice, vertexCode.trim());
    gl.compileShader(shaderDeVertice);

    if (!gl.getShaderParameter(shaderDeVertice, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shaderDeVertice));
    }

    // Shader Fragment
    shaderDeFragmento = gl.createShader(gl.FRAGMENT_SHADER);
    const fragCode = await loadFile('../shaders/shader.frag');
    gl.shaderSource(shaderDeFragmento, fragCode.trim());
    gl.compileShader(shaderDeFragmento);

    if (!gl.getShaderParameter(shaderDeFragmento, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shaderDeFragmento));
    }
}

function vinculaShader() {
    programaID = gl.createProgram();

    gl.attachShader(programaID, shaderDeVertice);
    gl.attachShader(programaID, shaderDeFragmento);
    gl.linkProgram(programaID);

    if (!gl.getProgramParameter(programaID, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(programaID));
    }

    gl.useProgram(programaID);

    return programaID;
}

function background(bg) {
    // 6. Configuración del color de limpieza
    gl.clearColor(...bg);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function variablesUniform() {
    // 7. Configuración de valores uniform
    uColor = gl.getUniformLocation(programaID, "uColor");
    uMatrizModelo = gl.getUniformLocation(programaID, "uMatrizModelo");
}

function proyeccion(left, right, bottom, top, near, far) {
    // 7.1 Transformacion

    uMatrizProyeccion = gl.getUniformLocation(programaID, "uMatrizProyeccion");
    ortho(MatrizProyeccion, left, right, bottom, top, near, far);
    gl.uniformMatrix4fv(uMatrizProyeccion, false, MatrizProyeccion);
}



function resizeCanvas(width, height) {
    console.log('resize: ', width, height)
    canvas.width = width;
    canvas.height = height;

    void canvas.offsetHeight; // Forzar reflow
}

window.onload = main;

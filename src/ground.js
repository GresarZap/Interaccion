import { traslacion, rotacionZ, identidad } from './mat4.js';

class Ground {
    static EDGE = 'E';
    static CENTER = 'CE';
    static CORNER = 'C';
    constructor(corner, edge, center, width, height, gl, uMatrizModelo, MatrizModelo) {

        this._width = null;
        this.width = width;
        this._height = null;
        this.height = height;
        this._corner = corner;
        this._edge = edge;
        this._mapGrid = new Array(this._height).fill().map(() => new Array(this._width).fill(0));
        this.fillMapGrid();
        // console.log(this._mapGrid);
        this._dataCorner = corner;
        // console.log(this._dataCorner.dimensions);
        this._dataEdge = edge;
        // console.log(this._dataEdge.dimensions);
        this._dataCenter = center;
        // console.log(this._dataCenter.dimensions);
        this._MatrizModelo = MatrizModelo;
        this._uMatrizModelo = uMatrizModelo;


        this._pixelX = this._dataCorner.dimensions.width * this.width;
        this._pixelY = this._dataCorner.dimensions.height * this.height;
        console.log(this._pixelX, this._pixelY);

        this._gl = gl;


        this._vertices = [];
        this._pointVAO = null;

        this.createVertices();
        this.vertexBuffer();
    }

    fillMapGrid() {
        let startX = 0;
        let endX = this._width - 1;
        let startY = 0;
        let endY = this._height - 1;

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {

                if ((x > startX && y > startY) && (x < endX && y < endY))
                    this._mapGrid[y][x] = Ground.CENTER;
                else {
                    if (x > startX && x < endX && (y == startY || y == endY)) {
                        this._mapGrid[y][x] = Ground.EDGE;
                    } else {
                        if ((x == startX || x == endX) && y > startY && y < endY)
                            this._mapGrid[y][x] = Ground.EDGE;
                        else
                            this._mapGrid[y][x] = Ground.CORNER;
                    }
                }
            }
        }
    }

    createVertices() {

        for (let y = 0; y < this._edge.dimensions.height; y++) {
            for (let x = 0; x < this._edge.dimensions.width; x++) {
                this._vertices.push(x);
                this._vertices.push(y);
            }
        }

        // console.log(this._vertices);
    }

    vertexBuffer() {
        /* Se crea el objeto del arreglo de vértices (VAO) */
        this._pointVAO = this._gl.createVertexArray();

        /* Se activa el objeto */
        this._gl.bindVertexArray(this._pointVAO);


        /* Se genera un nombre (código) para el buffer */
        var codigoVertices = this._gl.createBuffer();

        /* Se asigna un nombre (código) al buffer */
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, codigoVertices);

        /* Se transfiere los datos desde la memoria nativa al buffer de la GPU */
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._vertices), this._gl.STATIC_DRAW);

        /* Se habilita el arrethis._glo de los vértices (indice = 0) */
        this._gl.enableVertexAttribArray(0);

        /* Se especifica los atributos del arrethis._glo de vértices */
        this._gl.vertexAttribPointer(0, 2, this._gl.FLOAT, false, 0, 0);


        /* Se desactiva el objeto del arrethis._glo de vértices */
        this._gl.bindVertexArray(null);

        /* Se deja de asignar un nombre (código) al buffer */
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
    }

    draw(uColor) {

        let startX = 0;
        let endX = this._width - 1;
        let startY = 0;
        let endY = this._height - 1;

        let width = this._corner.dimensions.width;
        let height = this._corner.dimensions.height;

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                identidad(this._MatrizModelo);
                if (this._mapGrid[y][x] == Ground.CENTER) {
                    traslacion(this._MatrizModelo, x * width, y * height, 0);
                    this._gl.uniformMatrix4fv(this._uMatrizModelo, false, this._MatrizModelo);
                    this._gl.bindVertexArray(this._pointVAO);
                    for (let index = 0; index < this._vertices.length; index += 2) {

                        this.colorCenterPixel(index / 2, uColor);
                        this._gl.drawArrays(this._gl.POINTS, index / 2, 1);
                    }
                    this._gl.bindVertexArray(null);
                } else {
                    if (this._mapGrid[y][x] == Ground.EDGE) {
                        traslacion(this._MatrizModelo, x * width, y * height, 0);
                        if (x == 0) {
                            traslacion(this._MatrizModelo, 0 * width, 1 * height, 0);
                            rotacionZ(this._MatrizModelo, -90);
                        } else if (x == this._width - 1) {
                            traslacion(this._MatrizModelo, 1 * width, 0 * height, 0);
                            rotacionZ(this._MatrizModelo, 90);
                        } else if (y == this._height - 1) {
                            rotacionZ(this._MatrizModelo, 180);
                            traslacion(this._MatrizModelo, -1 * width, -1 * height, 0);
                        }
                        this._gl.uniformMatrix4fv(this._uMatrizModelo, false, this._MatrizModelo);
                        this._gl.bindVertexArray(this._pointVAO);
                        for (let index = 0; index < this._vertices.length; index += 2) {
                            this.colorEdgePixel(index / 2, uColor);
                            this._gl.drawArrays(this._gl.POINTS, index / 2, 1);
                        }
                        this._gl.bindVertexArray(null);
                    } else {
                        traslacion(this._MatrizModelo, x * width, y * height, 0);
                        if (x == 0 && y != 0) {
                            rotacionZ(this._MatrizModelo, -90);
                            traslacion(this._MatrizModelo, -1 * width, 0 * height, 0);
                        }else if(x==this._width-1 && y == 0){
                            rotacionZ(this._MatrizModelo, 90);
                            traslacion(this._MatrizModelo, 0 * width, -1 * height, 0);
                        }else if(x==this.width-1 && y == this._height-1){
                            rotacionZ(this._MatrizModelo, 180);
                            traslacion(this._MatrizModelo, -1 * width, -1 * height, 0);

                        }
                        this._gl.uniformMatrix4fv(this._uMatrizModelo, false, this._MatrizModelo);
                        this._gl.bindVertexArray(this._pointVAO);
                        for (let index = 0; index < this._vertices.length; index += 2) {

                            this.colorCornerPixel(index / 2, uColor);
                            this._gl.drawArrays(this._gl.POINTS, index / 2, 1);
                        }
                        this._gl.bindVertexArray(null);
                    }
                }
            }
        }

    }

    //recibe la coordena x,y y define el color en esa posicion para el lado
    colorEdgePixel(x, uColor) {
        let r = this._dataEdge.pixels[x * 4];
        let g = this._dataEdge.pixels[x * 4 + 1];
        let b = this._dataEdge.pixels[x * 4 + 2];
        let a = this._dataEdge.pixels[x * 4 + 3];
        // console.log("rgba", r,g,b,a);
        this._gl.uniform4f(uColor, r, g, b, a);
    }

    //recibe la coordena x,y y define el color en esa posicion para la esquina
    colorCornerPixel(x, uColor) {
        let r = this._dataCorner.pixels[x * 4];
        let g = this._dataCorner.pixels[x * 4 + 1];
        let b = this._dataCorner.pixels[x * 4 + 2];
        let a = this._dataCorner.pixels[x * 4 + 3];
        // console.log("rgba", r,g,b,a);
        this._gl.uniform4f(uColor, r, g, b, a);
    }

    //recibe la coordena x,y y define el color en esa posicion para la esquina
    colorCenterPixel(x, uColor) {
        let r = this._dataCenter.pixels[x * 4];
        let g = this._dataCenter.pixels[x * 4 + 1];
        let b = this._dataCenter.pixels[x * 4 + 2];
        let a = this._dataCenter.pixels[x * 4 + 3];
        // console.log("rgba", r,g,b,a);
        this._gl.uniform4f(uColor, r, g, b, a);
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value >= 2 ? value : 2;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value >= 2 ? value : 2;
    }

    get corner() {
        return this._corner;
    }

    set corner(value) {
        this._corner = value;
    }

    get edge() {
        return this._edge;
    }

    set edge(value) {
        this._edge = value;
    }
    get pixelX() {
        return this._pixelX;
    }
    get pixelY() {
        return this._pixelY;
    }



}

export default Ground;
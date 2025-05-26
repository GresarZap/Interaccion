class Snake {
    constructor(mapWidth, mapHeight, step, bodyWidth, bodyHeight) {
        this._bodyWidth = bodyWidth;
        this._bodyHeight = bodyHeight;
        this._mapWidth = mapWidth - this._bodyWidth; // Width of the map
        this._mapHeight = mapHeight - this._bodyHeight; // Height of the map
        this._posX = 0;
        this._posY = 0;
        this._step = step;
    }

    moveLeft() {
        if (this._posX - this._step >= 0) {
            this._posX -= this._step;
            return true;
        }
        return false;
    }

    moveRigth() {
        if (this._posX + this._step <= this._mapWidth) {
            this._posX += this._step;
            return true;
        }
        return false;
    }

    moveUp() {
        if (this._posY - this._step >= 0) {
            this._posY -= this._step;
            return true;
        }
        return false;
    }

    moveDown() {
        if (this._posY + this._step <= this._mapHeight) {

            this._posY += this._step;
            return true;
        }
        return false;
        // console.log("y:",this.posY);
    }

    get posX() {
        return this._posX;
    }

    get posY() {
        return this._posY;
    }
}

export default Snake;
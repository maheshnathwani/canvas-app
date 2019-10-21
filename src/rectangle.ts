/**
 * Rectangle class, stores in the rectangle position and it's height and width
 */
export class Rectangle {
    x0: number;
    y0: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;

    constructor(x: number, y: number) {
        this.x0 = x;
        this.y0 = y;
    }

}

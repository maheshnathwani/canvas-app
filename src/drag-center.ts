import {Rectangle} from "./rectangle";

const ANCHOR_SIZE = 20;

export class DragCenter {
    x: number;
    y: number;
    private el: HTMLElement;

    constructor() {
        this.createMarker();
    }
    createMarker() {
        this.el = document.createElement('div');
    }
    getElement(): HTMLElement {
        return this.el;
    }
    setPosition(rectangle: Rectangle) {
        this.x = (rectangle.width - ANCHOR_SIZE)/2 + rectangle.x;
        this.y = (rectangle.height - ANCHOR_SIZE)/2 + rectangle.y;
        this.setCss();
    }
    setCss() {
        this.el.style.cssText = `height: ${ANCHOR_SIZE}px; width: ${ANCHOR_SIZE}px; background: red; position: absolute; left: ${this.x}px; top: ${this.y}px;
        cursor: move; visibility: visible;
        `;
    }
    hide() {
        this.el.style.cssText = `height: ${ANCHOR_SIZE}px; width: ${ANCHOR_SIZE}px; background: red; position: absolute; left: ${this.x}px; top: ${this.y}px;
        visibility: hidden;`;
    }

}

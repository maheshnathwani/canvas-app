export enum AnchorType {
    TOP_LEFT = 'nw',
    TOP_RIGHT = 'ne',
    BOTTOM_LEFT = 'sw',
    BOTTOM_RIGHT = 'se'
}
const ANCHOR_SIZE = 10;

/**
 * Anchor object used to resize the shape
 * Consists of 4 different types based on it's position defined in AnchorType
 */
export class DragAnchor {
    x: number;
    y: number;
    private el: HTMLElement;
    type: AnchorType;
    constructor (x: number, y: number, type: AnchorType) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.createMarker();
    }
    createMarker() {
        this.el = document.createElement('div');
    }
    getElement(): HTMLElement {
        return this.el;
    }
    setPosition(x: number, y: number) {
        this.x = x - ANCHOR_SIZE/2;
        this.y = y - ANCHOR_SIZE/2;
        this.setCss();
    }
    setCss() {
        this.el.style.cssText = `height: ${ANCHOR_SIZE}px; width: ${ANCHOR_SIZE}px; background: red; position: absolute; left: ${this.x}px; top: ${this.y}px;
        cursor: ${this.type}-resize; visibility: visible;
        `;
    }
    hide() {
        this.el.style.cssText = `height: ${ANCHOR_SIZE}px; width: ${ANCHOR_SIZE}px; background: red; position: absolute; left: ${this.x}px; top: ${this.y}px;
        visibility: hidden;`;
    }
}

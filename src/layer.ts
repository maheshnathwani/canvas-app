import {Canvas} from "./canvas";
import {Rectangle} from "./rectangle";

export class Layer {
    layerName: string;
    element: Element;
    closeButton: Element;
    canvas: Canvas;
    id: number;
    constructor(id: number, rectangle?: Rectangle) {
        this.id = id;
        this.layerName = `Layer ${id}`;
        this.createElement();
        if (rectangle)
            this.canvas = new Canvas(this.id, rectangle);
        else
            this.canvas = new Canvas(this.id);
    }
    createElement() {
        this.element = document.createElement('li');
        const name = document.createElement('span');
        name.innerText = this.layerName;
        this.closeButton = document.createElement('small');
        this.closeButton.classList.add('u-pull-right');
        this.closeButton.innerHTML = 'x';
        this.element.appendChild(name).appendChild(this.closeButton);
        this.registerListeners();
        this.markSelected();
    }
    registerListeners() {
        this.registerCloseListener();
        this.registerSelectListener();
    }
    registerCloseListener() {
        this.closeButton.addEventListener('click', (e) => {
           e.stopPropagation();
           this.element.remove();
           this.canvas.deleteSheet();
           this.element.dispatchEvent(new CustomEvent('close'));
        });
    }
    registerSelectListener() {
        this.element.addEventListener('click', () => {
            this.element.dispatchEvent(new CustomEvent('selected'));
        })
    }
    markSelected() {
        this.element.classList.add('selected');
        if (this.canvas) this.canvas.canvas.dispatchEvent(new CustomEvent('active'));
    }
    unSelect() {
        this.element.classList.remove('selected');
        if (this.canvas) this.canvas.canvas.dispatchEvent(new CustomEvent('inactive'));
    }
    getLayerElement(): Node {
        return this.element;
    }

}

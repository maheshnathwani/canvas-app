import {Layer} from "./layer";
import {ElementMap} from "./element-map";
import {Rectangle} from "./rectangle";

export class LayerManager {
    layers: any = {};
    activeLayer: string;
    layerCounter = 0;
    container: Element;
    copiedRectangle: Rectangle;
    constructor() {
        this.container = document.getElementById(ElementMap.layerContainer);
        this.addNewLayer();
    }

    addNewLayer(rectangle?: Rectangle) {
        this.layerCounter++;
        this.unselectLayers();
        const layer = new Layer(this.layerCounter, rectangle);
        this.layers[layer.layerName] = layer;
        this.registerLayerListeners(layer);
        this.container.appendChild(layer.element);
        this.activeLayer = layer.layerName;
        console.log(this.layers);
    }
    registerLayerListeners(layer: Layer) {
        layer.getLayerElement().addEventListener('close', () => {
            delete this.layers[layer.layerName];
            this.resetLayerCount();
        });
        layer.getLayerElement().addEventListener('selected', () => {
            this.unselectLayers();
            layer.markSelected();
            this.activeLayer = layer.layerName;
        })
    }
    unselectLayers() {
        Object.keys(this.layers).forEach(key => (this.layers[key] as Layer).unSelect());
    }
    resetLayerCount() {
        if (Object.keys(this.layers).length === 0) this.layerCounter = 0;
    }
    clearSheet() {
        Object.keys(this.layers).forEach(key => (this.layers[key] as Layer).closeButton.dispatchEvent(new Event('click')));
        this.layerCounter = 0;
        this.addNewLayer();
    }
    copySheet() {
        this.copiedRectangle = (this.layers[this.activeLayer] as Layer).canvas.rectangle;
    }
    pasteSheet() {
        this.addNewLayer(this.copiedRectangle);
    }
}

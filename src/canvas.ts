import {ElementMap} from "./element-map";
import {Rectangle} from "./rectangle";
import {AnchorType, DragAnchor} from "./drag-anchor";
import {DragCenter} from "./drag-center";


export class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    containerEl: Element;
    canvasContainer: HTMLElement;
    isDirty = false;
    isDrawing = false;
    isResizing = false;
    isDragging = false;
    anchors: Array<DragAnchor> = [];
    centerAnchor: DragCenter;
    rectangle: Rectangle;
    zIndex: number;
    constructor(id: number, rectangle?: Rectangle) {
        this.zIndex = id;
        this.containerEl = document.getElementById(ElementMap.canvasContainer);
        this.createSheet();
        if (rectangle) {
            this.rectangle = JSON.parse(JSON.stringify(rectangle));
            this.copySheet();
        }
    }

    createSheet() {
        this.canvasContainer = document.createElement('div');
        this.canvasContainer.classList.add('canvas');
        this.canvasContainer.style.zIndex = '999';
        this.canvas = document.createElement('canvas');
        this.canvas.height = window.innerHeight;
        this.canvas.width = (window.innerWidth / 12) * 10;
        this.canvasContainer.appendChild(this.canvas);
        this.containerEl.appendChild(this.canvasContainer);
        this.context = this.canvas.getContext('2d');
        this.context.strokeStyle = 'rgb(255,85,73)';
        this.initializeAnchors();
        this.registerEvents();
    }
    initializeAnchors() {
        this.anchors.push(new DragAnchor(0, 0, AnchorType.TOP_LEFT));
        this.anchors.push(new DragAnchor(0, 0, AnchorType.TOP_RIGHT));
        this.anchors.push(new DragAnchor(0, 0, AnchorType.BOTTOM_LEFT));
        this.anchors.push(new DragAnchor(0, 0, AnchorType.BOTTOM_RIGHT));
        this.anchors.forEach((anchor: DragAnchor) => this.canvasContainer.appendChild(anchor.getElement()));
        // Center Anchor
        this.centerAnchor = new DragCenter();
        this.canvasContainer.appendChild(this.centerAnchor.getElement());
    }
    drawAnchors() {
        this.anchors[0].setPosition(this.rectangle.x, this.rectangle.y);
        this.anchors[1].setPosition(this.rectangle.x + this.rectangle.width, this.rectangle.y);
        this.anchors[2].setPosition(this.rectangle.x, this.rectangle.y + this.rectangle.height);
        this.anchors[3].setPosition(this.rectangle.x + this.rectangle.width, this.rectangle.y + this.rectangle.height);
        // Center Anchor
        this.centerAnchor.setPosition(this.rectangle);
    }
    deleteAnchors() {
        this.anchors.forEach((anchor: DragAnchor) => anchor.hide());
        this.centerAnchor.hide();
    }
    registerEvents() {
        this.registerMouseDown();
        this.registerMouseMove();
        this.registerMouseUp();
        this.registerActiveEvent();
        this.registerInactiveEvent();
        this.registerAnchorEvents();
        this.registerDragEvent();
    }
    copySheet() {
        this.context.strokeRect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
        this.isDirty = true;
        this.canvas.dispatchEvent(new CustomEvent('active'));
    }
    deleteSheet() {
        this.containerEl.removeChild(this.canvasContainer);
        this.deleteAnchors();
    }
    eventDefaultActions(ev: Event) {
        ev.stopPropagation();
        this.isDirty = true;
    }
    registerMouseDown() {
        this.canvas.addEventListener('mousedown', (ev: MouseEvent) => {
            if (this.isDirty) {
                this.canvas.dispatchEvent(new CustomEvent('invalid'));
                return;
            }
            this.context = this.canvas.getContext('2d');
            this.eventDefaultActions(ev);
            this.rectangle = new Rectangle(ev.layerX, ev.layerY);
            this.isDrawing = true;
        });
    }
    registerMouseMove() {
        this.canvas.addEventListener('mousemove', (ev: MouseEvent) => {
            if (!this.isDrawing && !this.isResizing && !this.isDragging) return;
            this.eventDefaultActions(ev);
            if (this.isDrawing || this.isResizing) {
                this.rectangle.x = Math.min(this.rectangle.x0, ev.layerX);
                this.rectangle.y = Math.min(this.rectangle.y0, ev.layerY);
                this.rectangle.width = Math.abs(ev.layerX - this.rectangle.x0);
                this.rectangle.height = Math.abs(ev.layerY - this.rectangle.y0);
            } else if (this.isDragging) {
                this.rectangle.x = ev.layerX - this.rectangle.width/2;
                this.rectangle.y = ev.layerY - this.rectangle.height/2;
            }
            // Clear the previous rectangle
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Exit condition if any of the dimension is 0
            if (!this.rectangle.width || !this.rectangle.height) return;
            // Draw new rectangle
            this.context.strokeRect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
        });
    }
    registerMouseUp() {
        this.canvas.addEventListener('mouseup', (ev: MouseEvent) => {
            if (this.isDrawing && !this.rectangle.height) this.isDirty = false;
            if (this.isResizing) this.isResizing = false;
            if (this.isDrawing) this.isDrawing = false;
            if (this.isDragging) this.isDragging = false;
            if (this.rectangle.height)
                this.canvas.dispatchEvent(new CustomEvent('active'));
        });
    }
    registerActiveEvent() {
        this.canvas.addEventListener('active', () => {
            this.context.strokeStyle = 'red';
            this.refreshRectangle();
            this.drawAnchors();
            this.canvasContainer.style.zIndex = `999`;

            // this.registerEvents();
        })
    }
    registerInactiveEvent() {
        this.canvas.addEventListener('inactive', () => {
            this.context.strokeStyle = 'black';
            this.refreshRectangle();
            this.deleteAnchors();
            this.canvasContainer.style.zIndex = `${this.zIndex}`;
        })
    }
    registerAnchorEvents() {
        this.anchors.forEach(anchor => {
            (function (anchor: DragAnchor, _this) {
                anchor.getElement().addEventListener('mousedown', () => {
                    _this.isResizing = true;
                    _this.deleteAnchors();
                    switch (anchor.type) {
                        case AnchorType.BOTTOM_LEFT:{
                            _this.rectangle.x0 = _this.rectangle.x + _this.rectangle.width;
                            _this.rectangle.y0 = _this.rectangle.y;

                            break;
                        }
                        case AnchorType.BOTTOM_RIGHT:{
                            _this.rectangle.x0 = _this.rectangle.x;
                            _this.rectangle.y0 = _this.rectangle.y;
                            break;
                        }
                        case AnchorType.TOP_RIGHT:{
                            _this.rectangle.y0 = _this.rectangle.y + _this.rectangle.height;
                            _this.rectangle.x0 = _this.rectangle.x;
                            break;
                        }
                        case AnchorType.TOP_LEFT:{
                            _this.rectangle.x0 = _this.rectangle.x + _this.rectangle.width;
                            _this.rectangle.y0 = _this.rectangle.y + _this.rectangle.height;
                            break;
                        }
                    }

                })
            })(anchor, this);

        })
    }
    registerDragEvent() {
        this.centerAnchor.getElement().addEventListener('mousedown', () => {
           this.isDragging = true;
           this.deleteAnchors();
        });
    }

    refreshRectangle() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeRect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
    }


}

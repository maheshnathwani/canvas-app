import './styles/style.scss';
import {LayerManager} from "./layerManager";
// Instantiate the LayerManager Object as a Global Object
const layerManager = new LayerManager();

// Add listeners to various events pertaining to sheet and the layer
document.getElementById('clearSheet').addEventListener('click', () => {
    layerManager.clearSheet()
});
document.getElementById('addLayer').addEventListener('click', () => {
    layerManager.addNewLayer()
});
document.addEventListener('copy', (e) => {
   layerManager.copySheet();
});
document.addEventListener('paste', (e) => {
    layerManager.pasteSheet();
});

import './styles/style.scss';
import {LayerManager} from "./layerManager";

const layerManager = new LayerManager();
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

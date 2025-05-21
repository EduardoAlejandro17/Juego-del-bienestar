/**
 * Punto de entrada principal del juego Secuencia
 * 
 * Inicia el controlador del juego cuando el DOM está completamente cargado.
 */
import GameController from './GameController.js';

document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});
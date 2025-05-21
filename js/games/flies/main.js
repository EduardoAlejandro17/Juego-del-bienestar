/**
 * Punto de entrada principal del juego Caza Moscas
 * 
 * Inicia el juego cuando el DOM está completamente cargado.
 * Crea una instancia de la clase Game y llama a su método startGame.
 */
document.addEventListener('DOMContentLoaded', () => {
    new Game().startGame();
});
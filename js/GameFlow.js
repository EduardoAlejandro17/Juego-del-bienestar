/**
 * Clase GameFlow
 * 
 * Controla el flujo y la secuencia de los minijuegos dentro de la aplicación.
 * Determina cuál es el siguiente juego que debe jugar el usuario según su progreso actual.
 */
import Player from './Player.js';

export default class GameFlow {
    /**
     * Determina la siguiente pantalla a mostrar según el progreso del jugador
     * 
     * Verifica qué juegos ya han sido completados y devuelve la ruta al siguiente juego,
     * o a la pantalla de resultados finales si todos los juegos han sido completados.
     * 
     * @returns {string} Ruta relativa a la siguiente pantalla a mostrar
     */
    static nextGame() {
        // Carga los datos del jugador
        const player = Player.loadFromLocalStorage();
        if (!player) return "../registration.html"; // Si no hay jugador, volver al registro
        
        // Determinar el siguiente juego según cuáles ya han sido completados
        if (!player.results.flies) {
            return "../../games/flies/flies_start.html"; // Juego Caza Moscas
        } else if (!player.results.sequence) {
            return "../../games/sequence/sequence_start.html"; // Juego Secuencia
        } else if (!player.results.colors) {
            return "../../games/juego3/juego3.html" // Juego Colores
        } else {
            return "../../final_results.html"; // Todos los juegos completados
        }
    }
}
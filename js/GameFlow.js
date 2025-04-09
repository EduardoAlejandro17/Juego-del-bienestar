class GameFlow {
    /**
     * Determina el siguiente juego que el jugador debe completar
     * basado en los resultados almacenados en localStorage
     * @returns {string} Ruta al siguiente juego o pantalla final
     */
    static nextGame() {
        // Cargar datos del jugador desde localStorage
        const player = Player.loadFromLocalStorage();
        
        // Si no hay datos de jugador, redirigir al registro
        if (!player) {
            return "../registration.html";
        }
        
        // Determinar qué juego debe jugar a continuación
        if (!player.results.flies) {
            return "../games/flies/flies_start.html";
        } /*else if (!player.results.sequence) {
            return "../games/sequence/sequence_start.html";
        } else if (!player.results.colors) {
            return "../games/colors/colors_start.html";
        } else {
            // Todos los juegos completados, mostrar resultados finales
            return "../../../final_results.html";
        } */
    }
}
/**
 * Clase Player
 * 
 * Gestiona la información del jugador a lo largo de la aplicación.
 * Contiene los datos personales, puntajes y resultados de cada juego.
 * Incluye métodos para guardar y cargar esta información en localStorage.
 */
export default class Player {
    /**
     * Constructor de la clase Player
     * Inicializa un nuevo jugador con valores predeterminados
     */
    constructor() {
        this.name = '';          // Nombre del jugador
        this.gender = '';        // Pronombre seleccionado (él, ella, elle, otro)
        this.totalScore = 0;     // Puntuación total acumulada en todos los juegos
        this.results = {
            flies: null,         // Resultados del juego Caza Moscas
            sequence: null,      // Resultados del juego Secuencia
            colors: null         // Resultados del juego Colores
        };
    }

    /**
     * Guarda los datos del jugador actual en localStorage
     * Permite mantener la persistencia entre páginas y sesiones
     */
    saveToLocalStorage() {
        localStorage.setItem('currentPlayer', JSON.stringify(this));
    }

    /**
     * Carga los datos del jugador desde localStorage
     * @returns {Player|null} Instancia de Player con los datos cargados o null si no hay datos
     */
    static loadFromLocalStorage() {
        const data = localStorage.getItem('currentPlayer');
        return data ? Object.assign(new Player(), JSON.parse(data)) : null;
    }
}

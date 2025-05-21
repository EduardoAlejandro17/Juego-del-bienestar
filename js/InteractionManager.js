/**
 * Clase InteractionManager
 * 
 * Sistema que maneja los diferentes métodos de interacción del usuario con la aplicación.
 * Implementa el patrón de diseño Strategy para permitir cambiar dinámicamente entre
 * diferentes métodos de entrada (mouse, pantalla táctil, botones físicos).
 */
export default class InteractionManager {
    /**
     * Constructor del InteractionManager
     * Inicializa las estrategias de interacción disponibles
     */
    constructor() {
        this.strategies = {};            // Almacena las diferentes estrategias de interacción
        this.activeStrategy = null;      // Estrategia actualmente en uso
    }

    /**
     * Establece las implementaciones de estrategias disponibles
     * @param {Object} strategyImplementations - Objeto con estrategias de interacción
     */
    setStrategyImplementations(strategyImplementations) {
        this.strategies = strategyImplementations;
    }

    /**
     * Cambia la estrategia de interacción activa
     * @param {string} strategyName - Nombre de la estrategia a activar
     * @returns {boolean} - Verdadero si la estrategia se activó correctamente
     */
    setStrategy(strategyName) {
        if (this.strategies[strategyName]) {
            this.activeStrategy = this.strategies[strategyName];
            this.activeStrategy.activate();
            return true;
        }
        return false;
    }
}
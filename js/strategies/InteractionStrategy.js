/**
 * Clase InteractionStrategy (Abstracta)
 * 
 * Define la interfaz común para todas las estrategias de interacción.
 * Implementa el patrón Strategy para permitir diferentes métodos de entrada.
 * Esta clase no debe instanciarse directamente, solo heredarse.
 */
export default class InteractionStrategy {
    /**
     * Constructor de la estrategia de interacción
     * @param {Function} interactionHandler - Función que procesa las interacciones
     * @throws {TypeError} - Si se intenta instanciar esta clase directamente
     */
    constructor(interactionHandler) {
      if (new.target === InteractionStrategy) {
        throw new TypeError("Cannot construct Abstract instances directly");
      }
      this.interactionHandler = interactionHandler;
    }
  
    /**
     * Inicializa la estrategia de interacción
     * @abstract
     * @throws {Error} - Si no se implementa en la clase hija
     */
    activate() {
      throw new Error("Method 'activate()' must be implemented");
    }
  
    /**
     * Limpia los recursos usados por la estrategia
     * @abstract
     * @throws {Error} - Si no se implementa en la clase hija
     */
    deactivate() {
      throw new Error("Method 'deactivate()' must be implemented");
    }
  
    /**
     * Obtiene el color asociado a un elemento del DOM
     * @param {HTMLElement} element - Elemento a verificar
     * @returns {string|null} - Color identificado o null si no se encuentra
     */
    getColorFromElement(element) {
      const colors = ['red', 'green', 'yellow', 'blue'];
      for (const color of colors) {
        if (element.classList.contains(color)) {
          return color;
        }
      }
      return null;
    }
  }
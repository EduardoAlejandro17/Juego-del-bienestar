/**
 * Clase MouseStrategy
 * 
 * Implementación concreta de estrategia de interacción mediante ratón.
 * Maneja eventos de clic en elementos con clases de colores.
 */
import InteractionStrategy from './InteractionStrategy.js';

export default class MouseStrategy extends InteractionStrategy {
    /**
     * Constructor de la estrategia de interacción por mouse
     * @param {Function} interactionHandler - Función que procesa las interacciones
     */
    constructor(interactionHandler) {
        super(interactionHandler);
        this.handlers = new Map(); // Mapa para almacenar los manejadores de eventos
    }

    /**
     * Activa la estrategia de interacción por mouse
     * Registra eventos de clic en los elementos con clase .circle
     */
    activate() {
        // Busca todos los elementos con clase .circle
        document.querySelectorAll('.circle').forEach(circle => {
            const color = this.getColorFromElement(circle);
            if (!color) return;

            // Crea un manejador de evento para este círculo
            const handler = () => {
                this.interactionHandler(color);
            };
            
            // Registra el evento de clic
            circle.addEventListener('click', handler);
            // Guarda referencia al manejador para poder limpiarlo después
            this.handlers.set(circle, handler);
        });
    }

    /**
     * Desactiva la estrategia de interacción por mouse
     * Elimina todos los eventos registrados para liberar recursos
     */
    deactivate() {
        // Elimina todos los eventos registrados
        this.handlers.forEach((handler, circle) => {
            circle.removeEventListener('click', handler);
        });
        this.handlers.clear();
    }
}
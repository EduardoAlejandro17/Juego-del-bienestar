/**
 * Estrategia para interacción mediante pantalla táctil
 * Maneja eventos touch en elementos con clases de colores
 */
import InteractionStrategy from './InteractionStrategy.js';

export default class TouchScreenStrategy extends InteractionStrategy {
    constructor(interactionHandler) {
        super(interactionHandler);
        this.handlers = new Map(); // Almacena manejadores de eventos
    }

    /**
     * Activa los eventos táctiles en elementos .circle 
     */
    activate() {
        document.querySelectorAll('.circle').forEach(circle => {
            const color = this.getColorFromElement(circle);
            if (!color) return;

            const handler = (e) => {
                e.preventDefault(); // Previene comportamientos no deseados
                this.interactionHandler(color);
            };
            
            circle.addEventListener('touchend', handler, { passive: false });
            this.handlers.set(circle, handler);
        });
    }

    /**
     * Elimina eventos táctiles para liberar recursos
     */
    deactivate() {
        this.handlers.forEach((handler, circle) => {
            circle.removeEventListener('touchend', handler);
        });
        this.handlers.clear();
    }
}
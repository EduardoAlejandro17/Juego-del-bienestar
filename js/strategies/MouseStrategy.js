import InteractionStrategy from './InteractionStrategy.js';

export default class MouseStrategy extends InteractionStrategy {
    constructor(interactionHandler) {
        super(interactionHandler);
        this.handlers = new Map();
    }

    init() {
        document.querySelectorAll('.circle').forEach(circle => {
            const color = this.getColorFromElement(circle);
            if (!color) return;

            const handler = () => {
                this.interactionHandler(color);
            };
            
            circle.addEventListener('click', handler);
            this.handlers.set(circle, handler);
        });
    }

    cleanup() {
        this.handlers.forEach((handler, circle) => {
            circle.removeEventListener('click', handler);
        });
        this.handlers.clear();
    }
}
import InteractionStrategy from './InteractionStrategy.js';

export default class TouchScreenStrategy extends InteractionStrategy {
    constructor(interactionHandler) {
        super(interactionHandler);
        this.handlers = new Map();
    }

    init() {
        document.querySelectorAll('.circle').forEach(circle => {
            const color = this.getColorFromElement(circle);
            if (!color) return;

            const handler = (e) => {
                e.preventDefault();
                this.interactionHandler(color);
            };
            
            circle.addEventListener('touchend', handler, { passive: false });
            this.handlers.set(circle, handler);
        });
    }

    cleanup() {
        this.handlers.forEach((handler, circle) => {
            circle.removeEventListener('touchend', handler);
        });
        this.handlers.clear();
    }
}
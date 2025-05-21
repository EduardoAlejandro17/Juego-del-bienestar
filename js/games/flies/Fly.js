/**
 * Clase Fly
 * 
 * Representa una mosca que se mueve hacia un objetivo específico.
 * Maneja la animación, movimiento y llegada al objetivo.
 */
class Fly {
    /**
     * Constructor de la mosca
     * @param {Target} target - Objetivo al que se dirigirá la mosca
     * @param {Function} onLandedCallback - Función a ejecutar cuando la mosca llega al objetivo
     */
    constructor(target, onLandedCallback) {
        this.target = target;                         // Objetivo al que se dirige
        this.element = this.createFlyElement();       // Elemento visual
        this.onLandedCallback = onLandedCallback;     // Callback para cuando llega
        
        // Velocidad en % por segundo (1 = 1% del contenedor por segundo)
        this.speed = 80;
        
        // Variables para control de animación
        this.animationId = null;
        this.lastFrameTime = performance.now();
        
        this.startAnimation();
    }

    /**
     * Crea el elemento visual de la mosca y lo añade al DOM
     * @returns {HTMLElement} Elemento DOM de la mosca
     */
    createFlyElement() {
        const fly = document.createElement('div');
        fly.className = 'fly';
        const gameContainer = document.getElementById('game-container');
        
        // Posición inicial aleatoria en la parte inferior (en porcentajes)
        fly.style.left = `${Math.random() * 100}%`;
        fly.style.top = `100%`;
        
        gameContainer.appendChild(fly);
        return fly;
    }
    
    /**
     * Inicia la animación de la mosca usando requestAnimationFrame
     */
    startAnimation() {
        this.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
    
    /**
     * Detiene la animación en curso
     */
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Función de animación que se ejecuta en cada frame
     * Calcula la nueva posición de la mosca basada en tiempo real
     * @param {number} currentTime - Timestamp actual proporcionado por requestAnimationFrame
     */
    animate(currentTime) {
        // Calcular tiempo transcurrido desde el último frame
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Obtener posición actual en porcentajes
        const currentX = parseFloat(this.element.style.left);
        const currentY = parseFloat(this.element.style.top);
        
        // Obtener posición objetivo en porcentajes
        const targetX = parseFloat(this.target.element.style.left);
        const targetY = parseFloat(this.target.element.style.top);
        
        // Calcular vector dirección
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1.5) { // Umbral de llegada (1.5%)
            // Normalizar dirección
            const directionX = dx / distance;
            const directionY = dy / distance;
            
            // Calcular movimiento basado en tiempo real
            // speed está en %/segundo, deltaTime en ms
            const movement = this.speed * (deltaTime / 1000);
            
            // Aplicar movimiento (en porcentajes)
            this.element.style.left = `${currentX + directionX * movement}%`;
            this.element.style.top = `${currentY + directionY * movement}%`;
            
            // Siguiente frame
            this.animationId = requestAnimationFrame(this.animate.bind(this));
        } else {
            // Mosca llegó al objetivo
            this.cleanUp();
        }
    }
    
    /**
     * Limpia recursos cuando la mosca llega al objetivo
     * Incrementa el contador del objetivo y ejecuta el callback
     */
    cleanUp() {
        this.stopAnimation();
        this.target.incrementCount();
        this.element.remove();
        this.onLandedCallback();
    }
}
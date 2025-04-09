class Fly {
    constructor(target, onLandedCallback) {
        this.target = target;
        this.element = this.createFlyElement();
        this.onLandedCallback = onLandedCallback;
        
        // Velocidad en % por segundo (1 = 1% del contenedor por segundo)
        this.speed = 80;
        
        // Variables para control de animación
        this.animationId = null;
        this.lastFrameTime = performance.now();
        
        this.startAnimation();
    }

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
    
    startAnimation() {
        this.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
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
        
        if (distance > 1.5) { // Umbral de llegada (0.5%)
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
    
    cleanUp() {
        this.stopAnimation();
        this.target.incrementCount();
        this.element.remove();
        this.onLandedCallback();
    }
}
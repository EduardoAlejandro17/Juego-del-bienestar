/**
 * Clase Timer
 * 
 * Implementa un temporizador de cuenta regresiva para el juego de Secuencia.
 * Permite iniciar, detener y reiniciar el tiempo, ejecutando una función callback al finalizar.
 */
export default class Timer {
    /**
     * Constructor del temporizador
     * @param {number} duration - Duración en segundos
     * @param {Function} callback - Función a ejecutar cuando el tiempo termina
     */
    constructor(duration, callback) {
        this.duration = duration;      // Duración total en segundos
        this.callback = callback;      // Función a ejecutar al terminar
        this.remaining = duration;     // Tiempo restante
        this.timerId = null;           // ID del intervalo
        this.startTime = null;         // Marca de tiempo de inicio
    }

    /**
     * Inicia el temporizador
     * Actualiza el tiempo restante cada 100ms y ejecuta el callback al finalizar
     */
    start() {
        this.startTime = Date.now();
        this.timerId = setInterval(() => {
            const elapsed = (Date.now() - this.startTime) / 1000;
            this.remaining = Math.max(0, this.duration - elapsed);
            
            if (this.remaining <= 0) {
                this.stop();
                this.callback();
            }
        }, 100);
    }

    /**
     * Detiene el temporizador
     */
    stop() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    /**
     * Reinicia el temporizador a su duración inicial
     */
    reset() {
        this.stop();
        this.remaining = this.duration;
    }
}
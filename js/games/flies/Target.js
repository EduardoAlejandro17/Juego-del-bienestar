/**
 * Clase Target
 * 
 * Representa un objetivo circular de color que puede recibir moscas.
 * Gestiona la creación del elemento visual y el conteo de moscas recibidas.
 */
class Target {
    /**
     * Constructor del objetivo
     * @param {string} id - Identificador único del objetivo
     * @param {number} x - Posición horizontal en porcentaje
     * @param {number} y - Posición vertical en porcentaje
     * @param {string} color - Color del objetivo (red, green, blue, yellow)
     */
    constructor(id, x, y, color) {
        this.id = id;
        this.count = 0;        // Contador de moscas recibidas
        this.color = color;    // Color del objetivo
        this.element = this.createTargetElement(x, y);
    }

    /**
     * Crea el elemento visual del objetivo y lo añade al DOM
     * @param {number} x - Posición horizontal en porcentaje
     * @param {number} y - Posición vertical en porcentaje
     * @returns {HTMLElement} Elemento DOM creado
     */
    createTargetElement(x, y) {
        const target = document.createElement('div');
        target.className = `target ${this.color}`;
        target.style.left = `${x}%`;
        target.style.top = `${y}%`;
        document.getElementById('targets-container').appendChild(target);
        return target;
    }

    /**
     * Incrementa el contador de moscas que han llegado a este objetivo
     */
    incrementCount() {
        this.count++;
        console.log(this.color + ":  " + this.count);
        // this.element.textContent = `${this.count}`;
    }
}
class Target {
    constructor(id, x, y, color) {
        this.id = id;
        this.count = 0;
        this.color = color;
        this.element = this.createTargetElement(x, y);
    }

    // Crea el elemento visual del objetivo
    createTargetElement(x, y) {
        const target = document.createElement('div');
        target.className = `target ${this.color}`;
        target.style.left = `${x}%`;
        target.style.top = `${y}%`;
        document.getElementById('targets-container').appendChild(target);
        return target;
    }

    // Incrementa el contador de moscas para este objetivo
    incrementCount() {
        this.count++;
        console.log(this.color + ":  " + this.count);
        this.element.textContent = `${this.count}`;
    }
}
/**
 * Módulo de Pantalla Final del juego Caza Moscas
 * 
 * Gestiona la pantalla donde el usuario selecciona el color que cree
 * que recibió más moscas. Evalúa la respuesta y muestra el resultado.
 */
import MouseStrategy from '../../strategies/MouseStrategy.js';
import TouchScreenStrategy from '../../strategies/TouchScreenStrategy.js';
import PhysicalButtonsStrategy from '../../strategies/PhysicalButtonsStrategy.js';
import InteractionManager from '../../InteractionManager.js';
import Player from '../../Player.js'
import GameFlow from '../../GameFlow.js';

/**
 * Clase FinalScreen
 * 
 * Controla la interacción y lógica de la pantalla final del juego Caza Moscas
 */
class FinalScreen {
    /**
     * Constructor de la pantalla final
     * Inicializa componentes y configura el sistema de interacción
     */
    constructor() {
        // Obtiene los resultados del juego guardados en localStorage
        this.results = JSON.parse(localStorage.getItem('gameResults'));
        console.log('Resultados del juego:', this.results);
        
        // Referencias a elementos del DOM
        this.resultDiv = document.getElementById('result');
        this.optionsContainer = document.querySelector('.options');
        this.actionButtonsContainer = document.getElementById('action-buttons');
        
        // Datos del resultado
        this.winner = this.results?.winner;
        this.tiedWinners = this.results?.tiedWinners || [];
        this.answered = false;

        // Información de colores
        this.colors = ['red', 'green', 'yellow', 'blue'];
        this.colorNames = ['Rojo', 'Verde', 'Amarillo', 'Azul'];

        // Sistema de interacción
        this.interactionManager = new InteractionManager();

        this.init();
    }

    /**
     * Inicializa la pantalla y configura el sistema de interacción
     */
    init() {
        // Validación de resultados
        if (!this.winner) {
            window.location.href = GameFlow.nextGame();
            return;
        }

        // Crea los botones de colores para seleccionar
        this.createColorButtons();

        // Configura las estrategias de interacción
        const strategyMap = {
            mouse: new MouseStrategy(this.handleColorSelection.bind(this)),
            touch: new TouchScreenStrategy(this.handleColorSelection.bind(this)),
            physical: new PhysicalButtonsStrategy(this.handleColorSelection.bind(this))
        };

        this.interactionManager.setStrategyImplementations(strategyMap);

        try {
            // Selecciona la estrategia según el tipo de dispositivo
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('input') === 'physical') {
                this.interactionManager.setStrategy('physical');
            } else if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                this.interactionManager.setStrategy('touch');
            } else {
                this.interactionManager.setStrategy('mouse');
            }
        } catch (err) {
            console.warn("Error al establecer estrategia de interacción:", err);
            this.interactionManager.setStrategy('mouse');
        }
    }

    /**
     * Crea los botones de colores para que el usuario seleccione
     */
    createColorButtons() {
        this.optionsContainer.innerHTML = '';

        this.colors.forEach((color, index) => {
            const btn = document.createElement('div');
            btn.className = `color-btn circle ${color}`;
            btn.dataset.index = index;
            this.optionsContainer.appendChild(btn);
        });
    }

    /**
     * Maneja la selección de un color por parte del usuario
     * @param {string} color - Color seleccionado
     */
    handleColorSelection(color) {
        if (this.answered) return;
        const selectedIndex = this.colors.indexOf(color);
        if (selectedIndex === -1) return;

        this.highlightSelection(selectedIndex);
        setTimeout(() => this.handleSelection(selectedIndex), 300);
    }

    /**
     * Resalta visualmente el color seleccionado
     * @param {number} selectedIndex - Índice del color seleccionado
     */
    highlightSelection(selectedIndex) {
        document.querySelectorAll('.color-btn').forEach((btn, index) => {
            if (index === selectedIndex) {
                btn.style.transform = 'scale(1.2)';
                btn.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            } else {
                btn.style.opacity = '0.6';
            }
        });
    }

    /**
     * Procesa la selección del usuario y muestra el resultado
     * @param {number} selectedIndex - Índice del color seleccionado
     */
    handleSelection(selectedIndex) {
        if (this.answered) return;
        this.answered = true;

        // Recupera los contadores de cada círculo
        const scores = [0, 0, 0, 0];
        this.results.targets.forEach(target => {
            scores[target.id] = target.count;
        });

        // Ordena los resultados para determinar la posición
        const sorted = [...scores]
            .map((count, index) => ({ index, count }))
            .sort((a, b) => b.count - a.count);

        // Asigna puntuación según la posición en el ranking
        const rank = sorted.findIndex(obj => obj.index === selectedIndex);
        const scoreByRank = [10, 8, 5, 3];
        const score = scoreByRank[rank] || 0;

        let resultMessage;

        // Muestra mensaje según si hay empate o no
        if (this.winner.isTie) {
            const tiedColors = this.tiedWinners.map(i => this.colorNames[i]).join(', ');
            const isCorrect = this.tiedWinners.includes(selectedIndex);

            resultMessage = isCorrect
                ? `<p class="success">¡Correcto! Hubo empate entre ${tiedColors} con ${this.winner.count} moscas cada uno.</p>`
                : `<p class="error">Incorrecto. Hubo empate entre ${tiedColors} con ${this.winner.count} moscas cada uno.</p>`;
        } else {
            const isCorrect = selectedIndex === this.winner.id;
            resultMessage = isCorrect
                ? `<p class="success">¡Correcto! El círculo ${this.colorNames[this.winner.id]} recibió ${this.winner.count} moscas.</p>`
                : `<p class="error">Incorrecto. El círculo ${this.colorNames[this.winner.id]} recibió más moscas (${this.winner.count}).</p>`;
        }

        this.resultDiv.innerHTML = resultMessage;

        // Guarda el resultado en el perfil del jugador
        const player = Player.loadFromLocalStorage();
        player.results.flies = {
            correct: selectedIndex === this.winner.id,
            score
        };
        player.totalScore += score;
        player.saveToLocalStorage();

        // Muestra el botón de continuar
        this.showActionButtons();

        // Reaplicar estilo visual al botón seleccionado
        document.querySelectorAll('.color-btn').forEach((btn, index) => {
            if (index !== selectedIndex) {
                btn.style.opacity = '0.5';
            } else {
                btn.style.transform = 'scale(1.1)';
                btn.style.boxShadow = '0 0 15px rgba(0,0,0,0.4)';
            }
        });
    }

    /**
     * Muestra el botón para continuar al siguiente juego
     */
    showActionButtons() {
        this.actionButtonsContainer.innerHTML = '';

        const continueBtn = document.createElement('div');
        continueBtn.className = "btn-action green";
        continueBtn.textContent = "Continuar";

        continueBtn.addEventListener('click', () => {
            window.location.href = GameFlow.nextGame();
        });

        this.actionButtonsContainer.appendChild(continueBtn);
        this.actionButtonsContainer.style.display = 'flex';
    }
}

// Inicia la pantalla final cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Player === 'undefined' || typeof GameFlow === 'undefined') {
        console.error('Error: Player o GameFlow no están definidos');
        return;
    }
    new FinalScreen();
});
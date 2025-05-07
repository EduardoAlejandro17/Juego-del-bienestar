import MouseStrategy from '../../strategies/MouseStrategy.js';
import TouchScreenStrategy from '../../strategies/TouchScreenStrategy.js';
import PhysicalButtonsStrategy from '../../strategies/PhysicalButtonsStrategy.js';
import InteractionManager from '../../InteractionManager.js';
import Player from '../../Player.js'
import GameFlow from '../../GameFlow.js';

class FinalScreen {
    constructor() {
        this.results = JSON.parse(localStorage.getItem('gameResults'));
        console.log('Resultados del juego:', this.results);
        this.resultDiv = document.getElementById('result');
        this.optionsContainer = document.querySelector('.options');
        this.actionButtonsContainer = document.getElementById('action-buttons');
        this.winner = this.results?.winner;
        this.tiedWinners = this.results?.tiedWinners || [];
        this.answered = false;

        this.colors = ['red', 'green', 'yellow', 'blue'];
        this.colorNames = ['Rojo', 'Verde', 'Amarillo', 'Azul'];

        this.interactionManager = new InteractionManager();

        this.init();
    }

    init() {
        if (!this.winner) {
            window.location.href = GameFlow.nextGame();
            return;
        }

        this.createColorButtons();

        const strategyMap = {
            mouse: new MouseStrategy(this.handleColorSelection.bind(this)),
            touch: new TouchScreenStrategy(this.handleColorSelection.bind(this)),
            physical: new PhysicalButtonsStrategy(this.handleColorSelection.bind(this))
        };

        this.interactionManager.setStrategyImplementations(strategyMap);

        try {
            // Solo activar botones físicos si hay interacción del usuario
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

    createColorButtons() {
        this.optionsContainer.innerHTML = '';

        this.colors.forEach((color, index) => {
            const btn = document.createElement('div');
            btn.className = `color-btn circle ${color}`;
            btn.dataset.index = index;
            this.optionsContainer.appendChild(btn);
        });
    }

    handleColorSelection(color) {
        if (this.answered) return;
        const selectedIndex = this.colors.indexOf(color);
        if (selectedIndex === -1) return;

        this.highlightSelection(selectedIndex);
        setTimeout(() => this.handleSelection(selectedIndex), 300);
    }

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

    handleSelection(selectedIndex) {
        if (this.answered) return;
        this.answered = true;

        const scores = [0, 0, 0, 0];
        this.results.targets.forEach(target => {
            scores[target.id] = target.count;
        });

        const sorted = [...scores]
            .map((count, index) => ({ index, count }))
            .sort((a, b) => b.count - a.count);

        const rank = sorted.findIndex(obj => obj.index === selectedIndex);
        const scoreByRank = [10, 8, 5, 3];
        const score = scoreByRank[rank] || 0;

        let resultMessage;

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

        // Guardar resultado
        const player = Player.loadFromLocalStorage();
        player.results.flies = {
            correct: selectedIndex === this.winner.id,
            score
        };
        player.totalScore += score;
        player.saveToLocalStorage();

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

document.addEventListener('DOMContentLoaded', () => {
    if (typeof Player === 'undefined' || typeof GameFlow === 'undefined') {
        console.error('Error: Player o GameFlow no están definidos');
        return;
    }
    new FinalScreen();
});
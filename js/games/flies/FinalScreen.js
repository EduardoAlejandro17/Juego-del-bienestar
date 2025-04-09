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
        
        this.keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
        
        this.init();
    }
    
    // Inicializa la pantalla final
    init() {
        if (!this.winner) {
            window.location.href = "../../../games/flies/flies_start.html";
            return;
        }
        
        this.createColorButtons();
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    
    // Crea los botones de colores para selección
    createColorButtons() {
        this.optionsContainer.innerHTML = '';
        
        this.colors.forEach((color, index) => {
            const btn = document.createElement('div');
            btn.className = `color-btn ${color}`;
            btn.dataset.index = index;
            btn.style.pointerEvents = 'none';
            btn.style.cursor = 'default';
            this.optionsContainer.appendChild(btn);
        });
    }
    
    // Maneja las pulsaciones de teclas
    handleKeyPress(e) {
        if (this.answered) {
            const tryAgainBtn = document.querySelector('.btn-action.red');
            const continueBtn = document.querySelector('.btn-action.green');
            
            // Azul (Continuar)
            if (e.key === '2' && continueBtn) {
                continueBtn.style.transform = 'scale(0.95)';
                continueBtn.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.3)';
                setTimeout(() => {
                    window.location.href = GameFlow.nextGame();
                }, 200);
                return;
            }
        }
        
        // Manejar selección de color
        const selected = this.keyMap[e.key];
        if (selected === undefined) return;
        
        this.highlightSelection(selected);
        setTimeout(() => this.handleSelection(selected), 300);
    }
    
    // Resalta la selección del usuario
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
    
    // Procesa la selección del usuario
    handleSelection(selectedIndex) {
        if (this.answered) return;
        this.answered = true;
        
        let resultMessage;
        let isCorrect;
        
        if (this.winner.isTie) {
            isCorrect = this.tiedWinners.includes(selectedIndex);
            const tiedColors = this.tiedWinners.map(i => this.colorNames[i]).join(', ');
            
            resultMessage = isCorrect
                ? `<p class="success">¡Correcto! Hubo empate entre ${tiedColors} con ${this.winner.count} moscas cada uno.</p>`
                : `<p class="error">Incorrecto. Hubo empate entre ${tiedColors} con ${this.winner.count} moscas cada uno.</p>`;
        } else {
            isCorrect = selectedIndex === this.winner.id;
            resultMessage = isCorrect
                ? `<p class="success">¡Correcto! El círculo ${this.colorNames[this.winner.id]} recibió ${this.winner.count} moscas.</p>`
                : `<p class="error">Incorrecto. El círculo ${this.colorNames[this.winner.id]} recibió más moscas (${this.winner.count}).</p>`;
        }
        
        this.resultDiv.innerHTML = resultMessage;
        
        // Actualizar datos del jugador
        const player = Player.loadFromLocalStorage();
        player.results.flies = {
            correct: isCorrect,
            score: isCorrect ? 10 : 0
        };
        player.totalScore += player.results.flies.score;
        player.saveToLocalStorage();
        
        this.showActionButtons();
        
        // Mantener el resaltado de la selección
        document.querySelectorAll('.color-btn').forEach((btn, index) => {
            if (index !== selectedIndex) {
                btn.style.opacity = '0.5';
            } else {
                btn.style.transform = 'scale(1.1)';
                btn.style.boxShadow = '0 0 15px rgba(0,0,0,0.4)';
            }
        });
    }
    
    // Muestra los botones de acción finales
    showActionButtons() {
        this.actionButtonsContainer.innerHTML = '';
        
        // Botón verde - Continuar
        const continueBtn = document.createElement('div');
        continueBtn.className = "btn-action green";
        continueBtn.textContent = "Continuar";
        continueBtn.style.pointerEvents = 'none';
        
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
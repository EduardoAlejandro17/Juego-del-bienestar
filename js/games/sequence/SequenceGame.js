import Timer from './Timer.js';
import Player from '../../Player.js';
import GameFlow from '../../GameFlow.js';

export default class SequenceGame {
    constructor(elements) {
        this.colors = ['red', 'green', 'yellow', 'blue'];
        this.sequence = [];
        this.playerSequence = [];
        this.round = 1;
        this.score = 0;
        this.isPlaying = false;
        this.isShowingSequence = false;
        
        this.timer = new Timer(1.5, () => this.handleTimeOut());
        this.elements = elements;
        this.player = Player.loadFromLocalStorage() || new Player();
        
        this.initializeCircles();
    }

    initializeCircles() {
        this.colors.forEach(color => {
            const circle = document.querySelector(`.${color}`);
            if (circle) {
                circle.classList.remove('active');
            }
        });
    }

    startGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.round = 1;
        this.score = 0;
        this.isPlaying = true;
        
        // Deshabilitar botón durante el juego
        if (this.elements.startBtn) {
            this.elements.startBtn.disabled = true;
            this.elements.startBtn.textContent = 'Juego en progreso...';
        }
        
        this.initializeCircles();
        this.updateUI();
        this.elements.message.textContent = '¡Comienza el juego!';
        
        this.addToSequence();
        this.showSequence();
    }

    addToSequence() {
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.sequence.push(randomColor);
    }

    showSequence() {
        this.isShowingSequence = true;
        this.elements.message.textContent = 'Memoriza la secuencia...';
        
        let i = 0;
        const showNext = () => {
            if (i >= this.sequence.length) {
                this.isShowingSequence = false;
                this.elements.message.textContent = 'Tu turno!';
                this.timer.reset();
                this.timer.start();
                this.updateTimerDisplay();
                return;
            }
            
            const color = this.sequence[i];
            this.showCircle(color);
            
            setTimeout(() => {
                i++;
                setTimeout(showNext, 150);
            }, 500);
        };
        
        showNext();
    }

    showCircle(color) {
        const circle = document.querySelector(`.${color}`);
        if (circle) {
            circle.classList.add('active');
            setTimeout(() => {
                circle.classList.remove('active');
            }, 250);
        }
    }

    handleColorClick(color) {
        if (!this.isPlaying || this.isShowingSequence) return;
        
        // Mostrar el círculo pulsado
        this.showCircle(color);
        
        this.playerSequence.push(color);
        
        this.timer.reset();
        this.timer.start();
        this.updateTimerDisplay();
        
        // Verificar si el color coincide con la secuencia
        if (this.playerSequence[this.playerSequence.length - 1] !== 
            this.sequence[this.playerSequence.length - 1]) {
            this.handleIncorrectSequence();
            return;
        }
        
        // Verificar si se completó la secuencia
        if (this.playerSequence.length === this.sequence.length) {
            this.handleCorrectSequence();
        }
    }

    handleCorrectSequence() {
        this.score++;
        this.playerSequence = [];
        this.timer.stop();
        
        if (this.round >= 10) {
            this.gameOver(true);
            return;
        }
        
        this.elements.message.textContent = '¡Correcto! Preparando siguiente ronda...';
        
        setTimeout(() => {
            this.round++;
            this.updateUI();
            this.addToSequence();
            this.showSequence();
        }, 1500);
    }
    
    handleIncorrectSequence() {
        this.timer.stop();
        this.elements.message.textContent = 'Secuencia incorrecta. Avanzando a la siguiente ronda...';
    
        setTimeout(() => {
            this.playerSequence = [];
            if (this.round >= 10) {
                this.gameOver(false);
                return;
            }
            this.round++;
            this.updateUI();
            this.addToSequence();
            this.showSequence();
        }, 1000);
    }

    handleTimeOut() {
        this.timer.stop();
        this.elements.message.textContent = '¡Tiempo agotado! Avanzando a la siguiente ronda...';
    
        setTimeout(() => {
            this.playerSequence = [];
            if (this.round >= 10) {
                this.gameOver(false);
                return;
            }
            this.round++;
            this.updateUI();
            this.addToSequence();
            this.showSequence();
        }, 1000);
    }
    
    gameOver(completed) {
        this.isPlaying = false;
        this.timer.stop();
        
        // Resto de la lógica del gameOver...
        this.player.results.sequence = {
            score: this.score,
            completed: completed,
            perfect: completed && this.score === 10
        };
        this.player.totalScore += this.score;
        this.player.saveToLocalStorage();
        
        if (completed) {
            this.elements.message.textContent = `¡Felicidades! Puntuación: ${this.score}`;
        } else {
            this.elements.message.textContent = `Puntuación final: ${this.score}`;
        }
        
        setTimeout(() => {
            window.location.href = GameFlow.nextGame();
        }, 3000);
    }

    updateUI() {
        this.elements.score.textContent = this.score;
        this.elements.round.textContent = `${this.round}/10`;
    }

    updateTimerDisplay() {
        const timerDisplay = setInterval(() => {
            if (!this.timer.timerId) {
                clearInterval(timerDisplay);
                return;
            }
            this.elements.timer.textContent = this.timer.remaining.toFixed(1);
        }, 100);
    }
}
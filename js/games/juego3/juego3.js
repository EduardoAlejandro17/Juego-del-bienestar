import Player from '../../Player.js';
import GameFlow from '../../GameFlow.js';

const player = Player.loadFromLocalStorage() || new Player();

const colors = ['red', 'green', 'blue', 'yellow'];
const colorMap = {
  red: '#FF5252',
  green: '#4CAF50',
  blue: '#2196F3',
  yellow: '#FFD600'
};

let currentColor = '';
let round = 0;
let score = 0;
const totalRounds = 5;

function setBackground(color) {
  document.body.style.backgroundColor = color;
  document.documentElement.style.backgroundColor = color;
}

function startGame() {
  document.getElementById('instructions').classList.add('hidden');
  document.getElementById('playArea').classList.remove('hidden');
  startRound();
}

function startRound() {
  if (round >= totalRounds) {
    endGame();
    return;
  }

  round++;
  const randomKey = colors[Math.floor(Math.random() * colors.length)];
  currentColor = randomKey;
  setBackground(colorMap[randomKey]);

  document.getElementById('title').textContent = `Ronda ${round}: Memoriza el color`;
  document.getElementById('buttons').classList.add('hidden');

  setTimeout(() => {
    setBackground('#fdf6e3'); // arena
    document.getElementById('title').textContent = '';
    document.getElementById('buttons').classList.remove('hidden');
  }, 700);
}

function checkAnswer(color) {
  if (color === currentColor) {
    score++;
  }
  document.getElementById('buttons').classList.add('hidden');
  setTimeout(startRound, 400);
}

function endGame() {
  document.getElementById('title').textContent = 'Juego Terminado';
  document.getElementById('score').textContent = `Puntaje: ${score} de ${totalRounds}`;
  document.getElementById('score').classList.remove('hidden');

  // Guardar resultados
  player.results.colors = {
    score: score,
    completed: true
  };
  player.totalScore += score;
  player.saveToLocalStorage();

  // Redirigir al siguiente juego
  setTimeout(() => {
    window.location.href = GameFlow.nextGame();
  }, 3000);
}

// Mostrar saludo personalizado
const welcomeEl = document.getElementById('welcome-title');
if (welcomeEl && player.name) {
  welcomeEl.textContent = `¡Hola ${player.name}!`; // ✅ Versión neutral
}


window.startGame = startGame;
window.checkAnswer = checkAnswer;

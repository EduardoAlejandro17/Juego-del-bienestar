/**
 * Módulo de Instrucciones del juego Secuencia
 * 
 * Controla la pantalla de instrucciones y prepara la interacción
 * para iniciar el juego. Personaliza el saludo según el género del jugador.
 */
import MouseStrategy from '../../strategies/MouseStrategy.js';
import PhysicalButtonsStrategy from '../../strategies/PhysicalButtonsStrategy.js';
import TouchScreenStrategy from '../../strategies/TouchScreenStrategy.js';
import InteractionManager from '../../InteractionManager.js';
import Player from '../../Player.js';
import GameFlow from '../../GameFlow.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Debug] Instructions.js iniciado');
    
    try {
        // 1. Verificar jugador
        const player = Player.loadFromLocalStorage();
        console.log('[Debug] Jugador:', player);

        if (!player || !player.name) {
            console.log('[Debug] Redirigiendo a registro...');
            redirectToNextStep();
            return;
        }

        // 2. Configurar UI
        setupWelcomeMessage(player);
        const startBtn = setupStartButton();
        
        // 3. Configurar interacción
        await setupInteraction();

        // 4. Habilitar botón
        if (startBtn) {
            enableStartButton(startBtn);
        }

    } catch (error) {
        console.error('[Error] Inicialización:', error);
        redirectToSequenceStart();
    }
});

/**
 * Redirige al siguiente paso en el flujo del juego
 * Si hay un problema, vuelve a la pantalla inicial de secuencia
 */
function redirectToNextStep() {
    const nextStep = GameFlow.nextGame() || '/games/sequence/sequence_start.html';
    console.log('[Debug] Redirigiendo a:', nextStep);
    window.location.replace(nextStep);
}

/**
 * Configura el mensaje de bienvenida personalizado según el género
 * @param {Object} player - Objeto del jugador con nombre y género
 */
function setupWelcomeMessage(player) {
    const greetings = {
        'el': 'Estimado', 'ella': 'Estimada', 'elle': 'Estimade', 'otro': 'Estimadx'
    };
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) {
        welcomeTitle.textContent = `¡${greetings[player.gender] || 'Hola'} ${player.name}!`;
    }
}

/**
 * Configura el botón de inicio y sus eventos
 * @returns {HTMLElement|null} - Referencia al botón o null si no existe
 */
function setupStartButton() {
    const startBtn = document.getElementById('continue-btn');
    if (!startBtn) return null;

    startBtn.style.pointerEvents = 'none';
    startBtn.style.opacity = '0.5';

    startBtn.addEventListener('click', () => {
        console.log('[Debug] Iniciando juego...');
        startBtn.disabled = true;
        startBtn.classList.add('processing');
        
        // Redirección absoluta confiable
        const gamePath = getAbsolutePath('sequence_game.html');
        console.log('[Debug] Ruta del juego:', gamePath);
        
        // Forzar recarga limpia
        window.location.href = gamePath;
    });

    return startBtn;
}

/**
 * Habilita visualmente el botón de inicio después de un breve retraso
 * @param {HTMLElement} btn - Elemento del botón a habilitar
 */
function enableStartButton(btn) {
    setTimeout(() => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
        console.log('[Debug] Botón habilitado');
    }, 500);
}

/**
 * Configura el sistema de interacción con múltiples estrategias
 */
async function setupInteraction() {
    const manager = new InteractionManager();
    
    manager.setStrategyImplementations({
        mouse: new MouseStrategy(handleInteraction),
        touch: new TouchScreenStrategy(handleInteraction),
        physical: new PhysicalButtonsStrategy(handleInteraction)
    });

    const urlParams = new URLSearchParams(window.location.search);
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (urlParams.get('physical') === 'true') {
        await manager.setStrategy('physical');
    } else {
        manager.setStrategy(isTouchDevice ? 'touch' : 'mouse');
    }
}

/**
 * Maneja las interacciones del usuario con los diferentes dispositivos
 * @param {string} action - Tipo de acción recibida
 */
function handleInteraction(action) {
    console.log('[Debug] Interacción:', action);
    if (action === 'continue') {
        const gamePath = getAbsolutePath('sequence_game.html');
        window.location.href = gamePath;
    }
}

/**
 * Obtiene la ruta absoluta a partir de una ruta relativa
 * @param {string} relativePath - Ruta relativa del archivo
 * @returns {string} - Ruta absoluta completa
 */
function getAbsolutePath(relativePath) {
    // Obtener la ruta base del proyecto
    const basePath = window.location.pathname.split('/games/')[0];
    return `${basePath}/games/sequence/${relativePath}`;
}

/**
 * Redirige a la pantalla inicial del juego de secuencia
 */
function redirectToSequenceStart() {
    window.location.replace('/games/sequence/sequence_start.html');
}
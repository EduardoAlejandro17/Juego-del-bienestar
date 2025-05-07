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

// Funciones auxiliares
function redirectToNextStep() {
    const nextStep = GameFlow.nextGame() || '/games/sequence/sequence_start.html';
    console.log('[Debug] Redirigiendo a:', nextStep);
    window.location.replace(nextStep);
}

function setupWelcomeMessage(player) {
    const greetings = {
        'el': 'Estimado', 'ella': 'Estimada', 'elle': 'Estimade', 'otro': 'Estimadx'
    };
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) {
        welcomeTitle.textContent = `¡${greetings[player.gender] || 'Hola'} ${player.name}!`;
    }
}

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

function enableStartButton(btn) {
    setTimeout(() => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
        console.log('[Debug] Botón habilitado');
    }, 500);
}

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

function handleInteraction(action) {
    console.log('[Debug] Interacción:', action);
    if (action === 'continue') {
        const gamePath = getAbsolutePath('sequence_game.html');
        window.location.href = gamePath;
    }
}

function getAbsolutePath(relativePath) {
    // Obtener la ruta base del proyecto
    const basePath = window.location.pathname.split('/games/')[0];
    return `${basePath}/games/sequence/${relativePath}`;
}

function redirectToSequenceStart() {
    window.location.replace('/games/sequence/sequence_start.html');
}
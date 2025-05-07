import MouseStrategy from '../../strategies/MouseStrategy.js';
import PhysicalButtonsStrategy from '../../strategies/PhysicalButtonsStrategy.js';
import TouchScreenStrategy from '../../strategies/TouchScreenStrategy.js';
import InteractionManager from '../../InteractionManager.js';
import Player from '../../Player.js';

document.addEventListener('DOMContentLoaded', async () => {
    const player = Player.loadFromLocalStorage();
    const startBtn = document.getElementById('start-btn');

    console.log("Archivo Instructions.js cargado");

    if (startBtn) {
        console.log("Botón de inicio encontrado");

        // Desactivamos el botón al inicio
        startBtn.style.pointerEvents = 'none';
        startBtn.style.cursor = 'default';

        startBtn.addEventListener('click', () => {
            console.log('Botón de inicio presionado');
            startBtn.classList.add('pressed');
            setTimeout(() => {
                console.log('Redirigiendo a flies_game.html');
                window.location.href = "flies_game.html"; // Redirige a la página de juego
            }, 200);
        });
    }

    if (!player) {
        console.log('No se encontró jugador. Redirigiendo a registration.html');
        window.location.href = "registration.html";
        return;
    }

    const greetings = {
        'el': 'Estimado',
        'ella': 'Estimada',
        'elle': 'Estimade',
        'otro': 'Estimadx'
    };
    
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) {
        welcomeTitle.textContent = `¡${greetings[player.gender] || 'Atención'} ${player.name}!`;
    }

    // Definir el interactionHandler
    const interactionHandler = (action) => {
        console.log("Acción recibida: ", action); 
        // Aquí se maneja la acción de interacción (como clic en botones, etc.)
    };

    // Inicializamos manager con las estrategias
    const manager = new InteractionManager();
    manager.setStrategyImplementations({
        mouse: new MouseStrategy(interactionHandler),
        touch: new TouchScreenStrategy(interactionHandler),
        physical: new PhysicalButtonsStrategy(interactionHandler)
    });

    // Detección de dispositivo mejorada
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const usePhysical = urlParams.get('physical') === 'true';

    if (usePhysical) {
        try {
            console.log("Configurando estrategia para botones físicos...");
            await manager.setStrategy('physical');
        } catch (error) {
            console.error("Error al configurar botones físicos:", error);
            // Fallback a touch/mouse si hay error
            manager.setStrategy(isTouchDevice() ? 'touch' : 'mouse');
        }
    } else {
        manager.setStrategy(isTouchDevice() ? 'touch' : 'mouse');
    }

    // Activamos el botón visualmente
    if (startBtn) {
        startBtn.style.pointerEvents = 'auto';
        startBtn.style.cursor = 'pointer';
    }
});

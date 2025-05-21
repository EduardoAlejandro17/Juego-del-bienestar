/**
 * Módulo de Instrucciones del juego Caza Moscas
 * 
 * Controla la pantalla de inicio/instrucciones del juego.
 * Personaliza el saludo según el género del jugador y configura
 * la interacción con el botón de inicio.
 */
import MouseStrategy from '../../strategies/MouseStrategy.js';
import PhysicalButtonsStrategy from '../../strategies/PhysicalButtonsStrategy.js';
import TouchScreenStrategy from '../../strategies/TouchScreenStrategy.js';
import InteractionManager from '../../InteractionManager.js';
import Player from '../../Player.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Cargamos datos del jugador
    const player = Player.loadFromLocalStorage();
    const startBtn = document.getElementById('start-btn');

    console.log("Archivo Instructions.js cargado");

    if (startBtn) {
        console.log("Botón de inicio encontrado");

        // Desactivamos el botón al inicio hasta configurar interacción
        startBtn.style.pointerEvents = 'none';
        startBtn.style.cursor = 'default';

        // Configuramos evento de clic para navegar al juego
        startBtn.addEventListener('click', () => {
            console.log('Botón de inicio presionado');
            startBtn.classList.add('pressed');
            setTimeout(() => {
                console.log('Redirigiendo a flies_game.html');
                window.location.href = "flies_game.html"; // Redirige a la página de juego
            }, 200);
        });
    }

    // Verificación de sesión activa
    if (!player) {
        console.log('No se encontró jugador. Redirigiendo a registration.html');
        window.location.href = "registration.html";
        return;
    }

    // Personalización del saludo según el género seleccionado
    const greetings = {
        'el': 'Estimado',
        'ella': 'Estimada',
        'elle': 'Estimade',
        'otro': 'Estimadx'
    };
    
    // Actualiza el título con un saludo personalizado
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) {
        welcomeTitle.textContent = `¡${greetings[player.gender] || 'Atención'} ${player.name}!`;
    }

    // Definir el manejador de interacción
    const interactionHandler = (action) => {
        console.log("Acción recibida: ", action); 
        // Aquí se maneja la acción de interacción (como clic en botones, etc.)
    };

    // Configuración del sistema de interacción
    const manager = new InteractionManager();
    manager.setStrategyImplementations({
        mouse: new MouseStrategy(interactionHandler),
        touch: new TouchScreenStrategy(interactionHandler),
        physical: new PhysicalButtonsStrategy(interactionHandler)
    });

    // Detección del tipo de dispositivo para elegir estrategia adecuada
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };

    // Verificar si se debe usar interacción física (Arduino)
    const urlParams = new URLSearchParams(window.location.search);
    const usePhysical = urlParams.get('physical') === 'true';

    // Activar la estrategia adecuada según el dispositivo
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

    // Activamos el botón visualmente una vez configurada la interacción
    if (startBtn) {
        startBtn.style.pointerEvents = 'auto';
        startBtn.style.cursor = 'pointer';
    }
});

/**
 * Clase GameController
 * 
 * Controla la interacción entre la interfaz de usuario y la lógica del juego.
 * Gestiona los eventos, inicializa componentes y configura el sistema de interacción.
 */
import InteractionManager from '../../InteractionManager.js';
import MouseStrategy from '../../strategies/MouseStrategy.js';
import TouchScreenStrategy from '../../strategies/TouchScreenStrategy.js';
import PhysicalButtonsStrategy from '../../strategies/PhysicalButtonsStrategy.js';
import SequenceGame from './SequenceGame.js';

export default class GameController {
    /**
     * Constructor del controlador
     * Inicializa referencias a elementos del DOM y configura el juego
     */
    constructor() {
        // Referencias a elementos del DOM
        this.elements = {
            score: document.getElementById('score'),
            round: document.getElementById('round'),
            timer: document.getElementById('timer'),
            message: document.getElementById('message'),
            startBtn: document.getElementById('startBtn'),
            circles: document.querySelectorAll('.circle')
        };
        
        // Inicializa el juego y la interacción
        this.sequenceGame = new SequenceGame(this.elements);
        this.setupInteractionManager();
        this.setupEventListeners();
    }

    /**
     * Configura el sistema de interacción para diferentes dispositivos
     */
    setupInteractionManager() {
        this.interactionManager = new InteractionManager();
        
        // Función que recibe las interacciones con los colores
        const interactionHandler = (color) => {
            if (!this.sequenceGame.isPlaying || this.sequenceGame.isShowingSequence) return;
            this.sequenceGame.handleColorClick(color);
        };
        
        // Configuración de estrategias de interacción
        this.interactionManager.setStrategyImplementations({
            mouse: new MouseStrategy(interactionHandler),
            touch: new TouchScreenStrategy(interactionHandler),
            physical: new PhysicalButtonsStrategy(interactionHandler)
        });
        
        // Detección automática de la estrategia
        this.setAutoInteractionStrategy();
    }

    /**
     * Detecta y activa la estrategia de interacción más adecuada
     * según el tipo de dispositivo o parámetros de URL
     */
    setAutoInteractionStrategy() {
        const urlParams = new URLSearchParams(window.location.search);
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (urlParams.get('physical') === 'true') {
            this.interactionManager.setStrategy('physical');
        } else {
            this.interactionManager.setStrategy(isTouchDevice ? 'touch' : 'mouse');
        }
    }

    /**
     * Configura los listeners de eventos para interacción directa
     */
    setupEventListeners() {
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => {
                if (!this.sequenceGame.isPlaying) {
                    this.sequenceGame.startGame();
                }
            });
        }
    }
}
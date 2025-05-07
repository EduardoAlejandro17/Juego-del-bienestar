import InteractionManager from '../../InteractionManager.js';
import MouseStrategy from '../../strategies/MouseStrategy.js';
import TouchScreenStrategy from '../../strategies/TouchScreenStrategy.js';
import PhysicalButtonsStrategy from '../../strategies/PhysicalButtonsStrategy.js';
import SequenceGame from './SequenceGame.js';

export default class GameController {
    constructor() {
        this.elements = {
            score: document.getElementById('score'),
            round: document.getElementById('round'),
            timer: document.getElementById('timer'),
            message: document.getElementById('message'),
            startBtn: document.getElementById('startBtn'),
            circles: document.querySelectorAll('.circle')
        };
        
        this.sequenceGame = new SequenceGame(this.elements);
        this.setupInteractionManager();
        this.setupEventListeners();
    }

    setupInteractionManager() {
        this.interactionManager = new InteractionManager();
        
        const interactionHandler = (color) => {
            if (!this.sequenceGame.isPlaying || this.sequenceGame.isShowingSequence) return;
            this.sequenceGame.handleColorClick(color);
        };
        
        this.interactionManager.setStrategyImplementations({
            mouse: new MouseStrategy(interactionHandler),
            touch: new TouchScreenStrategy(interactionHandler),
            physical: new PhysicalButtonsStrategy(interactionHandler)
        });
        
        // Detección automática de la estrategia sin select
        this.setAutoInteractionStrategy();
    }

    setAutoInteractionStrategy() {
        const urlParams = new URLSearchParams(window.location.search);
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (urlParams.get('physical') === 'true') {
            this.interactionManager.setStrategy('physical');
        } else {
            this.interactionManager.setStrategy(isTouchDevice ? 'touch' : 'mouse');
        }
    }

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
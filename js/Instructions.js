import InteractionManager from './InteractionManager.js';
import PhysicalButtonsStrategy from './strategies/PhysicalButtonsStrategy.js';
import TouchScreenStrategy from './strategies/TouchScreenStrategy.js';
import MouseStrategy from './strategies/MouseStrategy.js';

document.addEventListener('DOMContentLoaded', () => {
    const continueBtn = document.getElementById('continue-btn');
    
    // Función robusta de redirección
    const handleContinue = () => {
        // Evitar múltiples ejecuciones
        if (continueBtn.classList.contains('processing')) return;
        
        continueBtn.classList.add('processing', 'pressed');
        
        // Redirección con fallback
        const redirect = () => {
            const baseUrl = window.location.href.replace(/\/[^/]*$/, '');
            window.location.href = `${baseUrl}/registration.html`;
        };
        
        setTimeout(redirect, 200);
        
        // Fallback si no redirige
        setTimeout(() => {
            if (window.location.href.includes('instructions')) {
                window.location.href = '/registration.html';
            }
        }, 1000);
    };

    // Configuración del InteractionManager
    const interactionManager = new InteractionManager();
    
    // Estrategia física solo para botón verde (2)
    class InstructionsPhysicalStrategy extends PhysicalButtonsStrategy {
        constructor() {
            super((buttonId) => {
                if (buttonId === '2') { // Solo botón verde
                    handleContinue();
                }
            });
        }
    }

    interactionManager.setStrategyImplementations({
        PHYSICAL_BUTTONS: new InstructionsPhysicalStrategy(),
        TOUCH_SCREEN: new TouchScreenStrategy(handleContinue),
        MOUSE: new MouseStrategy(handleContinue)
    });

    // Evento click para mouse
    continueBtn.addEventListener('click', handleContinue);

    // Detección automática de dispositivo
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    };

    interactionManager.setStrategy(
        isTouchDevice() ? 'TOUCH_SCREEN' : 'MOUSE'
    );
});
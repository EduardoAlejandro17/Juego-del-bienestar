/**
 * Módulo de Instrucciones
 * Maneja la pantalla de instrucciones y la navegación a la pantalla de registro
 */
import InteractionManager from './InteractionManager.js';
import PhysicalButtonsStrategy from './strategies/PhysicalButtonsStrategy.js';
import TouchScreenStrategy from './strategies/TouchScreenStrategy.js';
import MouseStrategy from './strategies/MouseStrategy.js';

document.addEventListener('DOMContentLoaded', () => {
    const continueBtn = document.getElementById('continue-btn');
    
    /**
     * Función robusta de redirección que maneja la navegación
     * a la siguiente pantalla con sistema de respaldo
     */
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
    
    /**
     * Estrategia personalizada para botones físicos
     * Solo responde al botón verde (número 2)
     */
    class InstructionsPhysicalStrategy extends PhysicalButtonsStrategy {
        constructor() {
            super((buttonId) => {
                if (buttonId === '2') { // Solo botón verde
                    handleContinue();
                }
            });
        }
    }

    // Configuración de estrategias de interacción
    interactionManager.setStrategyImplementations({
        PHYSICAL_BUTTONS: new InstructionsPhysicalStrategy(),
        TOUCH_SCREEN: new TouchScreenStrategy(handleContinue),
        MOUSE: new MouseStrategy(handleContinue)
    });

    // Evento click para mouse
    continueBtn.addEventListener('click', handleContinue);

    /**
     * Detecta si se está usando un dispositivo táctil
     */
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    };

    // Activar estrategia según el tipo de dispositivo
    interactionManager.setStrategy(
        isTouchDevice() ? 'TOUCH_SCREEN' : 'MOUSE'
    );
});
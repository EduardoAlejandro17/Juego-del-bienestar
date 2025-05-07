import InteractionManager from './InteractionManager.js';
import PhysicalButtonsStrategy from './strategies/PhysicalButtonsStrategy.js';
import TouchScreenStrategy from './strategies/TouchScreenStrategy.js';
import MouseStrategy from './strategies/MouseStrategy.js';

document.addEventListener('DOMContentLoaded', () => {
    // Función de redirección robusta
    const redirect = () => {
        const baseUrl = window.location.href.replace(/\/[^/]*$/, '');
        const redirectUrl = `${baseUrl}/instructions.html`;
        
        console.log('Redirigiendo a:', redirectUrl);
        window.location.assign(redirectUrl);
        
        // Fallback después de 1 segundo
        setTimeout(() => {
            if (window.location.href !== redirectUrl) {
                window.location.href = redirectUrl;
            }
        }, 1000);
    };

    // Manejador de interacción
    const handleInteraction = (color) => {
        console.log('Interacción con:', color);
        const circle = document.querySelector(`.${color}`);
        if (circle) {
            circle.classList.add('active');
            setTimeout(redirect, 200);
            setTimeout(() => circle.classList.remove('active'), 500);
        }
    };

    // Configuración del gestor de interacciones
    const interactionManager = new InteractionManager();
    
    interactionManager.setStrategyImplementations({
        PHYSICAL_BUTTONS: new PhysicalButtonsStrategy(handleInteraction),
        TOUCH_SCREEN: new TouchScreenStrategy(handleInteraction),
        MOUSE: new MouseStrategy(handleInteraction)
    });

    // Detección automática del dispositivo
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };

    interactionManager.setStrategy(
        isTouchDevice() ? 'TOUCH_SCREEN' : 'MOUSE'
    );

    // Para depuración
    window.debugRedirect = redirect;
    console.log('Aplicación iniciada. Modo actual:', isTouchDevice() ? 'Táctil' : 'Mouse');
});
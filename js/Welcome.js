/**
 * Módulo de Bienvenida
 * 
 * Gestiona la pantalla de bienvenida y la interacción inicial del usuario.
 * Configura los diferentes métodos de interacción y maneja la redirección
 * a la siguiente pantalla.
 */
import InteractionManager from './InteractionManager.js';
import PhysicalButtonsStrategy from './strategies/PhysicalButtonsStrategy.js';
import TouchScreenStrategy from './strategies/TouchScreenStrategy.js';
import MouseStrategy from './strategies/MouseStrategy.js';

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Función que redirige a la página de instrucciones
     * Incluye un mecanismo de respaldo para asegurar la navegación
     */
    const redirect = () => {
        const baseUrl = window.location.href.replace(/\/[^/]*$/, '');
        const redirectUrl = `${baseUrl}/instructions.html`;
        
        console.log('Redirigiendo a:', redirectUrl);
        window.location.assign(redirectUrl);
        
        // Fallback después de 1 segundo por si falla la redirección principal
        setTimeout(() => {
            if (window.location.href !== redirectUrl) {
                window.location.href = redirectUrl;
            }
        }, 1000);
    };

    /**
     * Procesa las interacciones del usuario (clic, toque, etc.)
     * Añade un efecto visual y redirige a la siguiente pantalla
     * @param {string} color - Color del elemento activado
     */
    const handleInteraction = (color) => {
        console.log('Interacción con:', color);
        const circle = document.querySelector(`.${color}`);
        if (circle) {
            // Añade animación visual al círculo activado
            circle.classList.add('active');
            // Programa la redirección
            setTimeout(redirect, 200);
            // Limpia la animación
            setTimeout(() => circle.classList.remove('active'), 500);
        }
    };

    // Configuración del sistema de interacción
    const interactionManager = new InteractionManager();
    
    // Registro de las diferentes estrategias de interacción
    interactionManager.setStrategyImplementations({
        MOUSE: new MouseStrategy(handleInteraction),
        TOUCH_SCREEN: new TouchScreenStrategy(handleInteraction),
        PHYSICAL_BUTTONS: new PhysicalButtonsStrategy(handleInteraction)
    });

    /**
     * Detecta si el dispositivo tiene capacidades táctiles
     * @returns {boolean} True si es un dispositivo táctil
     */
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };

    // Activar la estrategia apropiada según el tipo de dispositivo
    interactionManager.setStrategy(
        isTouchDevice() ? 'TOUCH_SCREEN' : 'MOUSE'
    );

    // Variables de depuración
    window.debugRedirect = redirect;
    console.log('Aplicación iniciada. Modo actual:', isTouchDevice() ? 'Táctil' : 'Mouse');
});
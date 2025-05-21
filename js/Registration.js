/**
 * Módulo de Registro
 * Gestiona el formulario de registro del jugador y la navegación al primer juego
 */
import MouseStrategy from './strategies/MouseStrategy.js';
import TouchScreenStrategy from './strategies/TouchScreenStrategy.js';
import PhysicalButtonsStrategy from './strategies/PhysicalButtonsStrategy.js';
import InteractionManager from './InteractionManager.js';
import Player from './Player.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de variables y elementos
    const player = new Player();
    const nameInput = document.getElementById('name');
    const startBtn = document.getElementById('start-btn');
    const genderButtons = document.querySelectorAll('.color-btn');

    if (!startBtn || genderButtons.length === 0) {
        console.error('Faltan los elementos necesarios en el HTML');
        return;
    }

    const interactionManager = new InteractionManager();

    let selectedGender = null;
    let physicalButtonState = { red: false, green: false, yellow: false, blue: false };

    /**
     * Valida el formulario y habilita/deshabilita el botón de inicio
     */
    function validateForm() {
        const isValid = player.name && selectedGender;
        startBtn.disabled = !isValid;
    }

    // Evento de entrada de texto para el nombre
    nameInput.addEventListener('input', () => {
        player.name = nameInput.value.trim();
        console.log(`[DEBUG] Nombre ingresado: "${player.name}"`);
        validateForm();
    });

    /**
     * Selecciona el pronombre según el color del botón presionado
     */
    function selectGender(color) {
        if (selectedGender) return;
    
        const selectedButton = Array.from(genderButtons).find(button => button.classList.contains(color));
        if (!selectedButton) return;
    
        selectedGender = selectedButton.dataset.gender;
        player.gender = selectedGender;
    
        console.log(`[DEBUG] Pronombre seleccionado: "${selectedGender}"`);
    
        genderButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('selected');
        });
    
        selectedButton.classList.add('selected');
    
        validateForm();
    }    
    
    /**
     * Maneja la interacción con botones físicos externos
     */
    function handlePhysicalInteraction(color, pressed) {
        physicalButtonState[color] = pressed;

        console.log(`[DEBUG] Botón físico "${color}" está ${pressed ? "PRESIONADO" : "LIBERADO"}`);

        if (Object.values(physicalButtonState).every(state => state)) {
            console.log("[DEBUG] Todos los botones físicos están presionados. Intentando continuar...");
            if (!startBtn.disabled) {
                startBtn.click();
            } else {
                console.log("[DEBUG] No se puede continuar. El formulario está incompleto.");
            }
        }
    }

    /**
     * Procesa cualquier interacción (mouse, touch) con el sistema
     */
    function handleInteraction(color) {
        if (!selectedGender) {
            selectGender(color);
        }
    }

    // Configuración del sistema de interacción
    interactionManager.setStrategyImplementations({
        mouse: new MouseStrategy(handleInteraction),
        touch: new TouchScreenStrategy(handleInteraction),
        physical: new PhysicalButtonsStrategy(handlePhysicalInteraction)
    });

    // Eventos para botones de selección de pronombres
    genderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.classList[1]; // segundo classList es el color
            selectGender(color);
        });
    });

    // Evento para el botón de iniciar
    startBtn.addEventListener('click', () => {
        if (!player.name || !selectedGender) {
            console.log("[DEBUG] Intento de continuar sin llenar el formulario.");
            return;
        }

        startBtn.disabled = true;
        console.log("[DEBUG] Iniciando...");

        setTimeout(() => {
            player.saveToLocalStorage();
            window.location.href = "/games/flies/flies_start.html";
        }, 1000);
    });
});

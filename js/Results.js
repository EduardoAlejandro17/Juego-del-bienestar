/**
 * Manejador de resultados finales del juego
 * Controla la visualización de resultados y las acciones del usuario
 */
import Player from "./Player.js";
import InteractionManager from "./InteractionManager.js";
import MouseStrategy from "./strategies/MouseStrategy.js";
import TouchScreenStrategy from "./strategies/TouchScreenStrategy.js";
import PhysicalButtonsStrategy from "./strategies/PhysicalButtonsStrategy.js";

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar y mostrar datos del jugador
    const player = Player.loadFromLocalStorage();
    if (!player) {
        window.location.href = "/registration.html";
        return;
    }

    // Mostrar información del jugador
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('total-score').textContent = player.totalScore;
    document.getElementById('final-message').textContent = generateFinalMessage(player.totalScore);

    // Mostrar resultados de cada juego
    showGameResult('flies', player.results.flies);
    showGameResult('sequence', player.results.sequence);
    showGameResult('colors', player.results.colors);

    // 2. Configurar sistema de interacción
    const interactionManager = new InteractionManager();
    const backBtn = document.getElementById('back-btn');
    const shareBtn = document.getElementById('share-btn');

    // Handler de interacción mejorado
    const interactionHandler = (inputType) => {
        if (!backBtn || !shareBtn) return;

        if (inputType === 'red' || inputType === '1') {
            handleButtonInteraction(backBtn, () => {
                window.location.href = "/registration.html";
            });
        } 
        else if (inputType === 'blue' || inputType === '4') {
            handleButtonInteraction(shareBtn, () => {
                captureAndShareResults();
            });
        }
    };

    // Función auxiliar para manejar interacciones
    const handleButtonInteraction = (button, action) => {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
            action();
        }, 200);
    };

    // 3. Configurar e iniciar estrategias
    interactionManager.setStrategyImplementations({
        mouse: new MouseStrategy(interactionHandler),
        touch: new TouchScreenStrategy(interactionHandler),
        physical: new PhysicalButtonsStrategy(interactionHandler)
    });

    // Activar estrategia según dispositivo
    const activeStrategy = ('ontouchstart' in window) ? 'touch' : 'mouse';
    interactionManager.setStrategy(activeStrategy);

    // 4. Habilitar interacción directa como fallback
    if (backBtn && shareBtn) {
        backBtn.onclick = () => interactionHandler('red');
        shareBtn.onclick = () => interactionHandler('blue');
        backBtn.style.pointerEvents = 'auto';
        shareBtn.style.pointerEvents = 'auto';
    }
});

// ===== Funciones auxiliares ===== //

function showGameResult(game, data) {
    const gameElement = document.getElementById(`${game}-result`);
    if (!data || !gameElement) return;

    const scoreElement = document.getElementById(`${game}-score`);
    const resultElement = document.getElementById(`${game}-correct`);

    if (scoreElement) scoreElement.textContent = data.score || 0;

    if (resultElement) {
        if (data.correct !== undefined) {
            resultElement.textContent = data.correct ? '✅ Acertaste' : '❌ No acertaste';
            resultElement.className = data.correct ? 'correct success' : 'correct error';
        } else {
            resultElement.style.display = 'none';
        }
    }
}

function generateFinalMessage(score) {
    if (score >= 25) return "¡Excelente trabajo! Eres un maestro de la observación.";
    if (score >= 15) return "¡Buen trabajo! Sigue practicando para mejorar.";
    return "¡Sigue intentándolo! La práctica hace al maestro.";
}

async function captureAndShareResults() {
    try {
        const resultsContainer = document.querySelector('.content-box');
        if (!resultsContainer) return;

        const canvas = await html2canvas(resultsContainer, {
            scale: 2,
            logging: false,
            useCORS: true,
            backgroundColor: '#FFF8E1'
        });

        canvas.toBlob(blob => {
            const player = Player.loadFromLocalStorage();
            if (!player) return;

            const fileName = `resultados_${player.name.replace(/\s+/g, '_')}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                navigator.share({
                    title: `Resultados de ${player.name}`,
                    text: `¡Obtuve ${player.totalScore} puntos!`,
                    files: [file]
                }).catch(() => saveImageFallback(canvas, fileName));
            } else {
                saveImageFallback(canvas, fileName);
            }
        }, 'image/png', 1);
    } catch (error) {
        console.error('Error al compartir resultados:', error);
        alert('Error al generar la imagen de resultados');
    }
}

function saveImageFallback(canvas, fileName) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Resultados guardados como imagen. Puedes compartirla desde tu galería.');
}
/**
 * Clase Game
 * 
 * Controla la lógica principal del juego Caza Moscas.
 * Gestiona la creación de objetivos, generación de moscas y finalización del juego.
 */
class Game {
    /**
     * Constructor del juego
     * Inicializa variables de control y configuraciones
     */
    constructor() {
        this.targets = [];                // Array de objetivos
        this.totalFlies = 50;             // Total de moscas a generar
        this.fliesSpawned = 0;            // Contador de moscas generadas
        this.fliesLanded = 0;             // Contador de moscas que han llegado
        this.colors = ['red', 'green', 'yellow', 'blue'];
        this.gameActive = false;          // Estado del juego
        this.lastFlyTime = Date.now();    // Control de tiempo para generación
        this.spawnInterval = (20 * 1000) / this.totalFlies;  // Intervalo entre moscas
        this.startTime = 0;               // Tiempo de inicio del juego
    }

    /**
     * Inicia el juego, crea los objetivos y comienza a generar moscas
     */
    startGame() {
        this.gameActive = true;
        this.startTime = Date.now();
        this.setupTargets();
        this.runFlySpawnLoop();
    }

    /**
     * Bucle principal para la generación de moscas
     * Controla el ritmo de aparición basado en el tiempo
     */
    runFlySpawnLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastFlyTime;

        // Genera una nueva mosca si es tiempo y aún no se ha alcanzado el total
        if (deltaTime >= this.spawnInterval && this.fliesSpawned < this.totalFlies && this.gameActive) {
            // Crea una mosca dirigida a un objetivo aleatorio
            const fly = new Fly(this.targets[Math.floor(Math.random() * 4)], () => {
                this.onFlyLanded(); // Callback cuando la mosca llega
            });
            this.fliesSpawned++;
            this.lastFlyTime = currentTime;
        }

        // Continúa el bucle mientras el juego esté activo y no se hayan generado todas las moscas
        if (this.gameActive && this.fliesSpawned < this.totalFlies) {
            requestAnimationFrame(() => this.runFlySpawnLoop());
        }
    }

    /**
     * Manejador para cuando una mosca llega a su objetivo
     * Verifica si todas las moscas han llegado para finalizar el juego
     */
    onFlyLanded() {
        this.fliesLanded++;
        // Verificar si todas las moscas han llegado
        if (this.fliesLanded >= this.totalFlies) {
            this.endGame();
        }
    }

    /**
     * Finaliza el juego y guarda los resultados
     * Redirige a la pantalla de selección
     */
    endGame() {
        this.gameActive = false;
        
        // Analiza los resultados para determinar ganador
        const counts = this.targets.map(t => t.count);
        const maxCount = Math.max(...counts);
        const sortedTargets = [...this.targets].sort((a, b) => b.count - a.count);
        
        // Guarda los resultados en localStorage para la pantalla final
        localStorage.setItem('gameResults', JSON.stringify({
            targets: sortedTargets.map(t => ({
                id: t.id,
                color: t.color,
                count: t.count,
                position: sortedTargets.findIndex(target => target.id === t.id) + 1
            })),
            winner: {
                id: sortedTargets[0].id,
                color: sortedTargets[0].color,
                count: sortedTargets[0].count,
                isTie: sortedTargets[0].count === sortedTargets[1]?.count
            },
            tiedWinners: sortedTargets.filter(t => t.count === maxCount).map(t => t.id),
            gameDuration: Date.now() - this.startTime
        }));
        
        // Redirige a la pantalla de selección
        setTimeout(() => window.location.href = "flies_final.html", 1000);
    }

    /**
     * Crea los objetivos del juego y los posiciona en la pantalla
     */
    setupTargets() {
        const container = document.getElementById('targets-container');
        container.innerHTML = '';
        this.targets = this.colors.map((color, i) => 
            new Target(i, (i + 1) * 20, 15, color)
        );
    }
}
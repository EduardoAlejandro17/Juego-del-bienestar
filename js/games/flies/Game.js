class Game {
    constructor() {
        this.targets = [];
        this.totalFlies = 50;
        this.fliesSpawned = 0;
        this.fliesLanded = 0; // Contador de moscas que han llegado
        this.colors = ['red', 'green', 'yellow', 'blue'];
        this.gameActive = false;
        this.lastFlyTime = Date.now();
        this.spawnInterval = (20 * 1000) / this.totalFlies;
        
    }

    startGame() {
        this.gameActive = true;
        this.setupTargets();
        this.runFlySpawnLoop();
    }

    runFlySpawnLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastFlyTime;

        if (deltaTime >= this.spawnInterval && this.fliesSpawned < this.totalFlies && this.gameActive) {
            const fly = new Fly(this.targets[Math.floor(Math.random() * 4)], () => {
                this.onFlyLanded(); // Callback cuando la mosca llega
            });
            this.fliesSpawned++;
            this.lastFlyTime = currentTime;
        }

        if (this.gameActive && this.fliesSpawned < this.totalFlies) {
            requestAnimationFrame(() => this.runFlySpawnLoop());
        }
    }

    onFlyLanded() {
        this.fliesLanded++;
        // Verificar si todas las moscas han llegado
        if (this.fliesLanded >= this.totalFlies) {
            this.endGame();
        }
    }

    endGame() {
        this.gameActive = false;
        
        const counts = this.targets.map(t => t.count);
        const maxCount = Math.max(...counts);
        const sortedTargets = [...this.targets].sort((a, b) => b.count - a.count);
        
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
        
        setTimeout(() => window.location.href = "flies_final.html", 1000);
    }

    setupTargets() {
        const container = document.getElementById('targets-container');
        container.innerHTML = '';
        this.targets = this.colors.map((color, i) => 
            new Target(i, (i + 1) * 20, 15, color)
        );
    }
}
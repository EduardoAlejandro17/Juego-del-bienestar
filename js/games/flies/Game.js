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
        
        const maxCount = Math.max(...this.targets.map(t => t.count));
        const winners = this.targets.filter(t => t.count === maxCount);
        const winner = winners[Math.floor(Math.random() * winners.length)];
        
        localStorage.setItem('gameResults', JSON.stringify({
            winner: { 
                id: winner.id, 
                count: winner.count,
                isTie: winners.length > 1
            },
            tiedWinners: winners.length > 1 ? winners.map(w => w.id) : null
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
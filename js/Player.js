export default class Player {
    constructor() {
        this.name = '';
        this.gender = '';
        this.totalScore = 0;
        this.results = {
            flies: null,
            sequence: null,
            colors: null

        };
    }

    // Guarda los datos del jugador en localStorage
    saveToLocalStorage() {
        localStorage.setItem('currentPlayer', JSON.stringify(this));
    }

    // Carga los datos del jugador desde localStorage
    static loadFromLocalStorage() {
        const data = localStorage.getItem('currentPlayer');
        return data ? Object.assign(new Player(), JSON.parse(data)) : null;
    }
}

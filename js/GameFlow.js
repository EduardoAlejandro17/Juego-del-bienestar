import Player from './Player.js';

export default class GameFlow {
    static nextGame() {
        const player = Player.loadFromLocalStorage();
        if (!player) return "../registration.html";
        
        if (!player.results.flies) {
            return "../../games/flies/flies_start.html";
        } else if (!player.results.sequence) {
            return "../../games/sequence/sequence_start.html";
        } else if (!player.results.colors) {
            return "../../games/juego3/juego3.html"
        }else {
            return "../../final_results.html";
        }
    }
}
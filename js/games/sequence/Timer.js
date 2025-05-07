export default class Timer {
    constructor(duration, callback) {
        this.duration = duration;
        this.callback = callback;
        this.remaining = duration;
        this.timerId = null;
        this.startTime = null;
    }

    start() {
        this.startTime = Date.now();
        this.timerId = setInterval(() => {
            const elapsed = (Date.now() - this.startTime) / 1000;
            this.remaining = Math.max(0, this.duration - elapsed);
            
            if (this.remaining <= 0) {
                this.stop();
                this.callback();
            }
        }, 100);
    }

    stop() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    reset() {
        this.stop();
        this.remaining = this.duration;
    }
}
/**
 * Estrategia para interacción con botones físicos
 * Utiliza Web Serial API para recibir señales de dispositivos externos (Arduino)
 */
import InteractionStrategy from './InteractionStrategy.js';

export default class PhysicalButtonsStrategy extends InteractionStrategy {
    constructor(interactionHandler) {
        super(interactionHandler);
        this.port = null;      // Conexión al puerto serial
        this.reader = null;    // Lector de datos del puerto
    }

    /**
     * Inicia la conexión con el dispositivo físico
     */
    async activate() {
        try {
            if (!navigator.serial) {
                throw new Error('Web Serial API no soportada');
            }

            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 9600 });
            this.reader = this.port.readable.getReader();
            this.readData();
        } catch (error) {
            console.error('Error con botones físicos:', error);
        }
    }

    /**
     * Lee continuamente los datos del puerto serial
     */
    async readData() {
        try {
            while (true) {
                const { value, done } = await this.reader.read();
                if (done) break;
                
                const buttonId = new TextDecoder().decode(value).trim();
                this.processButtonPress(buttonId);
            }
        } catch (error) {
            console.error('Error lectura serial:', error);
            this.deactivate();
        }
    }

    /**
     * Procesa la señal del botón y la convierte en una interacción
     */
    processButtonPress(buttonId) {
        const buttonMap = {
            'B1': 'red',    // Botón 1 en Arduino
            'B2': 'green',  // Botón 2 en Arduino
            'B3': 'yellow', // Botón 3 en Arduino
            'B4': 'blue'    // Botón 4 en Arduino
        };
        
        const color = buttonMap[buttonId];
        if (color) this.interactionHandler(color);
    }

    /**
     * Cierra la conexión y libera recursos
     */
    deactivate() {
        if (this.reader) {
            this.reader.cancel().catch(() => {});
            this.reader.releaseLock();
        }
        if (this.port) {
            this.port.close().catch(() => {});
        }
    }
}
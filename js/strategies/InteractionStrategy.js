export default class InteractionStrategy {
    constructor(interactionHandler) {
      if (new.target === InteractionStrategy) {
        throw new TypeError("Cannot construct Abstract instances directly");
      }
      this.interactionHandler = interactionHandler;
    }
  
    init() {
      throw new Error("Method 'init()' must be implemented");
    }
  
    cleanup() {
      throw new Error("Method 'cleanup()' must be implemented");
    }
  
    getColorFromElement(element) {
      const colors = ['red', 'green', 'yellow', 'blue'];
      for (const color of colors) {
        if (element.classList.contains(color)) {
          return color;
        }
      }
      return null;
    }
  }
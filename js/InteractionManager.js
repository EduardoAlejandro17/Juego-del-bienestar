export default class InteractionManager {
    constructor() {
      this.currentStrategy = null;
      this.strategies = {};
    }
  
    setStrategyImplementations(strategies) {
      this.strategies = strategies;
    }
  
    setStrategy(strategyName) {
      // Limpiar estrategia actual
      if (this.currentStrategy) {
        this.currentStrategy.cleanup();
      }
  
      // Establecer nueva estrategia
      this.currentStrategy = this.strategies[strategyName];
      if (this.currentStrategy) {
        this.currentStrategy.init();
      } else {
        console.error(`Estrategia no encontrada: ${strategyName}`);
      }
    }
  
}
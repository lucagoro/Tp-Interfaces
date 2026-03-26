class TimerController {
  constructor(timerModel, timerView) {
    this.model = timerModel;
    this.view = timerView;
  }

  // Inicia el cronómetro y actualiza la vista cada segundo
iniciar() {
    this.model.iniciarCronometro(
      (minutos, segundos) => {
        this.view.actualizarTiempo(minutos, segundos);
      },
      () => {
        // Este callback se ejecuta cuando se acaba el tiempo
        this.view.mostrarTiempoAgotado("¡Se ha agotado el tiempo!");
      }
    );
  }

  // Detiene el cronómetro
  detener() {
    this.model.detenerCronometro();
  }

  // Resetea el cronómetro y la vista
  resetear() {
    this.model.resetear();
    this.view.resetear();
  }
}

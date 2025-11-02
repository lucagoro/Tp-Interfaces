class TimerController {
  constructor(timerModel, timerView) {
    this.model = timerModel;
    this.view = timerView;
  }

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

  detener() {
    this.model.detenerCronometro();
  }

  resetear() {
    this.model.resetear();
    this.view.resetear();
  }
}

class TimerController {
  constructor(timerModel, timerView) {
    this.model = timerModel;
    this.view = timerView;
  }

  iniciar() {
    this.model.iniciarCronometro((minutos, segundos) => {
      this.view.actualizarTiempo(minutos, segundos);

      // Verificar si se acabó el tiempo
      if (this.model.seAcaboElTiempo()) {
        alert("¡Se acabó el tiempo!");
        // Aquí puedes llamar a alguna función del juego principal
      }
    });
  }

  detener() {
    this.model.detenerCronometro();
  }

  resetear() {
    this.model.resetear();
    this.view.resetear();
  }
}

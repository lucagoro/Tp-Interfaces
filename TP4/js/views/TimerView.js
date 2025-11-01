class TimerView {
  constructor() {
    this.cronometro = document.getElementById("cronometro");
  }

  actualizarTiempo(minutos, segundos) {
    this.cronometro.textContent = `${minutos
      .toString()
      .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
  }

  resetear() {
    this.cronometro.textContent = "00:00";
  }
}

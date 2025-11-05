class TimerView {
  constructor() {
    this.cronometro = document.getElementById("cronometro");
  }

  // Actualiza el tiempo mostrado en la vista - toString().padStart(2, "0") para formato 00:00
  actualizarTiempo(minutos, segundos) {
    this.cronometro.textContent = `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
  }

  // Resetea la vista del cronómetro al estado inicial
  resetear() {
    this.cronometro.textContent = "10:00";
  }

  // Muestra un mensaje cuando se agota el tiempo
  mostrarTiempoAgotado(mensaje) {
    const mensajeElemento = document.querySelector(".msj");
    mensajeElemento.textContent = mensaje;
    mensajeElemento.classList.remove("hidden");
  }
}

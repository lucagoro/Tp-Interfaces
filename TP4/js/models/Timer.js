class Timer {
  constructor() {
    this.tiempoLimite = 600; // 10 minutos en segundos
    this.tiempoRestante = 600; // Tiempo que QUEDA (empieza en 600)
    this.intervalo = null;
    this.sinTiempo = false;
  }

  iniciarCronometro(callback, onTimeOut) {
    this.tiempoRestante = this.tiempoLimite; // Resetear al límite
    this.sinTiempo = false;

    this.intervalo = setInterval(() => {
      this.tiempoRestante--; // Restar 1 segundo

      // Calcular minutos y segundos del tiempo RESTANTE
      const minutos = Math.floor(this.tiempoRestante / 60);
      const segundos = this.tiempoRestante % 60;

      // Actualizar la vista
      if (callback) {
        callback(minutos, segundos);
      }

      // Si se acabó el tiempo (llegó a 0)
      if (this.tiempoRestante <= 0) {
        this.sinTiempo = true;
        this.detenerCronometro();

        // Llamar al callback de timeout
        if (onTimeOut) {
          onTimeOut();
        }
      }
    }, 1000);
  }

  detenerCronometro() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  resetear() {
    this.detenerCronometro();
    this.tiempoRestante = this.tiempoLimite;
    this.sinTiempo = false;
  }

  getTiempoRestante() {
    return this.tiempoRestante;
  }

  seAcaboElTiempo() {
    return this.sinTiempo;
  }
}

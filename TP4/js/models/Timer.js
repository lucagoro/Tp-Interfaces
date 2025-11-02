class Timer {
  constructor() {
    this.tiempoLimite = 100; // 10 minutos en segundos
    this.tiempoTranscurrido = 0; // Tiempo que ha pasado
    this.intervalo = null;
    this.sinTiempo = false;
  }

iniciarCronometro(callback, onTimeOut) {
    this.tiempoTranscurrido = 0;
    this.sinTiempo = false;

    this.intervalo = setInterval(() => {
      this.tiempoTranscurrido++;

      const minutos = Math.floor(this.tiempoTranscurrido / 60);
      const segundos = this.tiempoTranscurrido % 60;

      // Actualizar la vista
      if (callback) {
        callback(minutos, segundos);
      }

      // Si se acabó el tiempo
      if (this.tiempoTranscurrido >= this.tiempoLimite) {
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
    this.tiempoTranscurrido = 0;
    this.sinTiempo = false;
  }

  getTiempoTranscurrido() {
    return this.tiempoTranscurrido;
  }

  seAcaboElTiempo() {
    return this.sinTiempo;
  }
}

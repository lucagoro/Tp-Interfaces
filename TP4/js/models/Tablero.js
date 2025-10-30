class Tablero {
  filas;
  columnas;
  fichas;

  constructor() {
    this.filas = 7;
    this.columnas = 7;
    this.fichas = this.inicializarFichas();
  }
}

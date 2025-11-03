class Ficha {
  constructor(col, row, tipo, eliminada) {
    this.col = col;
    this.row = row;
    this.tipo = tipo;
    this.eliminada = eliminada;
  }

  // Setea los valores de columna y fila en la matriz
  mover(col, row) {
    this.col = col;
    this.row = row;
  }

  getCol() {
    return this.col;
  }

  getRow() {
    return this.row;
  }

  getTipo() {
    return this.tipo;
  }

  isEliminada() {
    return this.eliminada;
  }

  setEliminada(eliminada) {
    this.eliminada = eliminada;
  }

  setTipo(tipo) {
    this.tipo = tipo;
  }

  setCol(col) {
    this.col = col;
  }

  setRow(row) {
    this.row = row;
  }
  
}

class PegSolitaire {
  constructor() {
    this.tablero = new Tablero();
  }

  getTablero() {
    return this.tablero;
  }

  isValidPosition(row, col) {
    return this.tablero.isValidPosition(row, col);
  }

  hasPeg(row, col) {
    return this.tablero.hasFichaAt(row, col);
  }

  isEmpty(row, col) {
    return this.tablero.isEmptyAt(row, col);
  }

  getFichaAt(row, col) {
    return this.tablero.getFichaAt(row, col);
  }

  getValidMoves(row, col) {
    const ficha = this.tablero.getFichaAt(row, col);
    return this.tablero.getValidMoves(ficha);
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    return this.tablero.makeMove(fromRow, fromCol, toRow, toCol);
  }

  hasAnyValidMoves() {
    return this.tablero.hasAnyValidMoves();
  }

  isVictory() {
    return this.tablero.isVictory();
  }

  getPegCount() {
    return this.tablero.getPegCount();
  }

  reset() {
    this.tablero.reset();
  }
}

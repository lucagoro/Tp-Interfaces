class PegSolitaireView {
  constructor(canvas) {
    this.tableroView = new TableroView();
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.cellSize = 71.4285714;
  }

  rowColToPixels(row, col) {
    return {
      x: col * this.cellSize + this.cellSize / 2,
      y: row * this.cellSize + this.cellSize / 2,
    };
  }

  pixelsToRowCol(x, y) {
    return {
      row: Math.floor(y / this.cellSize),
      col: Math.floor(x / this.cellSize),
    };
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawBoard(model) {
    this.tableroView.draw();
    const tablero = model.getTablero();
    const fichas = tablero.getAllFichas();
    for (const ficha of fichas) {
      const x = this.rowColToPixels(ficha.getRow(), ficha.getCol()).x;
      const y = this.rowColToPixels(ficha.getRow(), ficha.getCol()).y;
      f = new fichaView(x, y);
      f.draw();
    }
  }
}

class PegSolitaireView {
  constructor(canvas, ctx, canvasWidth, canvasHeight) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.cellSize = 71.4285714;
    this.offsetX = 0; // Compensar el desplazamiento horizontal
    this.offsetY = 0; // Compensar el desplazamiento vertical

    this.tableroView = new TableroView(
      "../images/tablero-naruto.jpg",
      this.ctx,
      canvasWidth,
      canvasHeight
    );
    this.readyCallback = null;
    this.fichasViews = [];
    this.fichasCreated = false; // Nueva bandera
    this.bancoImagenes = [
      "../images/fichas/ojo1.png",
      "../images/fichas/ojo2.png",
      "../images/fichas/ojo3.png",
      "../images/fichas/ojo4.png",
    ];
  }

  onReady(callback) {
    if (this.tableroView.imageLoaded) {
      callback();
    } else {
      this.tableroView.onLoad = callback;
    }
  }

  rowColToPixels(row, col) {
    return {
      x: col * this.cellSize + this.cellSize / 2 + this.offsetX,
      y: row * this.cellSize + this.cellSize / 2 + this.offsetY,
    };
  }

  pixelsToRowCol(x, y) {
    return {
      row: Math.floor((y - this.offsetY) / this.cellSize),
      col: Math.floor((x - this.offsetX) / this.cellSize),
    };
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBoard(model) {
    console.log("Dibujando tablero");

    // Solo crear las fichas la primera vez
    if (!this.fichasCreated) {
      const tablero = model.getTablero();
      const fichas = tablero.getAllFichas();

      this.fichasViews = [];
      let fichasCargadas = 0;
      const totalFichas = fichas.length;

      for (const ficha of fichas) {
        const x = this.rowColToPixels(ficha.getRow(), ficha.getCol()).x;
        const y = this.rowColToPixels(ficha.getRow(), ficha.getCol()).y;
        console.log(
          `Creando ficha en row=${ficha.getRow()}, col=${ficha.getCol()}, x=${x}, y=${y}`
        );
        const f = new FichaView(
          x,
          y,
          this.ctx,
          30,
          this.elegirImagenAleatoria()
        );

        this.fichasViews.push(f);

        f.onLoadCallback = () => {
          fichasCargadas++;

          if (fichasCargadas === totalFichas) {
            this.redraw();
          }
        };

        f.draw();
      }

      this.fichasCreated = true;
    } else {
      // Si ya fueron creadas, solo redibujar
      this.redraw();
    }
  }

  // Nuevo método para redibujar sin recrear las fichas
  redraw() {
    this.clear();
    this.tableroView.draw();
    this.fichasViews.forEach((fv) => fv.draw());
  }

  eliminarFichaViewEnPosicion(row, col) {
    const pos = this.rowColToPixels(row, col);
    const index = this.fichasViews.findIndex((fv) => {
      // Comparar con tolerancia de 1 píxel
      return (
        Math.abs(fv.getPosX() - pos.x) < 1 && Math.abs(fv.getPosY() - pos.y) < 1
      );
    });

    if (index > -1) {
      this.fichasViews.splice(index, 1);
      return true;
    } else {
      console.log("no se elimia");
      return false;
    }
  }
  getFichasViews() {
    return this.fichasViews;
  }

  elegirImagenAleatoria() {
    let indiceAleatorio = Math.floor(Math.random() * this.bancoImagenes.length);
    return this.bancoImagenes[indiceAleatorio];
  }
}

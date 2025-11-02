class PegSolitaireView {
  constructor(canvas, ctx, canvasWidth, canvasHeight) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.cellSize = 71.4285714;
    this.offsetX = 0;
    this.offsetY = 0;

    this.tableroView = new TableroView(
      "../images/tablero-naruto.jpg",
      this.ctx,
      canvasWidth,
      canvasHeight
    );
    this.readyCallback = null;
    this.fichasViews = [];
    this.fichasCreated = false;
    this.bancoImagenes = [
      "../images/fichas/ojo1.png",
      "../images/fichas/ojo2.png",
      "../images/fichas/ojo3.png",
      "../images/fichas/ojo4.png",
    ];

    // Para las animaciones de bordes
    this.posicionesResaltadas = [];
    this.anguloRotacion = 0;
    this.animacionActiva = false;
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
      this.redraw();
    }
  }

  redraw() {
    this.clear();
    this.tableroView.draw();
    this.fichasViews.forEach((fv) => fv.draw());

    // Dibujar bordes animados
    this.dibujarBordesAnimados();
  }

  reiniciar(model) {
    this.fichasCreated = false;
    this.limpiarResaltados();
    this.drawBoard(model);
  }

  resaltarPosicion(x, y) {
    // Agregar posición a la lista de resaltados
    this.posicionesResaltadas.push({ x, y });

    // Iniciar animación si no está activa
    if (!this.animacionActiva) {
      this.iniciarAnimacion();
    }
  }

  limpiarResaltados() {
    this.posicionesResaltadas = [];
    this.animacionActiva = false;
  }

  iniciarAnimacion() {
    this.animacionActiva = true;

    const animar = () => {
      if (!this.animacionActiva || this.posicionesResaltadas.length === 0) {
        this.animacionActiva = false;
        return;
      }

      this.anguloRotacion += 2; // Velocidad de rotación
      if (this.anguloRotacion >= 360) {
        this.anguloRotacion = 0;
      }

      this.redraw();
      requestAnimationFrame(animar);
    };

    animar();
  }

  dibujarBordesAnimados() {
    this.ctx.save();

    for (const pos of this.posicionesResaltadas) {
      this.ctx.save();

      // Mover al centro de la celda
      this.ctx.translate(pos.x, pos.y);

      // Rotar
      this.ctx.rotate((this.anguloRotacion * Math.PI) / 180);

      // Dibujar borde cuadrado giratorio
      const tamano = this.cellSize * 0.8;

      // Crear gradiente que rota
      const gradient = this.ctx.createLinearGradient(
        -tamano / 2,
        -tamano / 2,
        tamano / 2,
        tamano / 2
      );
      gradient.addColorStop(0, "rgba(255, 215, 0, 1)");
      gradient.addColorStop(0.5, "rgba(255, 255, 0, 0.8)");
      gradient.addColorStop(1, "rgba(201, 132, 5, 1)");

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 4;
      this.ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
      this.ctx.shadowBlur = 10;

      // Dibujar cuadrado
      this.ctx.beginPath();
      this.ctx.arc(0, 0, tamano / 2, 0, 2 * Math.PI);
      this.ctx.stroke();

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  eliminarFichaViewEnPosicion(row, col) {
    const pos = this.rowColToPixels(row, col);
    const index = this.fichasViews.findIndex((fv) => {
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

  mostrarMensaje(mensaje) {
    const mensajeElemento = document.querySelector(".msj");
    mensajeElemento.textContent = mensaje;
    mensajeElemento.classList.remove("hidden");
  }
}

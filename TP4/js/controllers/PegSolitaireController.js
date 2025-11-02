class PegSolitaireController {
  constructor() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.lastClickedFigure = null;
    this.isMouseDown = false;
    this.model = new PegSolitaire();
    this.view = new PegSolitaireView(
      this.canvas,
      this.ctx,
      this.canvasWidth,
      this.canvasHeight
    );
    this.timerModel = new Timer();
    this.timerView = new TimerView();
    this.timerController = new TimerController(this.timerModel, this.timerView);

    this.gameOver = false;
    this.setupEventListeners();

    this.mouseX = null;
    this.mouseY = null;
    this.fichaPositionx;
    this.fichaPositiony;

    setTimeout(() => this.render(), 100);
  }

  render() {
    this.view.drawBoard(this.model);
  }

  setupEventListeners() {
    this.canvas.addEventListener(
      "mousedown",
      (e) => this.onMouseDown(e),
      false
    );
    this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
    this.canvas.addEventListener(
      "mousemove",
      (e) => this.onMouseMove(e),
      false
    );
  }

  onMouseDown(e) {
    this.isMouseDown = true;

    // Obtener las coordenadas ajustadas
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    this.mouseX = (e.clientX - rect.left) * scaleX;
    this.mouseY = (e.clientY - rect.top) * scaleY;

    if (this.lastClickedFigure != null) {
      this.lastClickedFigure.setResaltado(false);
      this.lastClickedFigure = null;
    }

    let clickFig = this.findClickedFigure(this.mouseX, this.mouseY);
    if (clickFig != null) {
      clickFig.setResaltado(true);
      this.lastClickedFigure = clickFig;
    }
    this.view.redraw();

    // obtenemos la posición original de la ficha
    this.originalFichaX = this.lastClickedFigure.getPosX();
    this.originalFichaY = this.lastClickedFigure.getPosY();

    // Calcular originalRow y originalCol
    const originalRow = this.view.pixelsToRowCol(
      this.originalFichaX,
      this.originalFichaY
    ).row;
    const originalCol = this.view.pixelsToRowCol(
      this.originalFichaX,
      this.originalFichaY
    ).col;

    const ficha = this.obtenerFicha(originalRow, originalCol);
    if (ficha != null) {
      // Obtener movimientos válidos
      const moves = this.obtenerMovimientosValidos(ficha);
      this.view.limpiarResaltados();
      if (moves.length != 0) {
        for (let move of moves) {
          const pos = this.view.rowColToPixels(move.toRow, move.toCol);
          this.view.resaltarPosicion(pos.x, pos.y);
        }
      }
    }
  }

  onMouseUp(e) {
    this.view.limpiarResaltados();
    this.isMouseDown = false;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const originalRow = this.view.pixelsToRowCol(
      this.originalFichaX,
      this.originalFichaY
    ).row;
    const originalCol = this.view.pixelsToRowCol(
      this.originalFichaX,
      this.originalFichaY
    ).col;

    const ficha = this.obtenerFicha(originalRow, originalCol);

    if (ficha != null) {
      // Obtener movimientos válidos
      const moves = this.obtenerMovimientosValidos(ficha);

      if (moves.length > 0) {
        // Obtener dónde se soltó el mouse
        const actualX = (e.clientX - rect.left) * scaleX;
        const actualY = (e.clientY - rect.top) * scaleY;
        const dropPos = this.view.pixelsToRowCol(actualX, actualY);

        // Validar que la posición de destino sea válida
        if (
          !this.model.getTablero().isValidPosition(dropPos.row, dropPos.col)
        ) {
          this.lastClickedFigure.setPosition(
            this.originalFichaX,
            this.originalFichaY
          );
          this.lastClickedFigure = null;
          this.view.redraw();
          return;
        }

        // Buscar si es un movimiento válido
        const validMove = moves.find(
          (m) => m.toRow === dropPos.row && m.toCol === dropPos.col
        );

        if (validMove) {
          this.model
            .getTablero()
            .makeMove(
              originalRow,
              originalCol,
              validMove.toRow,
              validMove.toCol
            );
          this.view.limpiarResaltados();
          // Eliminar la ficha visual del medio
          this.view.eliminarFichaViewEnPosicion(
            validMove.jumpRow,
            validMove.jumpCol
          );

          // Actualizar posición visual de la ficha
          const newPos = this.view.rowColToPixels(
            validMove.toRow,
            validMove.toCol
          );
          this.lastClickedFigure.setPosition(newPos.x, newPos.y);

          // Actualizar posición del modelo
          ficha.mover(validMove.toCol, validMove.toRow);

          // Verificar victoria o derrota
          if (this.model.getTablero().isVictory()) {
            this.view.mostrarMensaje("¡Has ganado!");
            this.timerController.detener();
          } else if (!this.model.getTablero().hasAnyValidMoves()) {
            this.view.mostrarMensaje(
              "No hay más movimientos válidos. Has perdido."
            );
            this.timerController.detener();
          }
        } else {
          // Movimiento no válido - devolver ficha a posición original
          console.log("Movimiento no válido");
          this.lastClickedFigure.setPosition(
            this.originalFichaX,
            this.originalFichaY
          );
        }
      } else {
        // No hay movimientos válidos para esta ficha - devolver a posición original
        console.log("No hay movimientos válidos para esta ficha");
        this.lastClickedFigure.setPosition(
          this.originalFichaX,
          this.originalFichaY
        );
      }

      this.lastClickedFigure = null;
    }

    this.view.redraw();
  }

  onMouseMove(e) {
    if (this.isMouseDown && this.lastClickedFigure != null) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      this.lastClickedFigure.setPosition(mouseX, mouseY);
      this.view.redraw();
    }
  }

  findClickedFigure(x, y) {
    const fichas = this.view.getFichasViews();
    const fichasEncontradas = [];

    for (let i = 0; i < fichas.length; i++) {
      const element = fichas[i];
      if (element.isPointInside(x, y)) {
        fichasEncontradas.push({
          index: i,
          x: element.getPosX(),
          y: element.getPosY(),
        });
      }
    }
    // Devolver la primera
    if (fichasEncontradas.length > 0) {
      const idx = fichasEncontradas[0].index;
      return fichas[idx];
    }
    return null;
  }

  iniciarJuego() {
    this.timerController.resetear();
    this.timerController.iniciar();
  }

  reiniciarJuego() {
    this.model.getTablero().reset();
    this.view.reiniciar(this.model);
    this.timerController.resetear();
    this.timerController.iniciar();
  }

  obtenerFicha(originalRow, originalCol) {
    if (this.lastClickedFigure != null) {
      this.lastClickedFigure.setResaltado(false);

      // Validar que la posición sea válida antes de continuar
      if (!this.model.getTablero().isValidPosition(originalRow, originalCol)) {
        this.lastClickedFigure.setPosition(
          this.originalFichaX,
          this.originalFichaY
        );
        this.lastClickedFigure = null;
        this.view.redraw();
        return null;
      }

      // Obtener la ficha del modelo
      const ficha = this.model
        .getTablero()
        .getFichaAt(originalRow, originalCol);

      if (!ficha) {
        this.lastClickedFigure.setPosition(
          this.originalFichaX,
          this.originalFichaY
        );
        this.lastClickedFigure = null;
        this.view.redraw();
        return null;
      }
      return ficha;
    }
  }

  obtenerMovimientosValidos(ficha) {
    return this.model.getTablero().getValidMoves(ficha);
  }
}

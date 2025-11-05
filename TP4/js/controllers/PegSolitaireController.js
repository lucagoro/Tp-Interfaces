class PegSolitaireController {
  constructor() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.lastClickedFigure = null;
    this.isMouseDown = false;
    this.model = new PegSolitaire();
    this.view = new PegSolitaireView(this.canvas, this.ctx, this.canvasWidth, this.canvasHeight);
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

  // Llama al metodo drawBoard del PegSolitaireView para dibujar el tablero y las fichas
  render() {
    this.view.drawBoard(this.model);
  }

  // Configura los event listeners para el canvas
  setupEventListeners() {
    this.canvas.addEventListener(
      "mousedown",
      (e) => this.onMouseDown(e),
      false
    );

    // mouseup debe estar en document para capturarlo incluso fuera del canvas y que la ficha vuelva a su posición
    document.addEventListener("mouseup", (e) => this.onMouseUp(e));

    this.canvas.addEventListener(
      "mousemove",
      (e) => this.onMouseMove(e),
      false
    );
  }

  // Maneja el evento mousedown (cuando se presiona el mouse)
  onMouseDown(e) {
    this.isMouseDown = true;

    // Obtener las coordenadas ajustadas
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    // Calcular la posición del mouse en el canvas
    this.mouseX = (e.clientX - rect.left) * scaleX;
    this.mouseY = (e.clientY - rect.top) * scaleY;

    // Des-resalta la última ficha clickeada
    if (this.lastClickedFigure != null) {
      this.lastClickedFigure.setResaltado(false);
      this.lastClickedFigure = null;
    }

    // Resalta la ficha clickeada
    let clickFig = this.findClickedFigure(this.mouseX, this.mouseY);
    if (clickFig != null) {
      clickFig.setResaltado(true);
      this.lastClickedFigure = clickFig;
    }
    // Redibujar el canvas con la ficha resaltada
    this.view.redraw();

    // obtenemos la posición (x,y) de la ficha
    this.originalFichaX = this.lastClickedFigure.getPosX();
    this.originalFichaY = this.lastClickedFigure.getPosY();

    // Calcula originalRow y originalCol
    const originalRow = this.view.pixelsToRowCol(this.originalFichaX, this.originalFichaY).row;
    const originalCol = this.view.pixelsToRowCol(this.originalFichaX, this.originalFichaY).col;

    // Obtiene la ficha del modelo
    const ficha = this.obtenerFicha(originalRow, originalCol);
    if (ficha != null) {
      // Obtiene movimientos válidos
      const moves = this.obtenerMovimientosValidos(ficha);
      // Limpia los hints de movimientos anteriores
      this.view.limpiarResaltados();
      // Si hay movimientos válidos, los recorre y resalta las posiciones destino
      if (moves.length > 0) {
        for (let move of moves) {
          const pos = this.view.rowColToPixels(move.toRow, move.toCol);
          clickFig.setResaltado(true);
          this.view.resaltarPosicion(pos.x, pos.y);
        }
      }
    }
  }

  // Maneja el evento mouseup (cuando se suelta el mouse)
  onMouseUp(e) {
    // Limpia los hints de movimientos anteriores
    this.view.limpiarResaltados();
    this.isMouseDown = false;
    // Obtener las coordenadas ajustadas
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    // Obtener dónde se soltó el mouse
    const actualX = (e.clientX - rect.left) * scaleX;
    const actualY = (e.clientY - rect.top) * scaleY;

    //  Verificar si el mouse está fuera del canvas
    if (
      actualX < 0 ||
      actualY < 0 ||
      actualX > this.canvas.width ||
      actualY > this.canvas.height
    ) {
      // Si se soltó fuera del canvas, devolver la ficha a su posición original
      if (this.lastClickedFigure) {
        this.lastClickedFigure.setPosition(
          this.originalFichaX,
          this.originalFichaY
        );
        this.lastClickedFigure = null;
      }
      this.view.redraw();
      return;
    }

    const originalRow = this.view.pixelsToRowCol(this.originalFichaX, this.originalFichaY).row;
    const originalCol = this.view.pixelsToRowCol(this.originalFichaX, this.originalFichaY).col;

    const ficha = this.obtenerFicha(originalRow, originalCol);

    if (ficha != null) {
      // Obtener movimientos válidos
      const moves = this.obtenerMovimientosValidos(ficha);
      // Si hay movimientos válidos
      if (moves.length > 0) {
        // Obtener dónde se soltó el mouse
        const actualX = (e.clientX - rect.left) * scaleX;
        const actualY = (e.clientY - rect.top) * scaleY;
        const dropPos = this.view.pixelsToRowCol(actualX, actualY);

        // Si la posición de destino no es válida, devuelve la ficha a su posición original
        if (!this.model.getTablero().isValidPosition(dropPos.row, dropPos.col)) {
          this.lastClickedFigure.setPosition(this.originalFichaX, this.originalFichaY);
          this.lastClickedFigure = null;
          this.view.redraw();
          return;
        }

        // Por cada movimiento válido, verifica si coincide con la posición de destino
        // find() recorre el array y devuelve el primer elemento que cumple la condición
        const validMove = moves.find((m) => m.toRow === dropPos.row && m.toCol === dropPos.col);

        if (validMove) {
          this.model.getTablero().makeMove(originalRow, originalCol, validMove.toRow, validMove.toCol);
          this.view.limpiarResaltados();
          // Elimina la ficha visual que fue saltada
          this.view.eliminarFichaViewEnPosicion(validMove.jumpRow, validMove.jumpCol);

          // Actualizar posición visual de la ficha
          const newPos = this.view.rowColToPixels(validMove.toRow, validMove.toCol);
          this.lastClickedFigure.setPosition(newPos.x, newPos.y);

          // Actualiza posición del modelo
          ficha.mover(validMove.toCol, validMove.toRow);

          // Verifica victoria o derrota
          if (this.model.getTablero().isVictory()) {
            this.view.mostrarMensaje("¡Has ganado!");
            this.timerController.detener();
          } else if (!this.model.getTablero().hasAnyValidMoves()) {
            this.view.mostrarMensaje("No hay más movimientos válidos. Has perdido.");
            this.timerController.detener();
          }
        } else {
          // Movimiento no válido - devolver ficha a posición original
          this.lastClickedFigure.setPosition(this.originalFichaX, this.originalFichaY);
        }
      } else {
        // No hay movimientos válidos para esta ficha - devolver a posición original
        this.lastClickedFigure.setPosition(this.originalFichaX, this.originalFichaY);
      }

      this.lastClickedFigure = null;
    }
    // Redibujar el canvas
    this.view.redraw();
  }

  // Evento mousemove (cuando se mueve el mouse)
  onMouseMove(e) {
    // Si el mouse está presionado y hay una ficha seleccionada
    if (this.isMouseDown && this.lastClickedFigure != null) {
      // Obtiene las coordenadas ajustadas
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      // Calcula la posición del mouse en el canvas
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      // Actualiza la posición de la ficha al mover el mouse
      this.lastClickedFigure.setPosition(mouseX, mouseY);
      // Redibuja el canvas
      this.view.redraw();
    }
  }

  // Encuentra la ficha clickeada en las coordenadas (x,y)
  findClickedFigure(x, y) {
    // Obtiene todas las fichas de la vista
    const fichas = this.view.getFichasViews();
    const fichasEncontradas = [];

    // Recorre las fichas y verifica si el punto (x,y) está dentro de alguna ficha
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
    // Devuelve la primera ficha encontrada
    if (fichasEncontradas.length > 0) {
      const idx = fichasEncontradas[0].index;
      return fichas[idx];
    }
    return null;
  }

  // Inicia el temporizador del juego
  iniciarJuego() {
    this.timerController.resetear();
    this.timerController.iniciar();
  }

  // Reinicia el temporizador y el juego en el modelo y la vista
  reiniciarJuego() {
    this.model.getTablero().reset();
    this.view.reiniciar(this.model);
    this.timerController.resetear();
    this.timerController.iniciar();
  }

  // Obtiene la ficha del modelo en la posición originalRow, originalCol
  obtenerFicha(originalRow, originalCol) {
    if (this.lastClickedFigure != null) {
      this.lastClickedFigure.setResaltado(false);

      // Validar que la posición sea válida antes de continuar
      if (!this.model.getTablero().isValidPosition(originalRow, originalCol)) {
        this.lastClickedFigure.setPosition(this.originalFichaX, this.originalFichaY);
        this.lastClickedFigure = null;
        this.view.redraw();
        return null;
      }

      // Obtener la ficha del modelo
      const ficha = this.model.getTablero().getFichaAt(originalRow, originalCol);

      // Si no se encuentra la ficha, devolver a posición original
      if (!ficha) {
        this.lastClickedFigure.setPosition(this.originalFichaX, this.originalFichaY);
        this.lastClickedFigure = null;
        this.view.redraw();
        return null;
      }
      return ficha;
    }
  }

  // Obtiene los movimientos válidos para una ficha dada
  obtenerMovimientosValidos(ficha) {
    return this.model.getTablero().getValidMoves(ficha);
  }
}

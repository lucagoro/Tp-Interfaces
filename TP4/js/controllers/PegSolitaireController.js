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
    this.timeLimit = 600;
    this.timeRemaining = this.timeLimit;
    this.timerInterval = null;
    this.gameOver = false;
    this.setupEventListeners();
    this.startTimer();

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

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    console.log("=== CLICK ===");
    console.log("Click en pixel:", mouseX, mouseY);

    if (this.lastClickedFigure != null) {
      this.lastClickedFigure.setResaltado(false);
      this.lastClickedFigure = null;
    }

    let clickFig = this.findClickedFigure(mouseX, mouseY);
    if (clickFig != null) {
      console.log(">>> SELECCIONADA:", clickFig.getPosX(), clickFig.getPosY());
      clickFig.setResaltado(true);
      this.lastClickedFigure = clickFig;
    }
    this.view.redraw();
  }

  onMouseUp(e) {
    this.isMouseDown = false;

    if (this.lastClickedFigure != null) {
      this.lastClickedFigure.setResaltado(false);
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

    console.log("Fichas que detectaron el click:", fichasEncontradas);

    // Devolver la primera
    if (fichasEncontradas.length > 0) {
      const idx = fichasEncontradas[0].index;
      return fichas[idx];
    }
    return null;
  }

  startTimer() {}
}

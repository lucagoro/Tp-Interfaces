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
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    }
    
    onMouseDown(e) {
    this.isMouseDown = true;
    
    console.log("=== CLICK ===");
    console.log("Click en pixel:", e.layerX, e.layerY);
    
    // Ver TODAS las fichas y sus distancias al click
    const fichas = this.view.getFichasViews();
    console.log("Total fichas:", fichas.length);
    
    fichas.forEach((f, index) => {
        const dx = f.getPosX() - e.layerX;
        const dy = f.getPosY() - e.layerY;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        const dentro = f.isPointInside(e.layerX +20, e.layerY + 300);
        
        if (distancia < 100) { // Mostrar solo las cercanas
            console.log(`Ficha ${index}: pos(${f.getPosX()}, ${f.getPosY()}), distancia=${distancia.toFixed(2)}, radio=${f.getRadius()}, dentro=${dentro}`);
        }
    });

    if (this.lastClickedFigure != null) {
        this.lastClickedFigure.setResaltado(false);
        this.lastClickedFigure = null;
    }

    let clickFig = this.findClickedFigure(e.layerX, e.layerY);
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
            this.lastClickedFigure.setPosition(e.layerX, e.layerY);
            this.view.redraw();
        }
    }

    findClickedFigure(x, y) {
    const fichas = this.view.getFichasViews();
    const fichasEncontradas = [];
    
    for(let i = 0; i < fichas.length; i++) {
        const element = fichas[i];
        if(element.isPointInside(x, y)) {
            fichasEncontradas.push({index: i, x: element.getPosX(), y: element.getPosY()});
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

    startTimer() {

    }
}
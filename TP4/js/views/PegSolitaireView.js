class PegSolitaireView {
    constructor(canvas, ctx, canvasWidth, canvasHeight) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cellSize = 71.4285714;
        this.tableroView = new TableroView('../images/tablero-naruto.jpg', this.ctx, canvasWidth, canvasHeight);
        this.readyCallback = null;
    }

    onReady(callback) {
        // Esperar a que la imagen del tablero cargue
        if (this.tableroView.imageLoaded) {
            callback();
        } else {
            this.tableroView.onLoad = callback;
        }
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
    console.log("Dibujando tablero");
    this.tableroView.draw();
    
    const tablero = model.getTablero();
    const fichas = tablero.getAllFichas();
    console.log("Fichas a dibujar:", fichas.length);
    
    let fichasViews = [];
    let fichasCargadas = 0;
    const totalFichas = fichas.length;
    
    for (const ficha of fichas) {
        const x = this.rowColToPixels(ficha.getRow(), ficha.getCol()).x;
        const y = this.rowColToPixels(ficha.getRow(), ficha.getCol()).y;
        const f = new FichaView(x, y, this.ctx, 30, '../images/blocka/naruto-blocka-2 (1).jpg');
        
        // Guardar referencia
        fichasViews.push(f);
        
        // Cuando cargue la imagen, redibujar
        f.onLoadCallback = () => {
            fichasCargadas++;
            console.log(`Ficha ${fichasCargadas}/${totalFichas} cargada`);
            
            // Cuando todas carguen, redibujar todo
            if (fichasCargadas === totalFichas) {
                this.tableroView.draw();
                fichasViews.forEach(fv => fv.draw());
            }
        };
        
        // Dibujar inmediatamente (mostrará placeholder si no está cargada)
        f.draw();
    }
}
}
class PegSolitaireController {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        
        this.model = new PegSolitaire();
        this.view = new PegSolitaireView(this.canvas, this.ctx, this.canvasWidth, this.canvasHeight);
        this.timeLimit = 600;
        this.timeRemaining = this.timeLimit;
        this.timerInterval = null;
        this.gameOver = false;
        this.setupEventListeners();
        this.startTimer();
        
        // Esperar a que las imágenes se carguen antes de renderizar
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
        // Implementar lógica
    }
    
    onMouseUp(e) {
        // Implementar lógica
    }
    
    onMouseMove(e) {
        // Implementar lógica
    }
    
    startTimer() {
        // Implementar lógica del timer
    }

    
}
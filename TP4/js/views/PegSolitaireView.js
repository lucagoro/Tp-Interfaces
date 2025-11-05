class PegSolitaireView {
  constructor(canvas, ctx, canvasWidth, canvasHeight) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.cellSize = 71.4285714; // Tamaño de cada celda en píxeles
    this.offsetX = 0;
    this.offsetY = 0;

    this.tableroView = new TableroView("../images/tablero-naruto-sin-borde.png", this.ctx, canvasWidth, canvasHeight);
    this.readyCallback = null;
    this.fichasViews = [];
    this.fichasCreated = false;
    this.bancoImagenes = [
      "../images/fichas/ojo1.png",
      "../images/fichas/ojo2.png",
      "../images/fichas/ojo3.png",
      "../images/fichas/ojo4.png",
    ];

    // Para las animaciones de hints
    this.posicionesResaltadas = [];
    this.anguloRotacion = 0;
    this.animacionActiva = false;
  }


  // Ejecuta la función que se pasa como parametro cuando el tablero está listo
  onReady(callback) {
    if (this.tableroView.imageLoaded) {
      callback();  // Si ya está cargada, ejecuta el callback ahora
    } else {
      this.tableroView.onLoad = callback; // Si NO está cargada, guarda el callback para ejecutarlo después
    }
  }

  // Convierte fila y columna a coordenadas en píxeles
  rowColToPixels(row, col) {
    return {
      x: col * this.cellSize + this.cellSize / 2 + this.offsetX,
      y: row * this.cellSize + this.cellSize / 2 + this.offsetY,
    };
  }

  // Convierte coordenadas en píxeles a fila y columna
  pixelsToRowCol(x, y) {
    return {
      row: Math.floor((y - this.offsetY) / this.cellSize),
      col: Math.floor((x - this.offsetX) / this.cellSize),
    };
  }

  // Limpia el canvas
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Dibuja el tablero y las fichas basándose en el modelo
  drawBoard(model) {
    if (!this.fichasCreated) {
      const tablero = model.getTablero();
      const fichas = tablero.getAllFichas();

      this.fichasViews = [];
      let fichasCargadas = 0;
      const totalFichas = fichas.length;

      // Recorre todas las fichas del modelo y crea sus vistas
      for (const ficha of fichas) {
        const x = this.rowColToPixels(ficha.getRow(), ficha.getCol()).x;
        const y = this.rowColToPixels(ficha.getRow(), ficha.getCol()).y;
        const f = new FichaView(x, y, this.ctx, 30, this.elegirImagenAleatoria());

        this.fichasViews.push(f);

        // Si la imagen de la ficha se carga, incrementa el contador y redibuja si todas están listas
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
      // Redibuja el tablero y las fichas existentes
      this.redraw();
    }
  }

  // Redibuja todo el canvas
  redraw() {
    this.clear();
    this.tableroView.draw();
    this.fichasViews.forEach((fv) => fv.draw());

    // Dibujar hints animados
    this.dibujarBordesAnimados();
  }

  // Reinicia la vista con todas las fichas nuevas
  reiniciar(model) {
    this.fichasCreated = false;
    this.limpiarResaltados();
    this.drawBoard(model);
  }

  // Resalta una posición para dibujar un hint animado
  resaltarPosicion(x, y) {
    // Agrega posición a la lista de resaltados
    this.posicionesResaltadas.push({ x, y });

    // Inicia animación si no está activa
    if (!this.animacionActiva) {
      this.iniciarAnimacion();
    }
  }

  // Limpia todos los hints resaltados
  limpiarResaltados() {
    this.posicionesResaltadas = [];
    this.animacionActiva = false;
  }

  // Inicia la animación de los hints
  iniciarAnimacion() {
    this.animacionActiva = true;

    const animar = () => {
      // Cada frame verifica si la animación sigue activa
      if (!this.animacionActiva || this.posicionesResaltadas.length === 0) {
        this.animacionActiva = false;
        return;
      }

      this.anguloRotacion += 10; // Velocidad de rotación
      if (this.anguloRotacion >= 360) {
        this.anguloRotacion = 0;
      }

      this.redraw(); // Redibuja
      requestAnimationFrame(animar); // Crea un loop de animación optimizado
    };

    animar(); // Inicia el loop de animación
  }

  // Dibuja los hints con context
  dibujarBordesAnimados() {
    this.ctx.save();

    for (const pos of this.posicionesResaltadas) {
      this.ctx.save();

      // Mover al centro de la celda
      this.ctx.translate(pos.x, pos.y);

      // Rotar
      this.ctx.rotate((this.anguloRotacion * Math.PI) / 180);

      // Definir tamaño del borde
      const tamano = this.cellSize * 0.8;

      // Crear gradiente que rota
      const gradient = this.ctx.createLinearGradient(
        -tamano / 2,
        -tamano / 2,
        tamano / 2,
        tamano / 2
      );
      gradient.addColorStop(0, "rgba(255, 215, 0, 1)");
      gradient.addColorStop(0.5, "rgba(255, 230, 0, 0.8)");
      gradient.addColorStop(1, "rgba(201, 132, 5, 1)");

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 4;
      this.ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
      this.ctx.shadowBlur = 10;

      // Dibujar borde
      this.ctx.beginPath();
      this.ctx.arc(0, 0, tamano / 2, 0, 2 * Math.PI);
      this.ctx.stroke();

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  // Busca y elimina una ficha visual en una posición específica
  eliminarFichaViewEnPosicion(row, col) {
    const pos = this.rowColToPixels(row, col);
    // findIndex() busca el índice de la primera ficha que cumpla la condición
    // Math.abs() para evitar problemas de precisión
    const index = this.fichasViews.findIndex((fv) => {
      return (Math.abs(fv.getPosX() - pos.x) < 1 && Math.abs(fv.getPosY() - pos.y) < 1); // Retorna el indice o -1 si no existe
    });

    if (index > -1) {
      this.fichasViews.splice(index, 1); // Elimina la ficha del array
      return true; // Indica que se eliminó
    } else {
      return false; // No había ficha en esa posición
    }
  }

  // Devuelve todas las fichas visuales
  getFichasViews() {
    return this.fichasViews;
  }

  // Elige una imagen aleatoria del banco de imágenes
  elegirImagenAleatoria() {
    let indiceAleatorio = Math.floor(Math.random() * this.bancoImagenes.length);
    return this.bancoImagenes[indiceAleatorio];
  }

  // Muestra un mensaje en la interfaz
  mostrarMensaje(mensaje) {
    const mensajeElemento = document.querySelector(".msj");
    mensajeElemento.textContent = mensaje;
    mensajeElemento.classList.remove("hidden");
  }
}

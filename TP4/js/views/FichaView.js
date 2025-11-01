class FichaView {
  constructor(posX, posY, context, radius, imageUrl = null) {
    this.posX = posX;
    this.posY = posY;
    this.ctx = context;
    this.radius = radius;
    this.image = null;
    this.imageLoaded = false;
    this.resaltado = false;
    this.resaltadoEstilo = "#ffff00";
    this.onLoadCallback = null; // Agregar callback

    if (imageUrl) {
      this.image = new Image();
      this.image.onload = () => {
        this.imageLoaded = true;
        console.log("Imagen cargada:", imageUrl);
        // Llamar al callback si existe
        if (this.onLoadCallback) {
          this.onLoadCallback();
        }
      };
      this.image.onerror = () => {
        console.error("Error cargando imagen:", imageUrl);
      };
      this.image.src = imageUrl;
    }
  }

  draw() {
    this.ctx.save();

    this.ctx.beginPath();
    this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.clip();

    if (this.image && this.imageLoaded) {
      console.log("Dibujando imagen en ficha");
      let imgSize = this.radius * 2;
      this.ctx.drawImage(
        this.image,
        this.posX - this.radius,
        this.posY - this.radius,
        imgSize,
        imgSize
      );
    } else {
      // Dibujar algo mientras carga (círculo de color)
      console.log("Imagen no cargada, dibujando placeholder");
      this.ctx.fillStyle = "#ff6b6b";
      this.ctx.fillRect(
        this.posX - this.radius,
        this.posY - this.radius,
        this.radius * 2,
        this.radius * 2
      );
    }

    this.ctx.restore();

    // Borde del círculo
    this.ctx.beginPath();
    this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    if (this.resaltado === true) {
      this.ctx.beginPath();
      this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
      this.ctx.strokeStyle = this.resaltadoEstilo;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    this.ctx.closePath();
  }

  getRadius() {
    return this.radius;
  }

  setRadius(radius) {
    this.radius = radius;
  }

  setResaltado(resaltado) {
    this.resaltado = resaltado;
  }

  setResaltadoEstilo(resaltadoEstilo) {
    this.resaltadoEstilo = resaltadoEstilo;
  }

  getPosX() {
    return this.posX;
  }

  getPosY() {
    return this.posY;
  }

  getPosition() {
    return {
      x: this.getPosX(),
      y: this.getPosY(),
    };
  }

  setPosition(x, y) {
    this.posX = x;
    this.posY = y;
  }

  isPointInside(x, y) {
    let _x = this.posX - x;
    let _y = this.posY - y;
    return Math.sqrt(_x * _x + _y * _y) < this.radius;
  }
}

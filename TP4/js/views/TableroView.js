class TableroView {
    constructor(imageUrl = null, context, width, height) {
        this.image = null;
        this.imageLoaded = false;
        this.ctx = context;
        this.width = width;
        this.height = height;

        if (imageUrl) {
            this.image = new Image();
            this.image.onload = () => {
                this.imageLoaded = true;
            };
            this.image.src = imageUrl;
        }
    }

    draw() {
        if (this.image && this.imageLoaded) {
            this.ctx.drawImage(this.image, 0, 0, this.width, this.height);   
        }
    }
}
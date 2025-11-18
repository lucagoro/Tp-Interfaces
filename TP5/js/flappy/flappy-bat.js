const main = document.querySelector(".main");
const bat = document.getElementById("bat");

// Variables de física
let batY = 200;
let velocity = 0;
const gravity = 0.5;
const jumpForce = -10;

let gameStarted = false; // Nueva variable de control

// Cuando haces click en el main (pantalla del juego)
main.addEventListener("click", () => {
    // Si es el primer click, iniciar el juego
    if (!gameStarted) {
        gameStarted = true;
        bat.classList.add("batFlying"); // Activar animación de aleteo
        gameLoop(); // Iniciar el loop
    }
    
    // Aplicar impulso hacia arriba (cada vez que se hace click, velocity se resetea)
    velocity = jumpForce;
});

// Actualiza fisica y movimiento cada frame
function gameLoop() {
    if (!gameStarted) return; // No hacer nada si no empezó
    
    // Aplicar gravedad
    velocity += gravity;
    
    // Actualiza y mantiene la posición del murciélago
    batY += velocity;
    
    // Limitar pantalla (techo y suelo)
    if (batY < -20) batY = -20;
    if (batY > 520) batY = 520;
    
    // Actualiza posición
    bat.style.top = batY + "px";
    
    updatePipes(); 

    // Repetir
    requestAnimationFrame(gameLoop);
}


// Array de tuberías
const pipes = [];
const pipeWidth = 60;
const pipeGap = 180;
let pipeTimer = 0;

// Crear tubería desde la derecha
function createPipe() {
    const minHeight = 100;
    const maxHeight = 400;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    pipes.push({
        x: main.offsetWidth, // Aparece desde el borde derecho
        topHeight: topHeight,
        bottomY: topHeight + pipeGap
    });

    // Tuberia de arriba
    const pipeTop = document.createElement('div');
    pipeTop.className = 'pipe pipe-top';
    pipeTop.style.height = topHeight + 'px';
    pipeTop.style.left = main.offsetWidth + 'px'; // Desde la derecha
    main.appendChild(pipeTop);

    // Tuberia de abajo
    const pipeBottom = document.createElement('div');
    pipeBottom.className = 'pipe pipe-bottom';
    pipeBottom.style.top = topHeight + pipeGap + 'px';
    pipeBottom.style.left = main.offsetWidth + 'px'; // Desde la derecha
    main.appendChild(pipeBottom);

    // Guardas los elementos para moverlos y eliminarlos después
    pipes[pipes.length - 1].elementTop = pipeTop;
    pipes[pipes.length - 1].elementBottom = pipeBottom;
}

// Actualizar tuberías (moverlas)
function updatePipes() {
    // Generar nuevas tuberías desde la derecha
    pipeTimer++;
    if (pipeTimer > 120) { // Cada 120 frames
        createPipe();
        pipeTimer = 0;
    }

    // Mover TODAS las tuberías hacia la izquierda
    pipes.forEach((pipe, index) => {
        pipe.x -= 3;
        pipe.elementTop.style.left = pipe.x + 'px';
        pipe.elementBottom.style.left = pipe.x + 'px';

        // Eliminar cuando salen de pantalla
        if (pipe.x < -pipeWidth) {
            pipe.elementTop.remove(); // Elimina del DOM
            pipe.elementBottom.remove(); // Elimina del DOM
            pipes.splice(index, 1); // Elimina del array
        }
    });
}
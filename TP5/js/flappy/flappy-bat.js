const main = document.querySelector(".main");
const bat = document.getElementById("bat");

// Variables de física
let batY = 200;
let velocity = 0;
const gravity = 0.5;
const jumpForce = -10;

let gameStarted = false; // Nueva variable de control

// Cuando haces click
main.addEventListener("click", () => {
    // Si es el primer click, iniciar el juego
    if (!gameStarted) {
        gameStarted = true;
        bat.classList.add("batFlying"); // Activar animación de aleteo
        gameLoop(); // Iniciar el loop
    }
    
    // Aplicar impulso hacia arriba
    velocity = jumpForce;
});

// Game loop
function gameLoop() {
    if (!gameStarted) return; // No hacer nada si no empezó
    
    // Aplicar gravedad
    velocity += gravity;
    
    // Actualizar posición
    batY += velocity;
    
    // Limitar pantalla
    if (batY < -20) batY = -20;
    if (batY > 520) batY = 520;
    
    // Aplicar posición
    bat.style.top = batY + "px";
    
    updatePipes(); // Agregar esta línea

    // Repetir
    requestAnimationFrame(gameLoop);
}

// Agregar después de tu código del murciélago

// Array de tuberías
const pipes = [];
const pipeWidth = 60;
const pipeGap = 180;
let pipeTimer = 0;



// FUNCIÓN ÚNICA: Crear tubería desde la derecha
function createPipe() {
    const minHeight = 100;
    const maxHeight = 400;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    pipes.push({
        x: main.offsetWidth, // Aparece desde el borde derecho
        topHeight: topHeight,
        bottomY: topHeight + pipeGap
    });

    const pipeTop = document.createElement('div');
    pipeTop.className = 'pipe pipe-top';
    pipeTop.style.height = topHeight + 'px';
    pipeTop.style.left = main.offsetWidth + 'px'; // Desde la derecha
    main.appendChild(pipeTop);

    const pipeBottom = document.createElement('div');
    pipeBottom.className = 'pipe pipe-bottom';
    pipeBottom.style.top = topHeight + pipeGap + 'px';
    pipeBottom.style.left = main.offsetWidth + 'px'; // Desde la derecha
    main.appendChild(pipeBottom);

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
            pipe.elementTop.remove();
            pipe.elementBottom.remove();
            pipes.splice(index, 1);
        }
    });
}
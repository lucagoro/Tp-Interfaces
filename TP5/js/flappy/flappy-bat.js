const main = document.querySelector(".main");
const bat = document.getElementById("bat");


// Variables de física
let batY = 200;
let velocity = 0;
const gravity = 0.4;
const jumpForce = -10;

let gameStarted = false;

// Array de tuberías
const pipes = [];
const pipeWidth = 60;
const pipeGap = 180;
let pipeTimer = 0;

let gameTime = 0;
let crowSpawned = false;
let currentCrow = null; 

const layer1 = document.querySelector('.layer-1');
const layer2 = document.querySelector('.layer-2');
const layer3 = document.querySelector('.layer-3');
const layer4 = document.querySelector('.layer-4');

//variable mensaje
let btnReboot = document.querySelector(".btn-reboot");
let msjText = document.querySelector(".msj-text");
let msj = document.querySelector(".msj");

btnReboot.addEventListener("click", () => {
    reiniciarJuego();             
    msj.classList.add("hidden");
});



// Crear tubería desde la derecha
function createPipe(offsetX = 0) {
    const minHeight = 200;
    const maxHeight = 300;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    pipes.push({
        x: main.offsetWidth + offsetX,
        topHeight: topHeight,
        bottomY: topHeight + pipeGap
    });

    const pipeTop = document.createElement('div');
    pipeTop.className = 'pipe pipe-top';
    pipeTop.style.height = topHeight + 'px';
    pipeTop.style.left = (main.offsetWidth + offsetX) + 'px';
    main.appendChild(pipeTop);

    const pipeBottom = document.createElement('div');
    pipeBottom.className = 'pipe pipe-bottom';
    pipeBottom.style.top = topHeight + pipeGap + 'px';
    pipeBottom.style.height = main.offsetHeight - (topHeight + pipeGap) + 'px';
    pipeBottom.style.left = (main.offsetWidth + offsetX) + 'px';
    main.appendChild(pipeBottom);

    pipes[pipes.length - 1].elementTop = pipeTop;
    pipes[pipes.length - 1].elementBottom = pipeBottom;
}

// Actualizar tuberías
function updatePipes() {
    pipeTimer++;
    if (pipeTimer > 120) {
        createPipe();
        pipeTimer = 0;
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 3;
        pipe.elementTop.style.left = pipe.x + 'px';
        pipe.elementBottom.style.left = pipe.x + 'px';

        if (pipe.x < -pipeWidth) {
            pipe.elementTop.remove();
            pipe.elementBottom.remove();
            pipes.splice(index, 1);
        }
    });
}

// Crear el cuervo
function createCrow() {
    const crow = document.createElement('div');
    crow.id = 'crow';
    crow.className = 'crowFlying';
    crow.style.left = main.offsetWidth + 'px';
    crow.style.top = Math.random() * 300 + 50 + 'px';
    main.appendChild(crow);

    console.log("Cuervo creado en X:", main.offsetWidth);
    
    return crow;
}

// Mover el cuervo
function updateCrow() {
    if (!currentCrow) return;
    
    let crowX = parseInt(currentCrow.style.left);
    crowX -= 4;
    currentCrow.style.left = crowX + 'px';
    
    if (crowX < -60) {
        currentCrow.remove();
        currentCrow = null;
        crowSpawned = false;
    }
}

// Game loop principal
function gameLoop() {
    if (!gameStarted) return;
    
    velocity += gravity;
    batY += velocity;
    
    if (batY < -20) batY = -20;
    if (batY > 520) batY = 520;
    
    bat.style.top = batY + "px";
    
    updatePipes();
    updateCrow(); // Mover cuervo cada frame
    checkCollision();
    
    gameTime++;
    
    // Crear cuervo a los ~1.7 segundos
    if (gameTime === 100 && !crowSpawned) {
        currentCrow = createCrow();
        crowSpawned = true;
    }
    
    requestAnimationFrame(gameLoop);
}

// Crear tuberías iniciales
createPipe(0);
createPipe(-300);
createPipe(-600);   
createPipe(-900);

// Detectar colisiones
function checkCollision() {
    const batCenterX = bat.offsetLeft + 36;
    const batCenterY = batY + 33;
    const batRadius = 18;

    // Colisión con tuberías
    pipes.forEach(pipe => {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + pipeWidth;

        const closestX = Math.max(pipeLeft, Math.min(batCenterX, pipeRight));
        
        const closestYTop = Math.max(0, Math.min(batCenterY, pipe.topHeight));
        const distanceTop = Math.sqrt(
            Math.pow(batCenterX - closestX, 2) + 
            Math.pow(batCenterY - closestYTop, 2)
        );
        
        if (distanceTop < batRadius && batCenterY < pipe.topHeight) {
            gameOver();
        }

        const closestYBottom = Math.max(pipe.bottomY, Math.min(batCenterY, main.offsetHeight));
        const distanceBottom = Math.sqrt(
            Math.pow(batCenterX - closestX, 2) + 
            Math.pow(batCenterY - closestYBottom, 2)
        );
        
        if (distanceBottom < batRadius && batCenterY > pipe.bottomY) {
            gameOver();
        }
    });

    // Colisión con el cuervo
    const crow = document.getElementById('crow');
    if (crow) {
        const batRect = bat.getBoundingClientRect();
        const crowRect = crow.getBoundingClientRect();
        
        const batCenterX = batRect.left + batRect.width / 2;
        const batCenterY = batRect.top + batRect.height / 2;
        const batRadius = 18;
        
        const crowCenterX = crowRect.left + crowRect.width / 2;
        const crowCenterY = crowRect.top + crowRect.height / 2;
        const crowRadius = 20;
        
        const distance = Math.sqrt(
            Math.pow(batCenterX - crowCenterX, 2) +
            Math.pow(batCenterY - crowCenterY, 2)
        );
        
        if (distance < batRadius + crowRadius) {
            console.log("¡COLISIÓN CON CUERVO!");
            gameOver();
        }
    }

    // Colisión con suelo/techo
    if (batY <= 0 || batY >= main.offsetHeight - bat.offsetHeight) {
        gameOver();
    }
}

// Game Over
function gameOver() {
    gameStarted = false;
    
    bat.classList.remove("batFlying");
    bat.classList.add("dead");
        
    fallToDeath();
}

// Caer después de morir
function fallToDeath() {
    velocity += gravity;
    batY += velocity;
    
    const groundLevel = 520;
    
    if (batY >= groundLevel) {
        batY = groundLevel;
        bat.style.top = batY + "px";
        
        setTimeout(() => {
            showMessage("¡Perdiste! Haz clic para reiniciar.");
        }, 100);
        return;
    }
    
    bat.style.top = batY + "px";
    requestAnimationFrame(fallToDeath);
}

// Click para jugar
main.addEventListener("click", () => {
    if (!gameStarted) {
        gameStarted = true;
        bat.classList.add("batFlying");
        gameLoop();
        
        layer1.classList.add('animate-layer-1');
        layer2.classList.add('animate-layer-2');
        layer3.classList.add('animate-layer-3');
        layer4.classList.add('animate-layer-4');
    }
    
    velocity = jumpForce;
});

// Mostrar mensaje
function showMessage(text) {
    msjText.textContent = text;   
    msj.classList.remove("hidden");
}
// Reiniciar juego

function reiniciarJuego() {
    // Resetear variables
    batY = 200;
    velocity = 0;
    gameStarted = false;
    gameTime = 0;
    crowSpawned = false;
    currentCrow = null;
    pipeTimer = 0;

    // Resetear estilos del murciélago
    bat.classList.remove("dead");
    bat.classList.remove("batFlying");
    bat.style.top = batY + "px";

    // Eliminar tuberías existentes
    pipes.forEach(pipe => {
        pipe.elementTop.remove();
        pipe.elementBottom.remove();
    });
    pipes.length = 0;
    // Eliminar cuervo si existe
    const crow = document.getElementById("crow");
    if (crow) crow.remove();

    // Resetear variables del cuervo
    currentCrow = null;
    crowSpawned = false;

    // Crear tuberías iniciales otra vez
    createPipe(0);
    createPipe(-300);
    createPipe(-600);
    createPipe(-900);

    // Ocultar mensaje
    msj.classList.add("hidden");

    // Reiniciar capas (fondos)
    layer1.classList.remove('animate-layer-1');
    layer2.classList.remove('animate-layer-2');
    layer3.classList.remove('animate-layer-3');
    layer4.classList.remove('animate-layer-4');
}

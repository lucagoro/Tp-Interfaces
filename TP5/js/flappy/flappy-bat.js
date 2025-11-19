const main = document.querySelector(".main");
const bat = document.getElementById("bat");

// Variables de física
let batY = 200;
let velocity = 0;
let gravity = 0.4;
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

let coins = [];
let powerUpActive = false;

const layer1 = document.querySelector('.layer-1');
const layer2 = document.querySelector('.layer-2');
const layer3 = document.querySelector('.layer-3');
const layer4 = document.querySelector('.layer-4');


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

    // Crear moneda sobre esta tubería (al azar)
    createCoin(main.offsetWidth + offsetX, topHeight, pipeGap);
}

// Actualizar tuberías
function updatePipes() {
    pipeTimer++;
    if (pipeTimer > 120) {
        createPipe();
        pipeTimer = 0;
    }

    // Usar for hacia atrás para evitar problemas con splice
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= 3;
        pipe.elementTop.style.left = pipe.x + 'px';
        pipe.elementBottom.style.left = pipe.x + 'px';

        if (pipe.x < -pipeWidth) {
            pipe.elementTop.remove();
            pipe.elementBottom.remove();
            pipes.splice(i, 1);
        }
    }
}

// Crear moneda sobre una tubería (llamar desde createPipe)
function createCoin(pipeX, pipeTopHeight, pipeGap) {
    // Aumentar probabilidad para testear
    if (Math.random() > 0.7) return; // 70% de probabilidad
    
    const coin = document.createElement('div');
    coin.classList.add('coin'); // Cambiar a clase "coin"
    coin.classList.add('coinSpinning');
    
    const coinX = pipeX + 15;
    const coinY = pipeTopHeight + pipeGap / 2 - 66;
    
    coin.style.left = coinX + 'px';
    coin.style.top = coinY + 'px';
    
    console.log("Moneda creada en:", coinX, coinY);
    
    main.appendChild(coin);
    
    coins.push({
        element: coin,
        x: coinX,
        y: coinY,
        collected: false
    });
}

// Actualizar monedas (moverlas con las tuberías)
function updateCoins() {
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        coin.x -= 3;
        coin.element.style.left = coin.x + 'px';
        
        if (coin.x < -90) {
            coin.element.remove();
            coins.splice(i, 1);
        }
    }
}

// Detectar colisión con monedas
function checkCoinCollision() {
    const batRect = bat.getBoundingClientRect();
    const batCenterX = batRect.left + batRect.width / 2;
    const batCenterY = batRect.top + batRect.height / 2;
    
    // Usar for hacia atrás como con las tuberías
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        if (coin.collected) continue;
        
        const coinCenterX = coin.x + 51; // 102 / 2
const coinCenterY = coin.y + 86;
        
        const distance = Math.sqrt(
            Math.pow(batCenterX - coinCenterX, 2) +
            Math.pow(batCenterY - coinCenterY, 2)
        );
        
        if (distance < 60) {
            coin.collected = true;
            coin.element.remove();
            coins.splice(i, 1); // ← Eliminar del array también
            applyPowerUp();
        }
    }
}


// Aplicar el power-up (solo una vez)
function applyPowerUp() {
    if (powerUpActive) return; // ← Evitar activación múltiple
    
    powerUpActive = true;
    console.log("¡Power-up activado!");
    
    const originalGravity = gravity;
    gravity = 0.2;
    
    bat.style.filter = 'brightness(1.5)';
    
    setTimeout(() => {
        gravity = originalGravity;
        bat.style.filter = 'none';
        powerUpActive = false; // ← Permitir otro power-up después
        console.log("Power-up terminado");
    }, 3000);
}

function createCrow() {
    const crow = document.createElement('div');
    crow.id = 'crow';
    crow.className = 'crowFlying';
    crow.style.left = main.offsetWidth + 'px';
    crow.style.top = Math.random() * 300 + 50 + 'px';
    main.appendChild(crow);

    console.log("Cuervo creado:");
    console.log("  - Left:", crow.style.left);
    console.log("  - Top:", crow.style.top);
    console.log("  - Elemento:", crow);
    
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
    updateCoins();
    updateCrow();
    checkCollision();
    checkCoinCollision();
    
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
    const batCenterX = batRect.left + batRect.width / 2;
    const batCenterY = batRect.top + batRect.height / 2;
    const batRadius = 18;
    
    const crowX = parseInt(crow.style.left) || 0;
    const crowY = parseInt(crow.style.top) || 0;
    const crowCenterX = crowX + 25;
    const crowCenterY = crowY + 27;
    const crowRadius = 20;
    
    const distance = Math.sqrt(
        Math.pow(batCenterX - crowCenterX, 2) +
        Math.pow(batCenterY - crowCenterY, 2)
    );
    
    if (distance < batRadius + crowRadius) {
        crow.classList.add("dead");
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
    const msj = document.querySelector('.msj');
    msj.textContent = text;
    msj.classList.remove('hidden');
}
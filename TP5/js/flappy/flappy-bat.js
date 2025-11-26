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

// Cuervo
let gameTime = 0;
let crowSpawned = false;
let currentCrow = null; 

// Power-up
let powers = [];
let powerUpActive = false;
let isInvincible = false;

// Guarda el ID del intervalo
let intervaloCronometro = null; 

// Capas parallax
const layer1 = document.querySelector('.layer-1');
const layer2 = document.querySelector('.layer-2');
const layer3 = document.querySelector('.layer-3');
const layer4 = document.querySelector('.layer-4');

// Variable mensaje
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

    // Tuberia de arriba
    const pipeTop = document.createElement('div');
    pipeTop.className = 'pipe pipe-top';
    pipeTop.style.height = topHeight + 'px';
    pipeTop.style.left = (main.offsetWidth + offsetX) + 'px';
    main.appendChild(pipeTop);

    // Tuberia de abajo
    const pipeBottom = document.createElement('div');
    pipeBottom.className = 'pipe pipe-bottom';
    pipeBottom.style.top = topHeight + pipeGap + 'px';
    pipeBottom.style.height = main.offsetHeight - (topHeight + pipeGap) + 'px';
    pipeBottom.style.left = (main.offsetWidth + offsetX) + 'px';
    main.appendChild(pipeBottom);

    pipes[pipes.length - 1].elementTop = pipeTop;
    pipes[pipes.length - 1].elementBottom = pipeBottom;

    // Crear power-up sobre esta tubería (al azar)
    createPower(main.offsetWidth + offsetX, topHeight, pipeGap);
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
function createPower(pipeX, pipeTopHeight, pipeGap) {
    // Aumentar probabilidad para testear
    if (Math.random() > 0.3) return; // 30% de probabilidad
    
    const power = document.createElement('div');
    power.classList.add('power'); // Cambiar a clase "power"
    power.classList.add('powerSpinning');
    
    // Calcular posición centrada sobre la tubería
    const powerX = pipeX - 110;
    const powerY = pipeTopHeight + pipeGap / 2 - 150;
    
    // Asignar posición
    power.style.left = powerX + 'px';
    power.style.top = powerY + 'px';
    
    // Añadir el power-up al DOM
    main.appendChild(power);
    
    // Añadir al array de power-ups
    powers.push({
        element: power,
        x: powerX,
        y: powerY,
        collected: false
    });
}

// Actualizar power-ups (moverlos con las tuberías)
function updatePowers() {
    for (let i = powers.length - 1; i >= 0; i--) {
        const power = powers[i];
        power.x -= 3;
        power.element.style.left = power.x + 'px';
        
        // Si sale de la pantalla, se elimina
        if (power.x < -90) {
            power.element.remove();
            powers.splice(i, 1);
        }
    }
}

// Detectar colisión con power-ups
function checkPowerCollision() {
    // Calcula el centro del murciélago
    const batRect = bat.getBoundingClientRect();
    const batCenterX = batRect.left + batRect.width / 2;
    const batCenterY = batRect.top + batRect.height / 2;
    
    // Usar for hacia atrás como con las tuberías
    for (let i = powers.length - 1; i >= 0; i--) {
        const power = powers[i];
        if (power.collected) continue;
        
        // Centro del power-up
        const powerCenterX = power.x + 125; // 250 / 2
        const powerCenterY = power.y + 175; // 350 / 2
        
        // Calcular distancia entre centros
        const distance = Math.sqrt(
            Math.pow(batCenterX - powerCenterX, 2) +
            Math.pow(batCenterY - powerCenterY, 2)
        );
        
        // Si la distancia es menor a 60, recoge el power-up
        if (distance < 60) {
            power.collected = true;
            power.element.remove();
            powers.splice(i, 1); // Eliminar del array también
            applyPowerUp();
        }
    }
}

// Aplicar el power-up (solo una vez)
function applyPowerUp() {
    if (powerUpActive) return; // Evitar activación múltiple
    
    powerUpActive = true;
    isInvincible = true;

    // Aplicar efecto visual de invencibilidad
    bat.style.filter = "brightness(2) drop-shadow(0 0 10px skyblue)";

    setTimeout(() => {
        isInvincible = false;
        powerUpActive = false; // Permitir otro power-up después
        bat.style.filter = 'none';
    }, 5000);
    
}

// Crear el cuervo
function createCrow() {
    const crow = document.createElement('div');
    crow.id = 'crow';
    crow.className = 'crowFlying';
    crow.style.left = main.offsetWidth + 'px';
    crow.style.top = Math.random() * 300 + 50 + 'px';
    main.appendChild(crow);
    
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
    updatePowers();
    updateCrow();
    checkCollision();
    checkPowerCollision();
    
    gameTime++;
    
    // Crear cuervo a los tantos segundos
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
    if (isInvincible) return; // Ignorar colisiones si es invencible
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

// Perdiste
function gameOver() {
    gameStarted = false;
    detenerCronometro();
    
    bat.classList.remove("batFlying");
    bat.classList.add("dead");

    // Pausar animaciones en vez de removerlas
    layer1.style.animationPlayState = 'paused';
    layer2.style.animationPlayState = 'paused';
    layer3.style.animationPlayState = 'paused';
    layer4.style.animationPlayState = 'paused';

    setTimeout(() => {
            showMessage("¡Perdiste! Haz clic para reiniciar.");
        }, 500);
    
        
    fallToDeath();
}

// Ganaste
function youWin() {
    gameStarted = false;
    detenerCronometro();

    // Pausar animaciones en vez de removerlas
    layer1.style.animationPlayState = 'paused';
    layer2.style.animationPlayState = 'paused';
    layer3.style.animationPlayState = 'paused';
    layer4.style.animationPlayState = 'paused';
    main.style.pointerEvents = 'none'; // Desactivar clics
    
    setTimeout(() => {
        showMessage("¡Felicidades! Has ganado.");
    }, 500);
    
}

// Caer después de morir
function fallToDeath() {
    velocity += gravity;
    batY += velocity;
    
    const groundLevel = 520;
    
    if (batY >= groundLevel) {
        batY = groundLevel;
        bat.style.top = batY + "px";
        
        return;
    }
    
    bat.style.top = batY + "px";
    requestAnimationFrame(fallToDeath);
}

// Click para jugar
main.addEventListener("click", (e) => {
    // Si clickeaste un botón/ícono, no hacer nada
    if (e.target.closest('.iconos')) return; 
    if (e.target.closest('.cerrar-modal')) return;
    if (e.target.closest('.cerrar-modal-app')) return;

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
  isInvincible = false;   
  powerUpActive = false;     

  // Resetear estilos del murciélago
  bat.classList.remove("dead");
  bat.classList.remove("batFlying");
  bat.style.top = batY + "px";
  bat.style.filter = "none";  // quitar efecto visual de power-up

  // Eliminar tuberías existentes
  pipes.forEach(pipe => {
    pipe.elementTop.remove();
    pipe.elementBottom.remove();
  });
  pipes.length = 0;

  // Eliminar cuervo si existe
  const crow = document.getElementById("crow");
  if (crow) crow.remove();

  // Crear tuberías iniciales otra vez
  createPipe(0);
  createPipe(-300);
  createPipe(-600);
  createPipe(-900);

  // Ocultar mensaje
  msj.classList.add("hidden");

  // Reactivar clics del juego (clave tras youWin)
  main.style.pointerEvents = "auto";

  // Reiniciar capas (fondos)
  layer1.style.animationPlayState = 'running';
  layer2.style.animationPlayState = 'running';
  layer3.style.animationPlayState = 'running';
  layer4.style.animationPlayState = 'running';

  // Eliminar monedas/power-ups
  powers.forEach(power => {
    if (power.element) power.element.remove();
  });
  powers.length = 0;

  // Reiniciar cronómetro
  detenerCronometro();
  const cronometro = document.getElementById('cronometro');
  cronometro.textContent = "00:00";
  iniciarCronometro();
  
}

// ============= CRONOMETRO =============
function iniciarCronometro() {
    let segundos = 0;
    let minutos = 0;
    const cronometro = document.getElementById('cronometro');
    
    intervaloCronometro = setInterval(() => { // Guardar el ID
        segundos++;
        if (segundos === 60) {
            minutos++;
            segundos = 0;
        }
        const minutosStr = minutos.toString().padStart(2, '0');
        const segundosStr = segundos.toString().padStart(2, '0');
        cronometro.textContent = `${minutosStr}:${segundosStr}`;

        // Verificar si llegó a 20 segundos
        if (minutos === 0 && segundos === 5) {
            youWin(); 
        }

    }, 1000);

}

function detenerCronometro() {
    if (intervaloCronometro) {
        clearInterval(intervaloCronometro); // Detener el intervalo
        intervaloCronometro = null;
    }
}

// ============= JUGAR =============
let btnJugar = document.querySelector(".btn-jugar");
let firstScreen = document.querySelector(".first-screen");
let background = document.querySelector(".background-dark");
let containerMain = document.querySelector(".main");

btnJugar.addEventListener("click", () => {
    background.classList.add("hidden");
    btnJugar.classList.add("hidden");
    containerMain.classList.remove("dontclick");
    iniciarCronometro();
});



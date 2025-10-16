// ============= CONFIGURACIÓN INICIAL =============

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let image1 = new Image();

const canvasWidth = canvas.width;   
const canvasHeight = canvas.height; 

// Matriz que guarda las rotaciones ACTUALES de cada cuadrante
let rotaciones = [
    [0, 0],
    [0, 0]
];


// Variable global para guardar el ImageData original
let imageDataOriginal = null;

// ============= CARGA DE IMAGEN =============

image1.src = '../images/blocka/naruto-blocka-2 (1).jpg'; 

image1.onload = () => {
    // 1. Dibujar imagen ESCALADA al tamaño completo del canvas
    ctx.drawImage(image1, 0, 0, canvasWidth, canvasHeight);
    
    // 2. Obtener ImageData (datos de píxeles) de toda la imagen escalada
    imageDataOriginal = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    
    // 3. Iniciar el juego
    inicializarJuego();
};

// ============= INICIALIZAR JUEGO =============

function inicializarJuego() {
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            let rotacionAleatoria = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
            rotaciones[row][col] = rotacionAleatoria;
        }
    }
    dibujarTodo();
}

// ============= DIBUJO DEL CANVAS =============

function dibujarTodo() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    let halfWidth = canvasWidth / 2;
    let halfHeight = canvasHeight / 2;
    
    // Dibujamos cada uno de los 4 cuadrantes con su rotación correspondiente
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            dibujarCuadrante(row, col, rotaciones[row][col]);
        }
    }
    
    // Dibujamos las líneas divisorias AL FINAL (para que queden arriba)
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(halfWidth, 0);
    ctx.lineTo(halfWidth, canvasHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, halfHeight);
    ctx.lineTo(canvasWidth, halfHeight);
    ctx.stroke();
}

// ============= DIBUJAR UN CUADRANTE INDIVIDUAL =============

function dibujarCuadrante(row, col, angulo) {
    let halfWidth = canvasWidth / 2;
    let halfHeight = canvasHeight / 2;
    
    // Posición del cuadrante en el canvas
    let x = col * halfWidth;
    let y = row * halfHeight;
    
    // Extraer el ImageData del cuadrante correspondiente
    let cuadranteImageData = ctx.createImageData(halfWidth, halfHeight);
    
    // Copiar los píxeles del cuadrante desde imageDataOriginal
    for (let py = 0; py < halfHeight; py++) {
        for (let px = 0; px < halfWidth; px++) {
            // Posición en la imagen original
            let sourceX = col * halfWidth + px;
            let sourceY = row * halfHeight + py;
            let sourceIndex = (sourceY * canvasWidth + sourceX) * 4;
            
            // Posición en el cuadrante nuevo
            let destIndex = (py * halfWidth + px) * 4;
            
            // Copiar los 4 valores RGBA
            cuadranteImageData.data[destIndex + 0] = imageDataOriginal.data[sourceIndex + 0]; // R
            cuadranteImageData.data[destIndex + 1] = imageDataOriginal.data[sourceIndex + 1]; // G
            cuadranteImageData.data[destIndex + 2] = imageDataOriginal.data[sourceIndex + 2]; // B
            cuadranteImageData.data[destIndex + 3] = imageDataOriginal.data[sourceIndex + 3]; // A
        }
    }
    
    
    // Crear un canvas temporal para rotar el cuadrante
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = halfWidth;
    tempCanvas.height = halfHeight;
    let tempCtx = tempCanvas.getContext('2d');
    
    // Dibujar el ImageData en el canvas temporal
    tempCtx.putImageData(cuadranteImageData, 0, 0);
    
    // Ahora dibujamos el canvas temporal rotado en el canvas principal
    ctx.save();
    ctx.translate(x + halfWidth / 2, y + halfHeight / 2);
    ctx.rotate(angulo * Math.PI / 180);
    // Este if/else es para que el img del cuadrante no sobrepase los límites al rotar 90 o 270 grados
    if (angulo % 180 !== 0) {
  ctx.drawImage(tempCanvas, -halfHeight/2, -halfWidth/2, halfHeight, halfWidth);
} else {
  ctx.drawImage(tempCanvas, -halfWidth/2, -halfHeight/2, halfWidth, halfHeight);
}
    ctx.restore();

    
}

// ============= DETECCIÓN DE CLICKS =============

// Escuchamos cuando el usuario hace click en el canvas
canvas.addEventListener('mousedown', (e) => {
    // Si es el primer click, iniciamos el cronómetro automáticamente
    if (!juegoIniciado) {
        iniciarCronometro();
    }
    
    // Obtenemos la posición del canvas en la página
    let rect = canvas.getBoundingClientRect();
    
    // Calculamos las coordenadas X e Y del click DENTRO del canvas
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Determinamos en qué columna se hizo click (0 = izquierda, 1 = derecha)
    let col = x < canvas.width / 2 ? 0 : 1;
    
    // Determinamos en qué fila se hizo click (0 = arriba, 1 = abajo)
    let row = y < canvas.height / 2 ? 0 : 1;
    
    // e.button indica qué botón del mouse se presionó:
    // 0 = botón izquierdo -> rotamos -90° (izquierda)
    // 2 = botón derecho -> rotamos +90° (derecha)
    if (e.button === 0) {
        rotaciones[row][col] -= 90;  // Rotar a la izquierda
    } else if (e.button === 2) {
        rotaciones[row][col] += 90;  // Rotar a la derecha
    }
    
    // Normalizamos el ángulo para que esté entre 0 y 359
    rotaciones[row][col] = rotaciones[row][col] % 360;
    
    // Si quedó negativo (por restar 90), lo convertimos a positivo
    if (rotaciones[row][col] < 0) rotaciones[row][col] += 360;
    
    // Redibujamos todo el canvas con la nueva rotación
    dibujarTodo();
    
    // Verificamos si el puzzle está completo
    verificarCompletado();
});

// Desactivamos el menú contextual que aparece con click derecho
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Cancela el comportamiento por defecto
});



// ============= CRONOMETRO =============

let intervalo; // Variable para guardar el intervalo del cronómetro

// Bandera que indica si el juego ya comenzó
let juegoIniciado = false;

// Récord guardado en localStorage (memoria del navegador)
// Si no hay récord previo, será null
let recordNivel = localStorage.getItem('recordBlocka') || null;

let btnPlay = document.querySelector('.btn-play-blocka');
let cronometro = document.querySelector('.cronometro');
let record = document.querySelector('.record');

let segundos = 0;
let minutos = 0;

btnPlay.addEventListener('click', () => {
    if (btnPlay.textContent === "Comenzar") {
    iniciarCronometro();
    } else {
        detenerCronometro();
        cronometro.textContent = '00:00';
        iniciarCronometro();
    }
});

// Mostrar el récord al cargar la página (si existe)
if (recordNivel !== null) {
    record.textContent = `Récord actual: ${formatearTiempo(parseInt(recordNivel))}`;
}

function iniciarCronometro() {
    btnPlay.textContent = "Reiniciar";
    juegoIniciado = true;
    segundos = 0;
    minutos = 0;
    intervalo = setInterval(() => {
        segundos++;
        if (segundos === 60) {
            minutos++;
            segundos = 0;
        }
        cronometro.textContent = `${String(minutos.toString().padStart(2, '0'))}:${String(segundos.toString().padStart(2, '0'))}`; // Esta línea hace que siempre se muestren 2 dígitos
    }, 1000);
}

// ============= VERIFICAR COMPLETADO =============
function verificarCompletado() {
    let completado = true;
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            if (rotaciones[row][col] % 360 !== 0) {
                completado = false;
                break;
            }
        }
    }
    if (completado && juegoIniciado) {
        detenerCronometro();
        juegoIniciado = false;
        let tiempoActual = convertirATiempoTotal(minutos, segundos);
        if (recordNivel === null || tiempoActual < parseInt(recordNivel)) {
            recordNivel = tiempoActual;
            localStorage.setItem('recordBlocka', recordNivel);
            record.textContent = `¡Nuevo récord! Completaste el puzzle en ${formatearTiempo(tiempoActual)}`;
        } else {
            record.textContent = `Completado en ${formatearTiempo(tiempoActual)}. Récord actual: ${formatearTiempo(parseInt(recordNivel))}`;
        }
        let btnsLevelEnd = document.querySelector(".level-end");
        btnsLevelEnd.classList.toggle("visible");
    }
}


// ============= DETENER CRONOMETRO =============
function detenerCronometro() {
    clearInterval(intervalo); // Para el cronómetro
}

// Función auxiliar para convertir segundos totales a formato mm:ss
function formatearTiempo(segundosTotales) {
    let mins = Math.floor(segundosTotales / 60);
    let segs = segundosTotales % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

// Función auxiliar para convertir mm:ss a segundos totales
function convertirATiempoTotal(mins, segs) {
    return mins * 60 + segs;
}

// sacar
function resetearRecord() {
    if (confirm('¿Estás seguro de que quieres borrar el récord?')) {
        localStorage.removeItem('recordBlocka');
        recordNivel = null;
        record.textContent = 'Sin récord aún';
        alert('Récord borrado correctamente');
    }
}



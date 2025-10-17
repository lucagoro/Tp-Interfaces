// ============= BANCO DE IMÁGENES =============

const bancoImagenes = [
    '../images/blocka/naruto-blocka-1 (1).jpg',
    '../images/blocka/naruto-blocka-2 (1).jpg',
    '../images/blocka/naruto-blocka-3 (1).jpg',
    '../images/blocka/naruto-blocka-4.jpg',
    '../images/blocka/naruto-blocka-5.jpg',
    '../images/blocka/naruto-blocka-6 (1).jpg',
];

// Función para elegir una imagen aleatoria
function elegirImagenAleatoria() {
    let indiceAleatorio = Math.floor(Math.random() * bancoImagenes.length);
    return bancoImagenes[indiceAleatorio];
}


// ============= SISTEMA DE NIVELES =============

let nivelActual = 1;
const NIVEL_MAXIMO = 4;

// Configuración de filtros por nivel
const filtrosNivel = {
    1: null, // Nivel 1: sin filtro
    2: 'escalaGrises', // Nivel 2: escala de grises
    3: 'brillo', // Nivel 3: brillo 30%
    4: 'negativo' // Nivel 4: negativo
};

// ============= CONFIGURACIÓN INICIAL =============

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d', { willReadFrequently: true });
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
let imageDataSinFiltro = null;


// ============= CARGA INICIAL =============

cargarImagen(); // Llamar al inicio

// ============= FUNCIÓN PARA CARGAR IMAGEN =============

function cargarImagen() {
    let nuevaImagen = elegirImagenAleatoria();
    
    image1.onload = () => {
        
        // 1. Dibujar imagen ESCALADA
        ctx.drawImage(image1, 0, 0, canvasWidth, canvasHeight);
        
        // 2. Obtener ImageData SIN FILTRO
        imageDataSinFiltro = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        
        // 3. Aplicar el filtro según el nivel actual
        let filtroActual = filtrosNivel[nivelActual];
        imageDataOriginal = aplicarFiltro(imageDataSinFiltro, filtroActual);
        
        // 4. Iniciar el juego
        inicializarJuego();
    };
    
    image1.src = nuevaImagen;
}

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


// ============= FUNCIÓN PARA SIGUIENTE NIVEL =============

function siguienteNivel() {
    if (nivelActual < NIVEL_MAXIMO) {
        nivelActual++;
        console.log('Nivel actual después:', nivelActual);
        reiniciarNivel();
    } else {
        alert('🎊 ¡Felicidades! Completaste todos los niveles');
        nivelActual = 1;
        reiniciarNivel();
    }
}

// ============= FUNCIÓN PARA REINICIAR NIVEL =============
function reiniciarNivel() {
    // Ocultar botones de fin de nivel
    let btnsLevelEnd = document.querySelector(".level-end");
    if (btnsLevelEnd.classList.contains("visible")) {
        btnsLevelEnd.classList.remove("visible");
    }
    
    // Resetear cronómetro
    detenerCronometro();
    segundos = 0;
    minutos = 0;
    juegoIniciado = false;
    cronometro.textContent = '00:00';
    btnPlay.textContent = 'Comenzar';
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Cargar nueva imagen
    cargarImagen();
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

        // Mostrar imagen sin filtro cuando se completa
        imageDataOriginal = imageDataSinFiltro;
        dibujarTodo();

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

// ============= APLICAR FILTROS =============
function aplicarFiltro(imageData, tipoFiltro) {
    if (!tipoFiltro) {
        return imageData; // Sin filtro
    }

    // Crear una copia del ImageData para no modificar el original
    let filtrado = ctx.createImageData(imageData.width, imageData.height);

    // Copiar todos los datos
    for (let i = 0; i < imageData.data.length; i++) {
        filtrado.data[i] = imageData.data[i];
    }

    for (let x = 0; x < filtrado.width; x++) {
        for (let y = 0; y < filtrado.height; y++) {
            let r = getRed(filtrado, x, y);
            let g = getGreen(filtrado, x, y);
            let b = getBlue(filtrado, x, y);

            let colorFiltrado;

            switch(tipoFiltro) {
                case 'escalaGrises':
                    colorFiltrado = escalaDeGrises(r, g, b);
                    break;
                case 'brillo':
                    colorFiltrado = aumentarBrillo(r, g, b);
                    break;
                case 'negativo':
                    colorFiltrado = invertirColores(r, g, b);
                    break;
                default:
                    colorFiltrado = { r, g, b };
            }

            // Calcular el índice y actualizar los valores
            let index = (x + y * filtrado.width) * 4;
            filtrado.data[index + 0] = colorFiltrado.r;
            filtrado.data[index + 1] = colorFiltrado.g;
            filtrado.data[index + 2] = colorFiltrado.b;
            // filtrado.data[index + 3] ya tiene el alpha copiado
        }
    }
    return filtrado;
}


// ============= FUNCIONES PARA OBTENER COLORES =============

function getRed(imageData, x, y) {
     let index = (x + y * imageData.width) * 4;
     return imageData.data[index + 0];
}

 function getGreen(imageData, x, y) {
     let index = (x + y * imageData.width) * 4;
     return imageData.data[index + 1];
}

 function getBlue(imageData, x, y) {
     let index = (x + y * imageData.width) * 4;
     return imageData.data[index + 2];
}

// ============= FUNCIONES DE FILTRO =============

function escalaDeGrises(r, g, b) {
    let gray = (r + g + b) / 3;
    return {
        r: gray,
        g: gray,
        b: gray
    };
}

function aumentarBrillo(r, g, b) {
    let incremento = 77; // 30% de 255 ≈ 77
    return {
        r: Math.min(255, r + incremento),
        g: Math.min(255, g + incremento),
        b: Math.min(255, b + incremento)
    };
}

function invertirColores(r, g, b) {
    return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b
    };
}
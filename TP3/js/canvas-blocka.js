// ============= BANCO DE IMÁGENES =============

const bancoImagenes = [
  "../images/blocka/naruto-blocka-1 (1).jpg",
  "../images/blocka/naruto-blocka-2 (1).jpg",
  "../images/blocka/naruto-blocka-3 (1).jpg",
  "../images/blocka/naruto-blocka-4.jpg",
  "../images/blocka/naruto-blocka-5.jpg",
  "../images/blocka/naruto-blocka-6 (1).jpg",
];

// ============= JUGAR =============
let btnJugar = document.getElementById("btn-jugar");
let firstScreen = document.querySelector(".first-screen");
let juegoBlocka = document.querySelector(".juego-blocka");

btnJugar.addEventListener("click", () => {
  firstScreen.classList.add("hidden-screen");     // Oculta la pantalla de inicio
  juegoBlocka.classList.remove("hidden-screen");
  cargarImagen();  // Muestra el juego
});


// Función para elegir una imagen aleatoria
function elegirImagenAleatoria() {
  let indiceAleatorio = Math.floor(Math.random() * bancoImagenes.length);
  return bancoImagenes[indiceAleatorio];
}

// ============= SISTEMA DE NIVELES =============

let nivelActual = 1;
const NIVEL_MAXIMO = 4;

// Configuración de filtros por nivel - Es un objeto literal de js
const filtrosNivel = {
  1: null, // Nivel 1: sin filtro
  2: "escalaGrises", // Nivel 2: escala de grises
  3: "brillo", // Nivel 3: brillo 30%
  4: "negativo", // Nivel 4: negativo
};

// ============= CONFIGURACIÓN CANTIDAD DE BLOQUES =============

let cantidadBloques = 4; // Por defecto 4 bloques (2x2)
let filas = 2;
let columnas = 2;
let rotaciones = [];

function obtenerDistribucion(bloques) {
  switch (bloques) {
    case 4:
      return { filas: 2, columnas: 2 };
    case 6:
      return { filas: 2, columnas: 3 };
    case 8:
      return { filas: 2, columnas: 4 };
    default:
      return { filas: 2, columnas: 2 };
  }
}
// Función para inicializar la matriz de rotaciones según las dimensiones
function inicializarRotaciones() {
  rotaciones = [];
  for (let row = 0; row < filas; row++) {
    rotaciones[row] = []; // Crea un array vacío
    for (let col = 0; col < columnas; col++) {
      rotaciones[row][col] = 0; // Llena cada posición de esa fila
    }
  }
}

function inicializarSelectorBloques() {
  const botones = document.querySelectorAll(".bloque-btn");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const nuevaCantidad = parseInt(btn.dataset.bloques);

      if (nuevaCantidad !== cantidadBloques) {
        cantidadBloques = nuevaCantidad;

        // Actualizar visualmente el botón activo
        botones.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Aplicar configuración
        const dimensiones = obtenerDistribucion(cantidadBloques);
        filas = dimensiones.filas;
        columnas = dimensiones.columnas;
        inicializarRotaciones();
      }
    });
  });
  // Marcar el botón activo al inicio
  const inicial = document.querySelector(`.bloque-btn[data-bloques="${cantidadBloques}"]`);
  if (inicial) inicial.classList.add("active");
}

// Event listener para el select
document.addEventListener("DOMContentLoaded", () => {
   inicializarSelectorBloques();
  });

// ============= CONFIGURACIÓN INICIAL =============

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d", { willReadFrequently: true }); // willReadFrequently: true es una optimización de rendimiento que le dice al navegador cómo vas a usar el canvas.
let image1 = new Image();

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Variable global para guardar el ImageData original
let imageDataOriginal = null;
let imageDataSinFiltro = null;


// ============= FUNCIÓN PARA CARGAR IMAGEN =============

function cargarImagen() {
  
  let blockaContent = document.querySelector(".blocka-content");
  blockaContent.classList.add("hidden");

  //Selecciona el contenedor de thumbnails y el grid donde se mostrarán las imágenes
  const preview = document.querySelector(".preview-imagenes");
  const grid = document.querySelector(".grid-thumbnails");

  //Muestra el contenedor de thumbnails y limpia cualquier contenido anterior
  preview.classList.remove("hidden");
  grid.innerHTML = "";

  let nuevaImagen = elegirImagenAleatoria();

  // Recorre todas las imágenes del banco y las muestra como thumbnails
  bancoImagenes.forEach((src) => {
    // Crea un elemento <img> en HTML
    const img = document.createElement("img");
    // Le asigna la ruta de la img
    img.src = src;
    // Agrega la img al contenedor grid
    grid.appendChild(img);
  });

  // Espera 2 segundos para que el jugador vea todas las imágenes
  setTimeout(() => {
    const imgs = grid.querySelectorAll("img");
    imgs.forEach((img) => {
      const nombreElegido = decodeURIComponent(nuevaImagen.split("/").pop().trim());
      const nombreImg = decodeURIComponent(img.src.split("/").pop().trim());
      if (nombreImg === nombreElegido) {
        img.classList.add("destacada");
      }
    });
  }, 2000);
  setTimeout(() => {
    preview.classList.add("hidden");
  }, 4000);
  setTimeout(() => {
    image1.onload = () => {
      // 1. Dibujar imagen ESCALADA
      ctx.drawImage(image1, 0, 0, canvasWidth, canvasHeight);

      // 2. Obtener ImageData SIN FILTRO
      imageDataSinFiltro = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

      // 3. Aplicar el filtro según el nivel actual
      let filtroActual = filtrosNivel[nivelActual];
      imageDataOriginal = aplicarFiltro(imageDataSinFiltro, filtroActual);
      inicializarRotaciones();
      dibujarTodo();
      // 4. Iniciar el juego
      inicializarJuego();
    };

    image1.src = nuevaImagen;
  }, 4200);
}

// ============= INICIALIZAR JUEGO =============

function inicializarJuego() {
  let blockaContent = document.querySelector(".blocka-content");
  blockaContent.classList.remove("hidden");
  for (let row = 0; row < filas; row++) {
    for (let col = 0; col < columnas; col++) {
      let rotacionAleatoria = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
      rotaciones[row][col] = rotacionAleatoria;
    }
  }
  dibujarTodo();
}

// ============= DIBUJO DEL CANVAS =============

function dibujarTodo() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  let { filas: f, columnas: c } = obtenerDistribucion(cantidadBloques);
  let anchoBloque = Math.floor(canvasWidth / c);
  let altoBloque = Math.floor(canvasHeight / f);
  // Dibujamos cada uno de los cuadrantes con su rotación correspondiente
  for (let row = 0; row < filas; row++) {
    for (let col = 0; col < columnas; col++) {
      dibujarCuadrante(row, col, rotaciones[row][col]);
    }
  }

  // Dibujamos las líneas divisorias AL FINAL (para que queden arriba)
  dibujarGuia(filas, columnas, anchoBloque, altoBloque);
}

function dibujarGuia(filas, columnas, bloqueAncho, bloqueAlto) {
  ctx.strokeStyle = "#4d005aff";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
  for (let i = 1; i < columnas; i++) {
    ctx.beginPath();
    ctx.moveTo(i * bloqueAncho, 0);
    ctx.lineTo(i * bloqueAncho, canvasHeight);
    ctx.stroke();
  }
  for (let j = 1; j < filas; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * bloqueAlto);
    ctx.lineTo(canvasWidth, j * bloqueAlto);
    ctx.stroke();
  }
}

// ============= DIBUJAR UN CUADRANTE INDIVIDUAL =============

function dibujarCuadrante(row, col, angulo) {
  // Usar Math.floor para asegurar valores enteros
  let anchoBloque = Math.floor(canvasWidth / columnas);
  let altoBloque = Math.floor(canvasHeight / filas);
  // Determina donde empieza este bloque en el canvas
  let x = col * anchoBloque;
  let y = row * altoBloque;

  // Crea un contenedor vacío para guardar los datos del bloque
  let cuadranteImageData = ctx.createImageData(anchoBloque, altoBloque);

  // Copiar los píxeles del cuadrante desde imageDataOriginal
  for (let py = 0; py < altoBloque; py++) {
    for (let px = 0; px < anchoBloque; px++) {
      // Posición en la imagen original
      let sourceX = Math.floor(col * anchoBloque + px);
      let sourceY = Math.floor(row * altoBloque + py);
      let sourceIndex = (sourceY * canvasWidth + sourceX) * 4;

      // Posición en el cuadrante nuevo
      let destIndex = (py * anchoBloque + px) * 4;

      // Copiar los 4 valores RGBA
      cuadranteImageData.data[destIndex + 0] = imageDataOriginal.data[sourceIndex + 0]; // R
      cuadranteImageData.data[destIndex + 1] = imageDataOriginal.data[sourceIndex + 1]; // G
      cuadranteImageData.data[destIndex + 2] = imageDataOriginal.data[sourceIndex + 2]; // B
      cuadranteImageData.data[destIndex + 3] = imageDataOriginal.data[sourceIndex + 3]; // A
    }
  }

  // Crear un canvas temporal para rotar el cuadrante
  let tempCanvas = document.createElement("canvas");
  tempCanvas.width = anchoBloque;
  tempCanvas.height = altoBloque;
  let tempCtx = tempCanvas.getContext("2d");

  // Dibujar el ImageData en el canvas temporal
  tempCtx.putImageData(cuadranteImageData, 0, 0);

  // Ahora dibujamos el canvas temporal rotado en el canvas principal
  ctx.save();
  ctx.translate(x + anchoBloque / 2, y + altoBloque / 2);
  ctx.rotate((angulo * Math.PI) / 180);

  // Ajustar dimensiones si está rotado 90° o 270°
  if (angulo % 180 !== 0) {
    // Si está rotado 90° o 270°, intercambiar ancho y alto
    ctx.drawImage(tempCanvas,-altoBloque / 2,-anchoBloque / 2,altoBloque,anchoBloque);
  } else {
     // Si está en 0° o 180°, usar dimensiones normales
    ctx.drawImage(tempCanvas,-anchoBloque / 2,-altoBloque / 2,anchoBloque,altoBloque);
  }

  ctx.restore();
}

// ============= DETECCIÓN DE CLICKS =============

// Escuchamos cuando el usuario hace click en el canvas
canvas.addEventListener("mousedown", (e) => {
  // Si es el primer click, iniciamos el cronómetro automáticamente
  if (!juegoIniciado) {
    iniciarCronometro();
  }

  // Obtenemos la posición del canvas en la página
  let rect = canvas.getBoundingClientRect();

  // Calculamos las coordenadas X e Y del click DENTRO del canvas
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  let anchoBloque = Math.floor(canvasWidth / columnas);
  let altoBloque = Math.floor(canvasHeight / filas);


  // Determinar en qué columna y fila se hizo click
  let col = Math.floor(x / anchoBloque);
  let row = Math.floor(y / altoBloque);

  // Asegurarse de que no se salga de los límites
  col = Math.min(col, columnas - 1);
  row = Math.min(row, filas - 1);

  if (estaBloqueado(row, col)) {
    // Mostrar mensaje de que está bloqueado
    const containerMsj = document.querySelector(".container-msj");
    const msj = document.querySelector(".msj");
    containerMsj.classList.remove("hidden");
    msj.textContent = "Este bloque está en posición correcta (ayuda)";
    setTimeout(() => {
      containerMsj.classList.add("hidden");
    }, 1500);
    return; // No permitir rotar este bloque
  }

  // e.button indica qué botón del mouse se presionó:
  // 0 = botón izquierdo -> rotamos -90° (izquierda)
  // 2 = botón derecho -> rotamos +90° (derecha)
  if (e.button === 0) {
    rotaciones[row][col] -= 90; // Rotar a la izquierda
  } else if (e.button === 2) {
    rotaciones[row][col] += 90; // Rotar a la derecha
  }

  // Normalizamos el ángulo para que esté entre 0 y 359
  rotaciones[row][col] = rotaciones[row][col] % 360;
  if (rotaciones[row][col] < 0) rotaciones[row][col] += 360;

  // Redibujamos todo el canvas con la nueva rotación
  dibujarTodo();

  // Verificamos si el puzzle está completo
  verificarCompletado();
});

// Desactivamos el menú contextual que aparece con click derecho
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // Cancela el comportamiento por defecto
});

// ============= CRONOMETRO =============

let intervalo; // Variable para guardar el intervalo del cronómetro

// Bandera que indica si el juego ya comenzó
let juegoIniciado = false;

// Récord guardado en localStorage (memoria del navegador)
// Si no hay récord previo, será null
let recordNivel = localStorage.getItem("recordBlocka") || null;

let btnPlay = document.querySelector(".btn-play-blocka");
let cronometro = document.querySelector(".cronometro");
let record = document.querySelector(".record");

// tiempo limite para jugar
let tiempoLimite = 10;

let segundos = 0;
let minutos = 0;

btnPlay.addEventListener("click", () => {
  if (btnPlay.textContent === "Comenzar") {
    iniciarCronometro();
  } else {
    // Ocultar botones de fin de nivel
    let btnsLevelEnd = document.querySelector(".level-end");
    if (btnsLevelEnd && btnsLevelEnd.classList.contains("visible")) {
      btnsLevelEnd.classList.remove("visible");
    }
    
    // Resetear ayuda
    ayudaUsada = false;
    bloquesBloqueados = [];
    actualizarBotonAyuda();
    
    // Resetear cronómetro
    detenerCronometro();
    segundos = 0;
    minutos = 0;
    juegoIniciado = false;
    cronometro.textContent = "00:00";
    btnPlay.textContent = "Comenzar";
    
    // Generar nuevas rotaciones aleatorias (sin cambiar imagen)
    inicializarJuego();
  }
});
document.querySelector(".btn-repeat").addEventListener("click", () => {
  // Reiniciá el nivel
  reiniciarNivel();
});

// Mostrar el récord al cargar la página (si existe)
if (recordNivel !== null) {
  record.textContent = `Récord actual: ${formatearTiempo(parseInt(recordNivel))}`;
}

function iniciarCronometro() {
  detenerCronometro();
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

    cronometro.textContent = `${String(minutos.toString().padStart(2, "0"))}:${String(segundos.toString().padStart(2, "0"))}`; // Esta línea hace que siempre se muestren 2 dígitos
    let tiempoActual = convertirATiempoTotal(minutos, segundos);
    if (nivelActual >= 3 && tiempoActual >= tiempoLimite) {
      detenerCronometro();
      juegoIniciado = false;
      document.querySelector(".msj-tiempo-agotado").classList.remove("hidden");
      document.querySelector(".msj-tiempo-agotado").textContent = "¡Tiempo agotado! Reinicia el nivel para intentarlo de nuevo.";
      setTimeout(() => {
        document.querySelector(".msj-tiempo-agotado").classList.add("hidden");
      }, 5000);

      // Mostrar contenedor de fin de nivel
      document.querySelector(".level-end").classList.add("visible");
      document.querySelector(".btn-next-level").classList.add("hidden");
      document.querySelector(".btn-repeat").classList.remove("hidden");
    }
  }, 1000);
}

// ============= FUNCIÓN PARA SIGUIENTE NIVEL =============

function siguienteNivel() {
  if (nivelActual < NIVEL_MAXIMO) {
    nivelActual++;
    reiniciarNivel();
  } else {
    document.querySelector(".msj-tiempo-agotado").classList.remove("hidden");
    document.querySelector(".msj-tiempo-agotado").textContent = "¡Felicidades! Completaste todos los niveles";
    document.querySelector(".level-end").classList.add("visible");
    document.querySelector(".btn-next-level").classList.add("hidden");
    document.querySelector(".btn-back").classList.add("hidden");
    document.querySelector(".btn-repeat").classList.add("hidden");
  }
}
// ============= FUNCIÓN PARA REINICIAR NIVEL =============
function reiniciarNivel() {
  ayudaUsada = false;
  bloquesBloqueados = [];
  actualizarBotonAyuda();
  // Ocultar botones de fin de nivel
  let btnsLevelEnd = document.querySelector(".level-end");
  if (btnsLevelEnd.classList.contains("visible")) {
    btnsLevelEnd.classList.remove("visible");

  // Aviso de tiempo para niveles 3 y 4

  const avisoTiempo = document.querySelector(".aviso-tiempo");
  if (avisoTiempo) {
    // VALIDACIÓN AGREGADA
    if (nivelActual >= 3) {
      avisoTiempo.classList.remove("hidden");
      setTimeout(() => {
      avisoTiempo.classList.add("hidden");
      }, 4000);
    } else {
      avisoTiempo.classList.add("hidden");
    }
  }
  }

  // Resetear cronómetro
  detenerCronometro();
  segundos = 0;
  minutos = 0;
  juegoIniciado = false;
  cronometro.textContent = "00:00";
  btnPlay.textContent = "Comenzar";

  // Limpiar canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Cargar nueva imagen
  cargarImagen();
}

// ============= VERIFICAR COMPLETADO =============
function verificarCompletado() {
  let completado = true;
  for (let row = 0; row < filas; row++) {
    for (let col = 0; col < columnas; col++) {
      if (rotaciones[row][col] % 360 !== 0) {
        completado = false;
        break;
      }
    }
    if (!completado) break;
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
      localStorage.setItem("recordBlocka", recordNivel);
      record.textContent = `¡Nuevo récord! Completaste el puzzle en ${formatearTiempo(tiempoActual)}`;
    } else {
      record.textContent = `Completado en ${formatearTiempo(tiempoActual)}. Récord actual: ${formatearTiempo(parseInt(recordNivel))}`;
    }

    // Mostrar contenedor de fin de nivel

    let btnsLevelEnd = document.querySelector(".level-end");
    if (btnsLevelEnd) {
      // VALIDACIÓN AGREGADA
      btnsLevelEnd.classList.add("visible");
    }

    const btnRepeat = document.querySelector(".btn-repeat");
    if (btnRepeat) {
      // VALIDACIÓN AGREGADA
      btnRepeat.classList.add("hidden");
    }

    const btnNextLevel = document.querySelector(".btn-next-level");
    if (btnNextLevel) {
      // VALIDACIÓN AGREGADA
      btnNextLevel.classList.remove("hidden");
    }

    const levelFail = document.querySelector(".level-fail");
    if (levelFail) {
      // VALIDACIÓN AGREGADA
      levelFail.classList.add("hidden");
    }
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
  return `${mins.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
}

// Función auxiliar para convertir mm:ss a segundos totales
function convertirATiempoTotal(mins, segs) {
  return mins * 60 + segs;
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

      switch (tipoFiltro) {
        case "escalaGrises":
          colorFiltrado = escalaDeGrises(r, g, b);
          break;
        case "brillo":
          colorFiltrado = aumentarBrillo(r, g, b);
          break;
        case "negativo":
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
    b: gray,
  };
}

function aumentarBrillo(r, g, b) {
  let incremento = 77; // 30% de 255 ≈ 77
  return {
    r: Math.min(255, r + incremento),
    g: Math.min(255, g + incremento),
    b: Math.min(255, b + incremento),
  };
}

function invertirColores(r, g, b) {
  return {
    r: 255 - r,
    g: 255 - g,
    b: 255 - b,
  };
}

// ============= sistema de ayuda =============
let ayudaUsada = false; // Bandera para saber si ya usó la ayuda
let bloquesBloqueados = []; // Array para guardar qué bloques están bloqueados

// Función para mostrar/ocultar botón de ayuda según el nivel
function actualizarBotonAyuda() {
  const btnAyuda = document.querySelector(".btn-ayuda");
  if (!btnAyuda) {
    return; // Si el botón no existe, salir de la función
  }
  if (nivelActual >= 3) {
    btnAyuda.classList.remove("hidden");
    // Resetear el estado de ayuda en cada nivel
    ayudaUsada = false;
    btnAyuda.disabled = false;
    btnAyuda.textContent = "Ayudita"; 
  } else {
    btnAyuda.classList.add("hidden");
  }
}

// Event listener para el botón de ayuda
document.addEventListener("DOMContentLoaded", () => {
  const btnAyuda = document.querySelector(".btn-ayuda");

  if (btnAyuda) {
    btnAyuda.addEventListener("click", usarAyuda);
  }
});

function usarAyuda() {
  const btnAyuda = document.querySelector(".btn-ayuda"); 

  if (!btnAyuda) {
    console.error("El botón de ayuda no existe en el HTML");
    return;
  }

  if (ayudaUsada) {
    mostrarMensaje("Ya usaste la ayuda en este nivel");
    return;
  }

  if (!juegoIniciado) {
    mostrarMensaje("Inicia el juego para usar la ayuda");
    return;
  }

  // Buscar bloques que NO estén en posición correcta (0°)
  let bloquesIncorrectos = [];

  for (let row = 0; row < filas; row++) {
    for (let col = 0; col < columnas; col++) {
      if (rotaciones[row][col] % 360 !== 0) {
        bloquesIncorrectos.push({ row, col });
      }
    }
  }

  // Si no hay bloques incorrectos, ya ganó
  if (bloquesIncorrectos.length === 0) {
    alert("¡Ya resolviste el puzzle!");
    return;
  }

  // Elegir un bloque aleatorio de los incorrectos
  let indiceAleatorio = Math.floor(Math.random() * bloquesIncorrectos.length);
  let bloqueElegido = bloquesIncorrectos[indiceAleatorio];

  // Colocar el bloque en posición correcta (0°)
  rotaciones[bloqueElegido.row][bloqueElegido.col] = 0;

  // Agregar a la lista de bloqueados
  bloquesBloqueados.push(bloqueElegido);

  // Agregar 5 segundos al cronómetro
  segundos += 5;
  if (segundos >= 60) {
    minutos += Math.floor(segundos / 60);
    segundos = segundos % 60;
  }

  // Actualizar display del cronómetro
  cronometro.textContent = `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

  // Marcar que ya se usó la ayuda
  ayudaUsada = true;

  // Deshabilitar el botón (ahora btnAyuda ya está definido)
  btnAyuda.disabled = true;
  btnAyuda.textContent = "Ayuda usada";

  // Redibujar el canvas con el bloque corregido
  dibujarTodo();

  // Verificar si con esta ayuda ya completó el puzzle
  verificarCompletado();
}
// Función para verificar si un bloque está bloqueado
function estaBloqueado(row, col) {
  return bloquesBloqueados.some((b) => b.row === row && b.col === col);
}
// ============= FUNCIÓN AUXILIAR PARA MOSTRAR MENSAJES =============
function mostrarMensaje(texto, duracion = 2500) {
  const msj = document.querySelector(".msj");

  if (!msj) {
    console.error("El elemento .msj no existe");
    return;
  }

  // Mostrar mensaje
  msj.textContent = texto;
  msj.classList.remove("hidden");

  // Ocultar después del tiempo especificado
  setTimeout(() => {
    msj.classList.add("hidden");
  }, duracion);
}

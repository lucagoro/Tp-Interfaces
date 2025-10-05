// === Elementos del DOM ===

// === menu hamburguesa ===
const menuIcon = document.getElementById("menu-icon");
const menu = document.getElementById("menu");
const closeBtns = document.querySelectorAll(".fa-xmark");
const overlay = document.getElementById("overlay");
const categoriasToggle = document.getElementById("Btn-categorias");
const categoriasDropdown = document.getElementById("dropdown");
const categoriasLi = categoriasToggle.closest(".categorías");
// === perfil ===
const profilIcon = document.getElementById("profil-icon");
const profil = document.getElementById("nav-profil");

// === Funciones ===
function openPanel(panel) {
  panel.classList.add("show");
  overlay.classList.add("show");
}

function closePanel(panel) {
  panel.classList.remove("show");
  overlay.classList.remove("show");
}

function toggleCategorias() {
  categoriasDropdown.classList.toggle("showcategories");
  categoriasLi.classList.toggle("open");
}
// === Eventos ===
menuIcon.addEventListener("click", () => openPanel(menu));
profilIcon.addEventListener("click", () => openPanel(profil));
overlay.addEventListener("click", () => {
  closePanel(menu);
  closePanel(profil);
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    closePanel(menu);
    closePanel(profil);
  });
});
categoriasToggle.addEventListener("click", toggleCategorias);

// === Loading Screen ===

let progress = 0; // Progreso actual (de 0 a 100)

// Referencias a elementos del DOM
const loadingProgress = document.getElementById("loadingProgress"); // Barra azul
const loadingPercent = document.getElementById("loadingPercent"); // Texto "X%"
const loadingScreen = document.getElementById("loadingScreen"); // Contenedor completo

// ===== CONFIGURACIÓN DE TIEMPOS =====
const duration = 5000;   // Duración total: 5000ms = 5 segundos
const interval = 50;     // Actualizar cada 50ms (20 veces por segundo)
const increment = (100 / (duration / interval));  

// Cálculo: 100 / (5000 / 50) = 100 / 100 = 1
// Incrementa 1% cada 50ms para llegar a 100% en 5 segundos

// ===== INTERVALO QUE SIMULA LA CARGA =====
const loadingInterval = setInterval(() => {
  // Incrementar progreso
  progress += increment; // Suma 1% cada vez

  // Verificar si llegó al 100%
  if (progress >= 100) {
    progress = 100; // Asegurar que no pase de 100
    clearInterval(loadingInterval); // Detener el intervalo

    // Esperar 300ms y luego ocultar el loading
    setTimeout(() => {
      loadingScreen.classList.add("hidden"); // Agrega clase que lo hace transparente
      document.body.style.overflow = "auto"; // Restaurar scroll
    }, 300);
  }

  // ===== ACTUALIZAR LA INTERFAZ =====
  // Actualizar ancho de la barra
  loadingProgress.style.width = progress + "%";

  // Actualizar texto del porcentaje (sin decimales)
  loadingPercent.textContent = progress + "%";
}, interval); // Se ejecuta cada 50ms

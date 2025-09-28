// === Elementos del DOM ===
const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementById('menu');
const closeMenuBtn = document.getElementById('close-menu');
const overlay = document.getElementById('overlay');
const categoriasToggle = document.getElementById('Btn-categorias');
const categoriasDropdown = document.getElementById('dropdown');
const categoriasLi = categoriasToggle.closest('.categorías');

// === Funciones ===
function abrirMenu() {
  menu.classList.add('show');
  overlay.classList.add('show');
}

function cerrarMenu() {
  menu.classList.remove('show');
  overlay.classList.remove('show');
}

function toggleCategorias(e) {
  e.preventDefault();
  categoriasDropdown.classList.toggle('showcategories');
  categoriasLi.classList.toggle('open');
}

// === Eventos ===
menuIcon.addEventListener('click', abrirMenu);
closeMenuBtn.addEventListener('click', cerrarMenu);
overlay.addEventListener('click', cerrarMenu);
categoriasToggle.addEventListener('click', toggleCategorias);

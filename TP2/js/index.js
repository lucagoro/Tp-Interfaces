// === Elementos del DOM ===

 // === menu hamburguesa ===
const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementById('menu');
const closeBtns=document.querySelectorAll('.close-nav');
const overlay = document.getElementById('overlay');
const categoriasToggle = document.getElementById('Btn-categorias');
const categoriasDropdown = document.getElementById('dropdown');
const categoriasLi = categoriasToggle.closest('.categorías');
 // === perfil ===
const profilIcon = document.getElementById('profil-icon');
const profil= document.getElementById('nav-profil');

// === Funciones ===
function openPanel(panel) {
  panel.classList.add('show');
  overlay.classList.add('show');
}

function closePanel(panel) {
  panel.classList.remove('show');
  overlay.classList.remove('show');
}

function toggleCategorias() {
 
  categoriasDropdown.classList.toggle('showcategories');
  categoriasLi.classList.toggle('open');
}
// === Eventos ===
menuIcon.addEventListener('click', () => openPanel(menu));
profilIcon.addEventListener('click', () => openPanel(profil));
overlay.addEventListener('click', () => {
  closePanel(menu);
  closePanel(profil);
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    closePanel(menu);
    closePanel(profil);
  });
});
categoriasToggle.addEventListener('click', toggleCategorias);




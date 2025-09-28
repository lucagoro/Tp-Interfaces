const Btnmenu = document.getElementById('menu-icon');
const menu = document.getElementById('menu');
const Btncategorias = document.getElementById('Btn-categorias');
const categorias = document.getElementById('dropdown');
const cruz=document.getElementById('close-menu');

const overlay = document.getElementById('overlay');

// Agrega el event listener
Btnmenu.addEventListener('click', () => {
  menu.classList.toggle('show');
  overlay.classList.toggle('show');
});
Btncategorias.addEventListener('click', (e) => {
 e.preventDefault(); 
 categorias.classList.toggle('showcategories');
});

overlay.addEventListener('click', () => {
  menu.classList.remove('show');
  overlay.classList.remove('show');
});
cruz.addEventListener('click', () => {
    menu.classList.remove('show');
    overlay.classList.remove('show');
   });
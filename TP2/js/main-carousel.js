// Carrusel funcional para el carrusel principal

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".main-carousel-slide");
  const prevBtn = document.querySelector(".main-carousel-arrow.left");
  const nextBtn = document.querySelector(".main-carousel-arrow.right");
  let current = 0;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === idx);
      slide.style.display = i === idx ? "block" : "none";
    });
  }

  prevBtn.addEventListener("click", function () {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  nextBtn.addEventListener("click", function () {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  // Inicializar
  showSlide(current);
});

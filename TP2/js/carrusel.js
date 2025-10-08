const carruseles = document.querySelectorAll(".carousel-viewport"); // Selecciona todos los carruseles

carruseles.forEach((carrusel) => {
  const track = carrusel.querySelector(".carousel-track"); // Pista que contiene las tarjetas
  const slides = Array.from(track.children); // Todas las tarjetas Devuelve una HTMLCollection con todos los elementos hijos directos del .carousel-track.
  const nextButton = carrusel.querySelector(".carousel__btn--next");
  const prevButton = carrusel.querySelector(".carousel__btn--prev");
  // Si no hay botones de flecha, no inicializar navegación para este carrusel
  if (!nextButton || !prevButton) {
    return;
  }

  const visibleCards = 5;
  const totalSlides = slides.length;
  const totalPages = Math.ceil(totalSlides / visibleCards); // Total de "páginas" o grupos de tarjetas
  let currentPage = 0; // Página actual

  function updateChildrenNext() {
    // 1. Agrega la clase de estiramiento a todas las tarjetas .game-card dentro de cada slide
    slides.forEach((slide) => {
      const card = slide.querySelector(".game-card");
      if (card) card.classList.add("stretch-next");
    });

    // 2. Llama a updateCarousel (mueve el carrusel)
    updateCarousel();
    // 3. Después de 1000ms, quita la clase y restaura la transición
    setTimeout(() => {
      slides.forEach((slide) => {
        const card = slide.querySelector(".game-card");
        if (card) card.classList.remove("stretch-next");
      });
      track.style.transition = "";
    }, 1000);
  }

  function updateChildrenprev() {
    // 1. Agrega la clase de estiramiento a todas las tarjetas .game-card dentro de cada slide
    slides.forEach((slide) => {
      const card = slide.querySelector(".game-card");
      if (card) card.classList.add("stretch-prev");
    });

    // 2. Llama a updateCarousel (mueve el carrusel)
    updateCarousel();
    // 3. Después de 1000ms, quita la clase y restaura la transición
    setTimeout(() => {
      slides.forEach((slide) => {
        const card = slide.querySelector(".game-card");
        if (card) card.classList.remove("stretch-prev");
      });
      track.style.transition = "";
    }, 1000);
  }

  function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width; // Ancho de una tarjeta
    const amountToMove = slideWidth * visibleCards * currentPage; // Cantidad a mover
    track.style.transform = `translateX(-${amountToMove}px)`; // Mueve la pista

    prevButton.disabled = currentPage === 0; // Deshabilita el botón si está en la primera página
    nextButton.disabled = currentPage >= totalPages - 1; // Deshabilita el botón si está en la última página
  }

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      updateChildrenNext();
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      updateChildrenprev();
    }
  });

  updateCarousel();
});

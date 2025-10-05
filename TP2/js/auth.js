// Validación personalizada del formulario de login
// Selecciona el botón submit por clase (soporta múltiples páginas)
let buttonSubmit = document.querySelector(".btn-submit");
var loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    limpiarErrores();
    let valid = true;

    // Validar email
    if (!document.getElementById("email").value.trim()) {
      var errorEmail = document.getElementById("error-email");
      errorEmail.classList.add("visible");
      valid = false;
    }
    // Validar contraseña
    if (!document.getElementById("password").value.trim()) {
      var errorPassword = document.getElementById("error-password");
      errorPassword.classList.add("visible");
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
    } else {
      e.preventDefault();
      buttonSubmit.classList.add("success");
      setTimeout(function () {
        window.location.href = "../index.html";
      }, 3000);
    }
  });
}

// Limpia todos los mensajes de error debajo de los inputs
function limpiarErrores() {
  ["email", "nombre", "apellido", "edad", "password"].forEach(function (campo) {
    var errorDiv = document.getElementById("error-" + campo);
    if (errorDiv) {
      errorDiv.classList.remove("visible");
    }
  });
}

// Validación personalizada del formulario de registro
document
  .getElementById("registroForm")
  .addEventListener("submit", function (e) {
    limpiarErrores(); // Borra mensajes anteriores
    let valid = true;

    // Validar email
    if (!document.getElementById("email").value.trim()) {
      var errorEmail = document.getElementById("error-email");
      errorEmail.classList.add("visible");
      valid = false;
    }
    // Validar nombre
    if (!document.getElementById("nombre").value.trim()) {
      var errorNombre = document.getElementById("error-nombre");
      errorNombre.classList.add("visible");
      valid = false;
    }
    // Validar apellido
    if (!document.getElementById("apellido").value.trim()) {
      var errorApellido = document.getElementById("error-apellido");
      errorApellido.classList.add("visible");
      valid = false;
    }
    // Validar edad
    if (!document.getElementById("edad").value.trim()) {
      var errorEdad = document.getElementById("error-edad");
      errorEdad.classList.add("visible");
      valid = false;
    }
    // Validar contraseña
    if (!document.getElementById("password").value.trim()) {
      var errorPassword = document.getElementById("error-password");
      errorPassword.classList.add("visible");
      valid = false;
    }

    // Si hay algún error, evita el envío del formulario
    if (!valid) {
      e.preventDefault();
    } else {
      e.preventDefault();
      buttonSubmit.classList.add("success");
      setTimeout(function () {
        window.location.href = "../index.html";
      }, 5000);
    }
  });

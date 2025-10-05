const form = document.querySelector('#comments form');

const comment=form.querySelector("input[name='comentario']");
const commentList = document.getElementById('comment-list'); 
const botonEnviar = document.querySelector("#comments button");

comment.addEventListener("focus", () => {
  botonEnviar.style.display = "inline-block";
});
comment.addEventListener("blur", () => {
  if (comment.value.trim() === "") {
    botonEnviar.style.display = "none";
  }
});
form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const comment = form.elements['comentario'];
    const commentText = comment.value.trim();  
    if (commentText !== '') {
        const newcomment = document.createElement('div');
        newcomment.className = 'comment';
        newcomment.innerHTML = `
       <div class="comment-new-header">
               <i class="fa-solid fa-user"></i>
               <span>Usuario Anónimo</span>
                 <small>${new Date().toLocaleString()}</small>
       </div>
                <p>${commentText}</p>
        <div class="comment-footer" >
                 <i class="fa-solid fa-thumbs-up"></i>
                <small>0</small>
                <i class="fa-solid fa-thumbs-down"></i>
                 <small>0</small>
                 <a href="#">Responder</a>
        </div>
                `;
        commentList.appendChild(newcomment);
        comment.value = ''; 
        comment.focus();
         botonEnviar.style.display = "none";
    }});

    /* breadcrums
    function setBreadcrumb(rutaArray) {
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.innerHTML = ""; // Limpiar contenido anterior

    rutaArray.forEach((item, index) => {
      const link = document.createElement("a");
      link.textContent = item.nombre;
      link.href = item.url;

      breadcrumb.appendChild(link);
    });
  }*/
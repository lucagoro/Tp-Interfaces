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
                 <img src="../images/icono-user.png" alt="icono usuario">
               <span>Usuario Anónimo</span>
                 <small>${new Date().toLocaleString()}</small>
       </div>
                <p>${commentText}</p>
        <div class="comment-footer" >
                 <img src="../images/icono-me-gusta.png" alt="like">
                <small>0</small>
                 <img src="../images/icono-no-me-gusta.png" alt="dislike">
                 <small>0</small>
                 <a href="#">Responder</a>
        </div>
                `;
        commentList.appendChild(newcomment);
        comment.value = ''; 
        comment.focus();
         botonEnviar.style.display = "none";
    }});
import * as funciones from "../core/storage.js";

const tipoDocInput = document.querySelector(".tipoDoc").value;
const numeroDocInput = document.querySelector(".numeroDoc");
const passwordInput = document.querySelector(".password");
const btnSunmitInput = document.querySelector(".btnSubmit");

const usuario = funciones.obtenerUsuario(numeroDocInput);

btnSunmitInput.addEventListener("click", ()=>{
    if (!usuario) {
    alert("Usuario no existe");
    } else if (usuario.password === passwordInput) {
    window.location.href = "principal.html";
    } else {
        alert("Contraseña incorrecta");
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
}); 

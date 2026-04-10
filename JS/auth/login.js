//importacion de funciones desde el storage.js
import * as funciones from "../core/storage.js";

const btnSubmitInput = document.querySelector(".btnSubmit");

//funcion para limpiar todos los mensajes de error
function limpiarErrores() {
    errorTipoDoc.textContent="";
    errorNumDoc.textContent="";
    errorPassword.textContent="";

    tipoDocInput.classList.remove("incorrecto","correcto");
    passwordInput.classList.remove("incorrecto","correcto");
    numeroDocInput.classList.remove("incorrecto","correcto");
}

btnSubmitInput.addEventListener("click", (event)=>{
    event.preventDefault();

    limpiarErrores();
    //inputs
    const tipoDocInput = document.querySelector(".tipoDoc");
    const numeroDocInput = document.querySelector(".numeroDoc");
    const passwordInput = document.querySelector(".password");

    //captura de datos
    const tipoDoc = document.querySelector(".tipoDoc").value;
    const numeroDoc = document.get("numeroDoc").trim();
    const password = document.get(".password").trim();

    //espacios de errores
    const errorTipoDoc=document.getElementById("errorTipoDoc");
    const errorNumDoc=document.getElementById("errorNumDoc");
    const errorPassword=document.getElementById("errorPassword");

    //se obtiene el usuario de localstorage
    const usuario = funciones.obtenerUsuario(numeroDocInput);

    //validaciones
    let formularioEsValido = true;

    //tipo de documento ingresado
    if (tipoDoc == "") {
        funciones.mostrarError(tipoDocInput,errorNombre,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else{
        funciones.mostrarCorrecto(tipoDocInput,errorTipoDoc)
    }

    //numero de documento ingresado
    if (numeroDoc == "") {
        funciones.mostrarError(numeroDocInput,errorNumDoc,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else{
        funciones.mostrarCorrecto(numeroDocInput,errorNumDoc)
    }

    //contraseña ingresada
    if (password == "") {
        funciones.mostrarError(passwordInput,errorPassword,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else{
        funciones.mostrarCorrecto(passwordInput,errorPassword)
    }

    //validacion de usuario y acceso
    if (!usuario) {
    alert("Usuario no existe");
    } else if (usuario.password === passwordInput && usuario.numeroId === numeroDocInput) {
        window.location.href = "dashboard.html";
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    } else {
        alert("Contraseña incorrecta");
    }
});
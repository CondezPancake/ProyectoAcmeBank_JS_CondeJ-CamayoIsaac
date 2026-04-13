//importacion de funciones desde el storage.js
import * as funciones from "../core/storage.js";
import * as alertas from "../ui/alerts.js";
import { setSession } from "../core/session.js";  
import { protectRoute, getSession, logout } from "../core/session.js";

protectRoute();

setSession(usuarioEncontrado);
window.location.href = "../../dashboard.html"

const btnSubmitInput = document.querySelector(".btnSubmit");
const btnRegistro = document.querySelector(".btnRegistro");

//espacios de errores
const errorTipoDoc=document.getElementById("errorTipoDoc");
const errorNumDoc=document.getElementById("errorNumDoc");
const errorPassword=document.getElementById("errorPassword");
    
//inputs
const tipoDocInput = document.querySelector(".tipoDoc");
const numeroDocInput = document.querySelector(".numeroDoc");
const passwordInput = document.querySelector(".password");


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
    


    //captura de datos
    const tipoDoc = document.querySelector(".tipoDoc").value;
    const numeroDoc = Number(document.querySelector(".numeroDoc").value.trim());
    const password = document.querySelector(".password").value.trim();

    

    //se obtiene el usuario de localstorage
    const usuario = funciones.obtenerUsuario(numeroDoc);

    //validaciones
    let formularioEsValido = true;

    //tipo de documento ingresado
    if (tipoDoc == "") {
        alertas.mostrarError(tipoDocInput,errorTipoDoc,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(tipoDocInput,errorTipoDoc)
    }

    //numero de documento ingresado
    if (numeroDoc == "") {
        alertas.mostrarError(numeroDocInput,errorNumDoc,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(numeroDocInput,errorNumDoc)
    }

    //contraseña ingresada
    if (password == "") {
        alertas.mostrarError(passwordInput,errorPassword,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(passwordInput,errorPassword)
    }

    //validacion de usuario y acceso
    if (usuario == null) {
        alert("Usuario no existe");
    } else if (usuario.password === password && usuario.numeroDoc === numeroDoc) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        window.location.href = "dashboard.html";
    } else {
        alert("Documento o Contraseña incorrecta");
    }
});

//boton de registro para llevarlo a register.html
btnRegistro.addEventListener("click", () => {
    console.log("click detectado");
    window.location.href = "register.html";
});
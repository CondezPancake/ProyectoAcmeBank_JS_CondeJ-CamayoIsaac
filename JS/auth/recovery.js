//importaciones
import * as funciones from "../core/storage.js";
import * as alertas from "../ui/alerts.js";

//botones
const btnCancelar = document.querySelector(".btnCancelar");
const btnRecovery = document.querySelector(".btnRecovery");
const btnChange = document.querySelector(".btnChange")

//contenedores
const formDatos = document.querySelector(".formDatos");
const formContraseña = document.querySelector(".formContraseña");

//inputs
const tipoDocInput = document.querySelector(".tipoDoc");
const numeroDocInput = document.querySelector(".numeroDoc");
const emailInput = document.querySelector(".email");
const passwordInput1 = document.querySelector(".password");
const passwordInput2 = document.querySelector(".password2");

//parrafos de errores
const errorTipoDoc = document.querySelector(".errorTipoDoc");
const errorNumDoc = document.querySelector(".errorNumDoc");
const errorEmail = document.querySelector(".errorEmail");
const errorPassword1 = document.querySelector(".errorPassword");
const errorPassword2 = document.querySelector(".errorPassword2");


let usuario = null;



//funcion de validacion de correo electronico
function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}
//funcion para limpiar todos los mensajes de error
function limpiarErrores() {
    errorTipoDoc.textContent="";
    errorNumDoc.textContent="";
    errorEmail.textContent="";
    errorPassword1.textContent="";
    errorPassword2.textContent="";

    tipoDocInput.classList.remove("incorrecto","correcto");
    numeroDocInput.classList.remove("incorrecto","correcto");
    emailInput.classList.remove("incorrecto","correcto");
    passwordInput1.classList.remove("incorrecto","correcto");
    passwordInput2.classList.remove("incorrecto","correcto");
}

//ocultar/mostrar formularios
formDatos.hidden=false;
formContraseña.hidden=true;

btnRecovery.addEventListener("click",(event)=>{
    event.preventDefault();
    limpiarErrores();

    //toma de datos
    const tipoDoc = document.querySelector(".tipoDoc").value.trim();
    const numeroDoc = Number(document.querySelector(".numeroDoc").value.trim());
    const email = document.querySelector(".email").value.trim();

    //validaciones

    let formularioEsValido = true;

    if (tipoDoc=="") {
        alertas.mostrarError(tipoDocInput,errorTipoDoc,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(tipoDocInput,errorTipoDoc)
    }

    //numero de documento ingresado
    if (numeroDoc = "") {
        alertas.mostrarError(numeroDocInput,errorNumDoc,"este espacio es obligatorio");
        formularioEsValido=false;
    } else if (isNaN(numeroDoc)) {
        alertas.mostrarError(numeroDocInput,errorNumDoc,"solo numeros en este espacio");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(numeroDocInput,errorNumDoc)
    }
        

    //email
    if (email=="") {
        alertas.mostrarError(emailInput,errorEmail,"el email es obligatorio");
        formularioEsValido=false;
    }else if(correoValido(email)){
        alertas.mostrarCorrecto(emailInput,errorEmail);
    }else{
        alertas.mostrarError(emailInput,errorEmail,"email invalido")
    }

    if (formularioEsValido) {
        usuario = funciones.obtenerUsuario(numeroDoc)

        if (usuario) {
            if (usuario.email === email) {
                formDatos.hidden=true;
                formContraseña.hidden=false;
            }else{
                alertas.mostrarError(emailInput,errorEmail,"email incorrecto")
            }
        }else{
            alert("usuario no encontrado")
        }
    }
})

btnChange.addEventListener("click",(event)=>{
    event.preventDefault();
    limpiarErrores();

    const password1 = document.querySelector(".password").value.trim();
    const password2 = document.querySelector(".password2").value.trim();

    //validaciones de la contraseña
    let formularioEsValido = true;

    if (password1 == "") {
        alertas.mostrarError(passwordInput1,errorPassword1,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else if (password2 == "") {
        alertas.mostrarError(passwordInput2,errorPassword2,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else if (password1.length<8 || password1.length>12) {
        alertas.mostrarError(passwordInput1,errorPassword1,"minimo 8 caracteres y maximo 12 caracteres");
        alertas.mostrarError(passwordInput2,errorPassword2,"minimo 8 caracteres y maximo 12 caracteres");
        formularioEsValido=false;
    }else if (password1 !== password2) {
        alertas.mostrarError(passwordInput1,errorPassword1,"los dos espacios deben tener la misma contraseña");
        alertas.mostrarError(passwordInput2,errorPassword2,"los dos espacios deben tener la misma contraseña");
        formularioEsValido=false;
        return;
    }else{
        alertas.mostrarCorrecto(passwordInput1,errorPassword1);
        alertas.mostrarCorrecto(passwordInput2,errorPassword2);
    }

    if (formularioEsValido) {
        let usuarios = JSON.parse(localStorage.getItem("usuarios"));
        if (!usuarios) {
            console.error("variable usuarios = null");
        }else{
            let indiceU = usuarios.findIndex(u => u.numeroDoc === numeroDoc);
            if (indiceU     === -1) {
                alert("usuario no encontrado");
            }else{
                usuarios[indiceU].password = password1;
                localStorage.setItem("usuarios",JSON.stringify(usuarios));
                window.location.href="index.html"
            }
        }
        
    }
})

btnCancelar.addEventListener("click",()=>{
    window.location.href="index.html"
})
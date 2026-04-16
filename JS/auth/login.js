/**
 * login.js
 * Controla el formulario de inicio de sesión.
 * Valida los campos ingresados y autentica al usuario contra los datos en localStorage.
 */

// Importaciones de módulos del proyecto
import * as funciones from "../core/storage.js";
import * as alertas from "../ui/alerts.js";
import { setSession, getSession } from "../core/session.js";

// Si ya hay una sesión activa, redirige directamente al dashboard
const usuarioEnSesion = getSession();
if (usuarioEnSesion) {
    window.location.href = "../../dashboard.html";
}

// Referencias a botones del formulario
const btnSubmitInput = document.querySelector(".btnSubmit");
const btnRegistro = document.querySelector(".btnRegistro");

// Elementos donde se muestran los mensajes de error de cada campo
const errorTipoDoc = document.getElementById("errorTipoDoc");
const errorNumDoc = document.getElementById("errorNumDoc");
const errorPassword = document.getElementById("errorPassword");

// Inputs del formulario
const tipoDocInput = document.querySelector(".tipoDoc");
const numeroDocInput = document.querySelector(".numeroDoc");
const passwordInput = document.querySelector(".password");

/**
 * Limpia todos los mensajes de error y los estilos de validación
 * de los campos del formulario.
 */
function limpiarErrores() {
    errorTipoDoc.textContent = "";
    errorNumDoc.textContent = "";
    errorPassword.textContent = "";

    tipoDocInput.classList.remove("incorrecto", "correcto");
    passwordInput.classList.remove("incorrecto", "correcto");
    numeroDocInput.classList.remove("incorrecto", "correcto");
}

// Evento de envío del formulario de login
btnSubmitInput.addEventListener("click", (event) => {
    event.preventDefault();

    limpiarErrores();

    // Captura de valores del formulario
    const tipoDoc = document.querySelector(".tipoDoc").value;
    const numeroDocTexto = document.querySelector(".numeroDoc").value.trim();
    const numeroDoc = Number(numeroDocTexto);
    const password = document.querySelector(".password").value.trim();

    let formularioEsValido = true;

    // Validación: tipo de documento no puede estar vacío
    if (tipoDoc == "") {
        alertas.mostrarError(tipoDocInput, errorTipoDoc, "no se puede dejar espacio en blanco");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(tipoDocInput, errorTipoDoc);
    }

    // Validación: número de documento no puede estar vacío ni contener letras
    if (numeroDocTexto == "") {
        alertas.mostrarError(numeroDocInput, errorNumDoc, "no se puede dejar espacio en blanco");
        formularioEsValido = false;
    } else if (isNaN(numeroDoc)) {
        alertas.mostrarError(numeroDocInput, errorNumDoc, "solo numeros en este espacio");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(numeroDocInput, errorNumDoc);
    }

    // Validación: contraseña no puede estar vacía
    if (password == "") {
        alertas.mostrarError(passwordInput, errorPassword, "no se puede dejar espacio en blanco");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(passwordInput, errorPassword);
    }

    // Si algún campo es inválido, se detiene el proceso
    if (!formularioEsValido) {
        return;
    }

    // Buscar al usuario en localStorage por número de documento
    const usuario = funciones.obtenerUsuario(numeroDoc);

    // Autenticación: se verifica documento, tipo y contraseña
    if (usuario == null) {
        alert("Usuario no existe");
    } else if (usuario.password === password && usuario.numeroDoc === numeroDoc && usuario.tipoDoc === tipoDoc) {
        // Credenciales correctas: guardar sesión y redirigir al dashboard
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        localStorage.setItem("acmeUser", JSON.stringify(usuario));
        setSession(usuario);
        window.location.href = "../../dashboard.html";
    } else {
        alert("Documento o Contraseña incorrecta");
    }
});

// Redirige al formulario de registro al hacer clic en el botón correspondiente
btnRegistro.addEventListener("click", () => {
    console.log("click detectado");
    window.location.href = "../../register.html";
});
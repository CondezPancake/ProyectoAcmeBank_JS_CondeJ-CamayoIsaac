/**
 * recovery.js
 * Controla el flujo de recuperación de contraseña en dos pasos:
 * 1. Verificación de identidad (tipo de documento, número y correo).
 * 2. Ingreso y confirmación de la nueva contraseña.
 */

// Importaciones de módulos del proyecto
import * as funciones from "../core/storage.js";
import * as alertas from "../ui/alerts.js";

// Botones de acción
const btnCancelar = document.querySelector(".btnCancelar");
const btnRecovery = document.querySelector(".btnRecovery");
const btnChange = document.querySelector(".btnChange");

// Contenedores de los dos formularios del flujo
const formDatos = document.querySelector(".formDatos");           // Paso 1: verificación de identidad
const formContraseña = document.querySelector(".formContraseña"); // Paso 2: cambio de contraseña

// Inputs del paso 1
const tipoDocInput = document.querySelector(".tipoDoc");
const numeroDocInput = document.querySelector(".numeroDoc");
const emailInput = document.querySelector(".email");

// Inputs del paso 2
const passwordInput1 = document.querySelector(".password");
const passwordInput2 = document.querySelector(".password2");

// Elementos de error del paso 1
const errorTipoDoc = document.getElementById("errorTipoDoc");
const errorNumDoc = document.getElementById("errorNumDoc");
const errorEmail = document.getElementById("errorEmail");

// Elementos de error del paso 2
const errorPassword1 = document.getElementById("errorPassword");
const errorPassword2 = document.getElementById("errorPassword2");

// Variables compartidas entre los dos pasos del formulario
let usuario = null;    // Almacena el usuario encontrado en el paso 1
let numeroDoc = null;  // Almacena el número de documento para usar en el paso 2

/**
 * Valida si una cadena tiene formato de correo electrónico válido.
 * @param {string} correo - Cadena a validar.
 * @returns {boolean} true si el formato es válido.
 */
function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

/**
 * Limpia todos los mensajes de error y los estilos de validación
 * de ambos formularios del flujo de recuperación.
 */
function limpiarErrores() {
    errorTipoDoc.textContent = "";
    errorNumDoc.textContent = "";
    errorEmail.textContent = "";
    errorPassword1.textContent = "";
    errorPassword2.textContent = "";

    tipoDocInput.classList.remove("incorrecto", "correcto");
    numeroDocInput.classList.remove("incorrecto", "correcto");
    emailInput.classList.remove("incorrecto", "correcto");
    passwordInput1.classList.remove("incorrecto", "correcto");
    passwordInput2.classList.remove("incorrecto", "correcto");
}

// Estado inicial: mostrar paso 1, ocultar paso 2
formDatos.hidden = false;
formContraseña.hidden = true;

// --- PASO 1: Verificación de identidad ---
btnRecovery.addEventListener("click", (event) => {
    event.preventDefault();
    limpiarErrores();

    // Captura de datos del formulario
    const tipoDoc = document.querySelector(".tipoDoc").value.trim();
    const numeroDocTexto = document.querySelector(".numeroDoc").value.trim();
    numeroDoc = Number(numeroDocTexto);
    const email = document.querySelector(".email").value.trim();

    let formularioEsValido = true;

    // Validación: tipo de documento obligatorio
    if (tipoDoc == "") {
        alertas.mostrarError(tipoDocInput, errorTipoDoc, "no se puede dejar espacio en blanco");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(tipoDocInput, errorTipoDoc);
    }

    // Validación: número de documento obligatorio y numérico
    if (numeroDocTexto == "") {
        alertas.mostrarError(numeroDocInput, errorNumDoc, "este espacio es obligatorio");
        formularioEsValido = false;
    } else if (isNaN(numeroDoc)) {
        alertas.mostrarError(numeroDocInput, errorNumDoc, "solo numeros en este espacio");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(numeroDocInput, errorNumDoc);
    }

    // Validación: email obligatorio y con formato válido
    if (email == "") {
        alertas.mostrarError(emailInput, errorEmail, "el email es obligatorio");
        formularioEsValido = false;
    } else if (correoValido(email)) {
        alertas.mostrarCorrecto(emailInput, errorEmail);
    } else {
        alertas.mostrarError(emailInput, errorEmail, "email invalido");
        formularioEsValido = false;
    }

    if (formularioEsValido) {
        // Buscar al usuario por número de documento
        usuario = funciones.obtenerUsuario(numeroDoc);

        if (usuario) {
            // Verificar que el email y tipo de documento coincidan con el registro
            if (usuario.email === email && usuario.tipoDoc === tipoDoc) {
                // Identidad verificada: avanzar al paso 2
                formDatos.hidden = true;
                formContraseña.hidden = false;
            } else {
                alertas.mostrarError(emailInput, errorEmail, "datos incorrectos");
            }
        } else {
            alert("usuario no encontrado");
        }
    }
});

// --- PASO 2: Cambio de contraseña ---
btnChange.addEventListener("click", (event) => {
    event.preventDefault();
    limpiarErrores();

    const password1 = document.querySelector(".password").value.trim();
    const password2 = document.querySelector(".password2").value.trim();

    let formularioEsValido = true;

    // Validaciones de contraseña
    if (password1 == "") {
        alertas.mostrarError(passwordInput1, errorPassword1, "no se puede dejar espacio en blanco");
        formularioEsValido = false;
    }
    if (password2 == "") {
        alertas.mostrarError(passwordInput2, errorPassword2, "no se puede dejar espacio en blanco");
        formularioEsValido = false;
    }
    // La contraseña debe tener entre 8 y 12 caracteres
    if (password1 !== "" && (password1.length < 8 || password1.length > 12)) {
        alertas.mostrarError(passwordInput1, errorPassword1, "minimo 8 caracteres y maximo 12 caracteres");
        formularioEsValido = false;
    }
    if (password2 !== "" && (password2.length < 8 || password2.length > 12)) {
        alertas.mostrarError(passwordInput2, errorPassword2, "minimo 8 caracteres y maximo 12 caracteres");
        formularioEsValido = false;
    }
    // Ambas contraseñas deben coincidir
    if (password1 !== "" && password2 !== "" && password1 !== password2) {
        alertas.mostrarError(passwordInput1, errorPassword1, "los dos espacios deben tener la misma contraseña");
        alertas.mostrarError(passwordInput2, errorPassword2, "los dos espacios deben tener la misma contraseña");
        formularioEsValido = false;
    }

    if (formularioEsValido) {
        let usuarios = JSON.parse(localStorage.getItem("usuarios"));
        if (!usuarios) {
            console.error("variable usuarios = null");
        } else {
            // Buscar al usuario por número de documento y actualizar su contraseña
            let indiceU = usuarios.findIndex(u => u.numeroDoc === numeroDoc);
            if (indiceU === -1) {
                alert("usuario no encontrado");
            } else {
                usuarios[indiceU].password = password1;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
                window.location.href = "../../index.html"; // Redirigir al login
            }
        }
    }
});

// Botón cancelar: volver al inicio sin guardar cambios
btnCancelar.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "../../index.html";
});
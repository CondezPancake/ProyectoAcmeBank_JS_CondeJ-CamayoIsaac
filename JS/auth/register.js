/**
 * register.js
 * Controla el formulario de registro de nuevos usuarios.
 * Valida todos los campos, construye el objeto de usuario y lo persiste en localStorage.
 * Al registrarse, se crea automáticamente una cuenta de ahorros asociada.
 */

// Importaciones de módulos del proyecto
import * as funciones from "../core/storage.js";
import * as alertas from "../ui/alerts.js";

// Botones del formulario
const btnRegistro = document.querySelector(".btnRegistrarse");
const btnCancelar = document.querySelector(".btnCancelar");

// Elementos de mensaje de error por campo
const errorTipoDoc = document.querySelector("#errorTipoDoc");
const errorNumDoc = document.querySelector("#errorNumDoc");
const errorNombres = document.querySelector("#errorNombres");
const errorApellidos = document.querySelector("#errorApellidos");
const errorGenero = document.querySelector("#errorGenero");
const errorTelefono = document.querySelector("#errorTelefono");
const errorEmail = document.querySelector("#errorEmail");
const errorDireccion = document.querySelector("#errorDireccion");
const errorCiudad = document.querySelector("#errorCiudad");
const errorPassword = document.querySelector("#errorPassword");
const errorTerminos = document.querySelector("#errorTerminos");

// Referencias a los inputs del formulario
const tipoDocInput = document.querySelector(".tipoDoc");
const numeroDocInput = document.querySelector(".numeroDoc");
const nombresInput = document.querySelector(".nombres");
const apellidosInput = document.querySelector(".apellidos");
const generoInput = document.querySelector(".genero");
const telefonoInput = document.querySelector(".numeroTel");
const emailInput = document.querySelector(".email");
const direccionInput = document.querySelector(".direccion");
const ciudadInput = document.querySelector(".ciudad");
const passwordInput = document.querySelector(".password");
const terminosInput = document.querySelector(".terminos");

/**
 * Valida si una cadena tiene formato de correo electrónico válido.
 * @param {string} correo - Cadena a validar.
 * @returns {boolean} true si el formato es válido.
 */
function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

/**
 * Limpia todos los mensajes de error y los estilos de validación del formulario.
 */
function limpiarErrores() {
    errorTipoDoc.textContent = "";
    errorNumDoc.textContent = "";
    errorNombres.textContent = "";
    errorApellidos.textContent = "";
    errorGenero.textContent = "";
    errorTelefono.textContent = "";
    errorEmail.textContent = "";
    errorDireccion.textContent = "";
    errorCiudad.textContent = "";
    errorPassword.textContent = "";
    errorTerminos.textContent = "";

    tipoDocInput.classList.remove("incorrecto", "correcto");
    numeroDocInput.classList.remove("incorrecto", "correcto");
    nombresInput.classList.remove("incorrecto", "correcto");
    apellidosInput.classList.remove("incorrecto", "correcto");
    generoInput.classList.remove("incorrecto", "correcto");
    telefonoInput.classList.remove("incorrecto", "correcto");
    emailInput.classList.remove("incorrecto", "correcto");
    direccionInput.classList.remove("incorrecto", "correcto");
    ciudadInput.classList.remove("incorrecto", "correcto");
    passwordInput.classList.remove("incorrecto", "correcto");
    terminosInput.classList.remove("incorrecto", "correcto");
}

// Evento de envío del formulario de registro
btnRegistro.addEventListener("click", (event) => {
    event.preventDefault(); // Previene el reinicio de la página

    limpiarErrores();

    // Captura de todos los valores del formulario
    const tipoDoc = document.querySelector(".tipoDoc").value;
    const numeroDocTexto = document.querySelector(".numeroDoc").value.trim();
    const numeroDoc = Number(numeroDocTexto);
    const nombres = document.querySelector(".nombres").value.trim();
    const apellidos = document.querySelector(".apellidos").value.trim();
    const genero = document.querySelector(".genero").value;
    const telefonoTexto = document.querySelector(".numeroTel").value.trim();
    const telefono = Number(telefonoTexto);
    const email = document.querySelector(".email").value.trim();
    const direccion = document.querySelector(".direccion").value.trim();
    const ciudad = document.querySelector(".ciudad").value.trim();
    const password = document.querySelector(".password").value.trim();
    const terminos = terminosInput.checked;

    let formularioEsValido = true;

    // Validación: tipo de documento obligatorio
    if (tipoDoc == "") {
        alertas.mostrarError(tipoDocInput, errorTipoDoc, "este espacio es obligatorio");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(tipoDocInput, errorTipoDoc);
    }

    // Validación: número de documento obligatorio y numérico
    if (numeroDocTexto == "") {
        alertas.mostrarError(numeroDocInput, errorNumDoc, "el numero de documento es obligatorio");
        formularioEsValido = false;
    } else if (isNaN(numeroDoc)) {
        alertas.mostrarError(numeroDocInput, errorNumDoc, "solo puede ingresar números");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(numeroDocInput, errorNumDoc);
    }

    // Validación: nombres obligatorio
    if (nombres == "") {
        alertas.mostrarError(nombresInput, errorNombres, "este es un campo necesario");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(nombresInput, errorNombres);
    }

    // Validación: apellidos obligatorio
    if (apellidos == "") {
        alertas.mostrarError(apellidosInput, errorApellidos, "este es un campo necesario");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(apellidosInput, errorApellidos);
    }

    // Validación: género obligatorio
    if (genero == "") {
        alertas.mostrarError(generoInput, errorGenero, "ingrese una opcion");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(generoInput, errorGenero);
    }

    // Validación: teléfono obligatorio, numérico y de exactamente 10 dígitos
    if (telefonoTexto == "") {
        alertas.mostrarError(telefonoInput, errorTelefono, "telefono es un espacio obligatorio");
        formularioEsValido = false;
    } else if (isNaN(telefono)) {
        alertas.mostrarError(telefonoInput, errorTelefono, "solo se pueden ingresar números");
        formularioEsValido = false;
    } else if (telefonoTexto.length != 10) {
        alertas.mostrarError(telefonoInput, errorTelefono, "invalido, 10 caracteres requeridos");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(telefonoInput, errorTelefono);
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

    // Validación: dirección obligatoria
    if (direccion == "") {
        alertas.mostrarError(direccionInput, errorDireccion, "es necesaria esta informacion");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(direccionInput, errorDireccion);
    }

    // Validación: ciudad obligatoria
    if (ciudad == "") {
        alertas.mostrarError(ciudadInput, errorCiudad, "es necesaria esta informacion");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(ciudadInput, errorCiudad);
    }

    // Validación: contraseña obligatoria y entre 8 y 12 caracteres
    if (password == "") {
        alertas.mostrarError(passwordInput, errorPassword, "no se puede dejar espacio en blanco");
        formularioEsValido = false;
    } else if (password.length < 8 || password.length > 12) {
        alertas.mostrarError(passwordInput, errorPassword, "minimo 8 caracteres y maximo 12 caracteres");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(passwordInput, errorPassword);
    }

    // Validación: aceptación de términos obligatoria
    if (!terminos) {
        alertas.mostrarError(terminosInput, errorTerminos, "obligao tiene que estar de acuerdo");
        formularioEsValido = false;
    } else {
        alertas.mostrarCorrecto(terminosInput, errorTerminos);
    }

    if (formularioEsValido) {
        // Verificar que el usuario no esté ya registrado
        const ExisteElUsuario = funciones.obtenerUsuario(numeroDoc);
        if (ExisteElUsuario) {
            alert("el usuario ya existe");
            return;
        }

        // Construir el objeto de usuario con una cuenta de ahorros generada automáticamente
        const usuario = {
            "id": Date.now() + numeroDoc,          // ID único basado en timestamp + documento
            "tipoDoc": tipoDoc,
            "numeroDoc": numeroDoc,
            "nombres": nombres,
            "apellidos": apellidos,
            "genero": genero,
            "telefono": telefono,
            "email": email,
            "direccion": direccion,
            "ciudad": ciudad,
            "password": password,
            "terminos": terminos,
            "cuenta": {
                "numCuenta": "AC" + Math.floor(Math.random() * 100000) + Date.now(), // Número único de cuenta
                "fecha": new Date().toISOString(),  // Fecha de apertura en formato ISO
                "dinero": 0.0                        // Saldo inicial en cero
            }
        };

        // Mostrar resumen del registro al usuario (provisional, puede reemplazarse con un modal)
        alert(
            "Usuario registrado con éxito\n\nResumen:\n" +
            "Tipo de Documento: " + usuario.tipoDoc + "\n" +
            "Número de Documento: " + usuario.numeroDoc + "\n" +
            "Nombres: " + usuario.nombres + "\n" +
            "Apellidos: " + usuario.apellidos + "\n" +
            "Género: " + usuario.genero + "\n" +
            "Teléfono: " + usuario.telefono + "\n" +
            "Email: " + usuario.email + "\n" +
            "Dirección: " + usuario.direccion + "\n" +
            "Ciudad: " + usuario.ciudad
        );

        // Guardar el usuario en localStorage y redirigir al login
        funciones.guardarUsuario(usuario);
        window.location.href = "index.html";
    }
});

// Botón cancelar: volver al login sin registrar
btnCancelar.addEventListener("click", () => {
    window.location.href = "index.html";
});
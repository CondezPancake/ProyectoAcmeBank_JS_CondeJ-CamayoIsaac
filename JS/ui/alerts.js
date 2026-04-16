/**
 * alerts.js
 * Funciones de interfaz de usuario para mostrar mensajes de validación y alertas.
 * Se usan en formularios para indicar campos correctos, incorrectos o notificaciones generales.
 */

/**
 * Marca un campo de formulario como incorrecto y muestra un mensaje de error.
 * @param {HTMLElement} input - El elemento input a marcar.
 * @param {HTMLElement} elementoError - El elemento donde se mostrará el mensaje de error.
 * @param {string} mensaje - Texto del mensaje de error a mostrar.
 */
export function mostrarError(input, elementoError, mensaje) {
    elementoError.textContent = mensaje;
    input.classList.add("incorrecto");
    input.classList.remove("correcto");
}

/**
 * Marca un campo de formulario como correcto y limpia cualquier mensaje de error.
 * @param {HTMLElement} input - El elemento input a marcar.
 * @param {HTMLElement} elementoError - El elemento de error a limpiar.
 */
export function mostrarCorrecto(input, elementoError) {
    elementoError.textContent = "";
    input.classList.add("correcto");
    input.classList.remove("incorrecto");
}

/**
 * Muestra en un alert nativo los datos de un usuario (usado para depuración).
 * @param {Object} usuario - Objeto del usuario a mostrar.
 */
export function mostrarUsuario(usuario) {
    alert("usuario : " + JSON.stringify(usuario));
}

/**
 * Crea y muestra una alerta flotante personalizada en la pantalla.
 * La alerta aparece con animación y desaparece automáticamente después de ~2.6 segundos.
 * Si no existe el contenedor de alertas, lo crea dinámicamente y lo agrega al body.
 * @param {string} mensaje - Texto a mostrar en la alerta.
 * @param {string} [tipo="success"] - Tipo de alerta: "success" para éxito, "error" para fallo.
 */
export function mostrarAlerta(mensaje, tipo = "success") {
    // Buscar o crear el contenedor de alertas
    let contenedor = document.querySelector(".contenedor-alertas");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.className = "contenedor-alertas";
        document.body.appendChild(contenedor);
    }

    // Crear el elemento de alerta
    const alerta = document.createElement("div");
    alerta.className = "alerta-personalizada " + tipo;
    alerta.textContent = mensaje;
    contenedor.appendChild(alerta);

    // Pequeño retraso para activar la animación CSS de entrada
    setTimeout(() => {
        alerta.classList.add("mostrar");
    }, 50);

    // Remover la alerta luego de 2.6 segundos con animación de salida
    setTimeout(() => {
        alerta.classList.remove("mostrar");
        setTimeout(() => {
            alerta.remove();
        }, 300);
    }, 2600);
}

/**
 * Muestra una alerta de error usando mostrarAlerta con tipo "error".
 * @param {string} mensaje - Texto del mensaje de error.
 */
export function mostrarErrorGeneral(mensaje) {
    mostrarAlerta(mensaje, "error");
}

/**
 * Muestra una alerta de éxito usando mostrarAlerta con tipo "success".
 * @param {string} mensaje - Texto del mensaje de éxito.
 */
export function mostrarExito(mensaje) {
    mostrarAlerta(mensaje, "success");
}
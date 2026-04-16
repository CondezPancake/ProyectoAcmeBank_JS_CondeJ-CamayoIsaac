/**
 * utils.js
 * Funciones utilitarias genéricas para lectura y escritura de datos en localStorage.
 * Sirven como abstracción básica sobre la API de almacenamiento del navegador.
 */

/**
 * Serializa y guarda un valor en localStorage bajo una clave específica.
 * @param {string} key - Nombre de la clave en localStorage.
 * @param {*} data - Dato a guardar (se convierte a JSON automáticamente).
 */
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Lee y deserializa un valor desde localStorage.
 * @param {string} key - Nombre de la clave a leer.
 * @returns {*|null} El dato almacenado, o null si la clave no existe.
 */
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
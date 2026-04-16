/**
 * session.js
 * Manejo de la sesión del usuario en el navegador usando localStorage.
 * Controla el inicio, cierre y protección de rutas autenticadas.
 */

/**
 * Guarda el objeto del usuario en localStorage bajo la clave "sessionUser".
 * @param {Object} user - Objeto con los datos del usuario autenticado.
 */
function setSession(user) {
    localStorage.setItem("sessionUser", JSON.stringify(user));
}

/**
 * Recupera el objeto del usuario almacenado en la sesión activa.
 * @returns {Object|null} El usuario en sesión, o null si no hay sesión.
 */
function getSession() {
    return JSON.parse(localStorage.getItem("sessionUser"));
}

/**
 * Cierra la sesión del usuario eliminando todas las claves relacionadas
 * de localStorage y redirige al inicio (index.html).
 */
function logout() {
    localStorage.removeItem("sessionUser");
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("acmeUser");
    window.location.href = "index.html";
}

/**
 * Protege una ruta verificando si hay una sesión activa.
 * Si no existe sesión, redirige al usuario a la página de inicio (index.html).
 * Se debe llamar al inicio de cada página que requiera autenticación.
 */
function protectRoute() {
    const user = getSession();

    if (!user) {
        window.location.href = "index.html";
    }
}

// Exposición global de las funciones para uso desde scripts no-módulo (ej. HTML inline)
window.setSession = setSession;
window.getSession = getSession;
window.logout = logout;
window.protectRoute = protectRoute;

export { setSession, getSession, logout, protectRoute };
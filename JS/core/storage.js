/**
 * storage.js
 * Capa de acceso a datos usando localStorage como base de datos del navegador.
 * Centraliza todas las operaciones de lectura y escritura de usuarios y transacciones.
 */
 
/**
 * Busca y retorna un usuario por su número de documento.
 * @param {number} documentoU - Número de documento del usuario a buscar.
 * @returns {Object|null} El usuario encontrado, o null si no existe ninguno registrado.
 */
export function obtenerUsuario(documentoU) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (!usuarios) {
        return null;
    }
 
    const usuario = usuarios.find(u => u.numeroDoc === documentoU);
    return usuario;
}
 
/**
 * Agrega un nuevo usuario al arreglo de usuarios en localStorage.
 * Si no existe el arreglo, lo inicializa antes de insertar.
 * @param {Object} usuario - Objeto con todos los datos del nuevo usuario.
 * @returns {boolean} true si la operación fue exitosa.
 */
export function guardarUsuario(usuario) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (!usuarios) {
        usuarios = [];
    }
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return true;
}
 
/**
 * Obtiene las últimas transacciones registradas.
 * - Si se provee un número de cuenta, filtra por esa cuenta y retorna las últimas 10 en orden inverso.
 * - Si no se provee número de cuenta, retorna las últimas 10 transacciones globales.
 * @param {string} [numeroCuenta] - Número de cuenta para filtrar (opcional).
 * @returns {Array} Arreglo de transacciones encontradas.
 */
export function obtenerTransacciones(numeroCuenta) {
    const transferencias = JSON.parse(localStorage.getItem("transferencias"));
    if (!transferencias) {
        return [];
    }
 
    if (!numeroCuenta) {
        return transferencias.slice(-10);
    }
 
    const tranferencia = transferencias.filter(t => t.numCuenta === numeroCuenta).slice(-10).reverse();
    return tranferencia;
}
 
/**
 * Agrega una nueva transacción al historial en localStorage.
 * @param {Object} transaccion - Objeto con los datos de la transacción a guardar.
 * @returns {boolean} true si la operación fue exitosa.
 */
export function guardarTransacciones(transaccion) {
    let transferencias = JSON.parse(localStorage.getItem("transferencias"));
    if (!transferencias) {
        transferencias = [];
    }
    transferencias.push(transaccion);
    localStorage.setItem("transferencias", JSON.stringify(transferencias));
    return true;
}
 
/**
 * Actualiza los datos de un usuario existente en el arreglo de usuarios.
 * Si el usuario no existe en el arreglo, lo agrega como nuevo.
 * También sincroniza las claves de sesión activa (usuarioActivo, acmeUser, sessionUser).
 * @param {Object} usuarioActualizado - Objeto con los datos actualizados del usuario.
 * @returns {boolean} true si la operación fue exitosa.
 */
export function actualizarUsuario(usuarioActualizado) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (!usuarios) {
        usuarios = [];
    }
 
    let indiceU = usuarios.findIndex(u => u.numeroDoc === usuarioActualizado.numeroDoc);
 
    if (indiceU !== -1) {
        // Reemplaza el usuario existente
        usuarios[indiceU] = usuarioActualizado;
    } else {
        // Si no existe, lo agrega
        usuarios.push(usuarioActualizado);
    }
 
    // Actualiza todas las claves de sesión en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActualizado));
    localStorage.setItem("acmeUser", JSON.stringify(usuarioActualizado));
    localStorage.setItem("sessionUser", JSON.stringify(usuarioActualizado));
    return true;
}

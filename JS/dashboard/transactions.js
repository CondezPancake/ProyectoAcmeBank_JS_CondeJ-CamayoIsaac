/**
 * transactions.js
 * Funciones para obtener y renderizar el historial de transacciones del usuario.
 * Lee los datos desde localStorage y genera la tabla HTML en el contenedor indicado.
 */

import * as funciones from "../core/storage.js";

/**
 * Obtiene las últimas transacciones asociadas a la cuenta del usuario.
 * Retorna un arreglo vacío si el usuario no tiene cuenta registrada.
 *
 * @param {Object} usuario - Objeto del usuario autenticado con datos de cuenta.
 * @returns {Array} Arreglo con las últimas transacciones de la cuenta.
 */
export function obtenerUltimasTransacciones(usuario) {
    if (!usuario || !usuario.cuenta) {
        return [];
    }

    return funciones.obtenerTransacciones(usuario.cuenta.numCuenta);
}

/**
 * Renderiza las transacciones del usuario en un contenedor HTML como tabla.
 * Si no hay transacciones, muestra un mensaje informativo.
 * Si el contenedor no existe, no hace nada.
 *
 * @param {Object} usuario - Objeto del usuario autenticado.
 * @param {HTMLElement} contenedor - Elemento del DOM donde se insertará la tabla.
 */
export function pintarTransacciones(usuario, contenedor) {
    if (!contenedor) {
        return;
    }

    const transacciones = obtenerUltimasTransacciones(usuario);

    // Si no hay transacciones, mostrar mensaje vacío
    if (transacciones.length === 0) {
        contenedor.innerHTML = '<p class="sin-movimientos">No tienes transacciones registradas todavía.</p>';
        return;
    }

    // Generar las filas de la tabla con los datos de cada transacción
    let filas = "";

    transacciones.forEach(transaccion => {
        filas += `
            <tr>
                <td>${new Date(transaccion.fecha).toLocaleDateString("es-CO")}</td>
                <td>${transaccion.numeroReferencia}</td>
                <td>${transaccion.tipoTransaccion}</td>
                <td>${transaccion.concepto}</td>
                <td>$${Number(transaccion.valor).toLocaleString("es-CO")}</td>
            </tr>
        `;
    });

    // Insertar la tabla completa en el contenedor
    contenedor.innerHTML = `
        <div class="tabla-transacciones-wrap">
            <table class="tabla-transacciones">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Referencia</th>
                        <th>Tipo</th>
                        <th>Concepto</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        </div>
    `;
}
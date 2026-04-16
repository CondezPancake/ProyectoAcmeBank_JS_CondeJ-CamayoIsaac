/**
 * deposit.js
 * Lógica de negocio para realizar consignaciones (depósitos) en la cuenta del usuario.
 * Valida el monto, actualiza el saldo, registra la transacción y persiste los cambios.
 */

import * as funciones from "../core/storage.js";

/**
 * Realiza una consignación electrónica en la cuenta del usuario.
 * Valida que el valor sea un número positivo, suma el monto al saldo,
 * crea un registro de transacción y actualiza el usuario en localStorage.
 *
 * @param {Object} usuario - Objeto del usuario autenticado con datos de cuenta.
 * @param {string|number} valor - Monto a consignar.
 * @returns {{ ok: boolean, mensaje: string, usuario?: Object, transaccion?: Object }}
 *          Resultado de la operación. Si ok es false, solo contiene el mensaje de error.
 */
export function hacerConsignacion(usuario, valor) {
    const cantidad = Number(valor);

    // Validación: el valor debe ser un número positivo
    if (isNaN(cantidad) || cantidad <= 0) {
        return { ok: false, mensaje: "Ingresa un valor válido para consignar" };
    }

    // Sumar la cantidad al saldo actual de la cuenta
    usuario.cuenta.dinero = Number(usuario.cuenta.dinero || 0) + cantidad;

    // Construir el objeto de transacción
    const transaccion = {
        fecha: new Date().toISOString(),
        numeroReferencia: "REF" + Date.now(),       // Referencia única basada en timestamp
        tipoTransaccion: "Consignación",
        concepto: "Consignación por canal electrónico",
        valor: cantidad,
        numCuenta: usuario.cuenta.numCuenta,
        numeroDoc: usuario.numeroDoc
    };

    // Persistir la transacción y el usuario actualizado
    funciones.guardarTransacciones(transaccion);
    funciones.actualizarUsuario(usuario);

    return {
        ok: true,
        mensaje: "Consignación realizada correctamente",
        usuario,
        transaccion
    };
}
/**
 * withdraw.js
 * Lógica de negocio para realizar retiros de dinero desde la cuenta del usuario.
 * Valida el monto, verifica que haya saldo suficiente, descuenta el valor
 * y registra la transacción en el historial.
 */

import * as funciones from "../core/storage.js";

/**
 * Realiza un retiro de dinero de la cuenta del usuario.
 * Valida que el valor sea positivo y que el saldo sea suficiente,
 * luego descuenta el monto y registra la transacción en localStorage.
 *
 * @param {Object} usuario - Objeto del usuario autenticado con datos de cuenta.
 * @param {string|number} valor - Monto a retirar.
 * @returns {{ ok: boolean, mensaje: string, usuario?: Object, transaccion?: Object }}
 *          Resultado de la operación. Si ok es false, solo contiene el mensaje de error.
 */
export function hacerRetiro(usuario, valor) {
    const cantidad = Number(valor);

    // Validación: el valor debe ser un número positivo
    if (isNaN(cantidad) || cantidad <= 0) {
        return { ok: false, mensaje: "Ingresa un valor válido para retirar" };
    }

    // Validación: el saldo disponible debe ser suficiente para cubrir el retiro
    if (cantidad > Number(usuario.cuenta.dinero || 0)) {
        return { ok: false, mensaje: "Saldo insuficiente para realizar el retiro" };
    }

    // Descontar la cantidad del saldo actual de la cuenta
    usuario.cuenta.dinero = Number(usuario.cuenta.dinero || 0) - cantidad;

    // Construir el objeto de transacción
    const transaccion = {
        fecha: new Date().toISOString(),
        numeroReferencia: "REF" + Date.now(),       // Referencia única basada en timestamp
        tipoTransaccion: "Retiro",
        concepto: "Retiro de dinero",
        valor: cantidad,
        numCuenta: usuario.cuenta.numCuenta,
        numeroDoc: usuario.numeroDoc
    };

    // Persistir la transacción y el usuario actualizado
    funciones.guardarTransacciones(transaccion);
    funciones.actualizarUsuario(usuario);

    return {
        ok: true,
        mensaje: "Retiro realizado correctamente",
        usuario,
        transaccion
    };
}
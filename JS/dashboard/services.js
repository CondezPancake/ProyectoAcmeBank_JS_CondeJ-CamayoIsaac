/**
 * services.js
 * Lógica de negocio para el pago de servicios públicos desde la cuenta del usuario.
 * Valida el servicio seleccionado, la referencia, el monto y el saldo disponible,
 * luego descuenta el valor y registra la transacción.
 */

import * as funciones from "../core/storage.js";

/**
 * Realiza el pago de un servicio público desde la cuenta del usuario.
 * Valida que todos los campos estén completos, que el monto sea positivo
 * y que el saldo alcance para cubrir el pago.
 *
 * @param {Object} usuario - Objeto del usuario autenticado con datos de cuenta.
 * @param {string} servicio - Nombre del servicio a pagar (ej: "Energía", "Agua").
 * @param {string} referencia - Referencia del recibo del servicio.
 * @param {string|number} valor - Monto a pagar.
 * @returns {{ ok: boolean, mensaje: string, usuario?: Object, transaccion?: Object }}
 *          Resultado de la operación. Si ok es false, solo contiene el mensaje de error.
 */
export function pagarServicio(usuario, servicio, referencia, valor) {
    const cantidad = Number(valor);

    // Validación: debe seleccionarse un servicio
    if (servicio === "") {
        return { ok: false, mensaje: "Selecciona un servicio" };
    }

    // Validación: la referencia del servicio es obligatoria
    if (referencia.trim() === "") {
        return { ok: false, mensaje: "La referencia del servicio es obligatoria" };
    }

    // Validación: el valor debe ser un número positivo
    if (isNaN(cantidad) || cantidad <= 0) {
        return { ok: false, mensaje: "Ingresa un valor válido para el pago" };
    }

    // Validación: el saldo disponible debe ser suficiente para cubrir el pago
    if (cantidad > Number(usuario.cuenta.dinero || 0)) {
        return { ok: false, mensaje: "Saldo insuficiente para pagar este servicio" };
    }

    // Descontar el valor del pago del saldo de la cuenta
    usuario.cuenta.dinero = Number(usuario.cuenta.dinero || 0) - cantidad;

    // Construir el objeto de transacción con referencia del servicio
    const transaccion = {
        fecha: new Date().toISOString(),
        numeroReferencia: "REF" + Date.now(),           // Referencia única basada en timestamp
        tipoTransaccion: "Retiro",
        concepto: "Pago de servicio público " + servicio,
        valor: cantidad,
        referenciaServicio: referencia,                 // Referencia del recibo pagado
        numCuenta: usuario.cuenta.numCuenta,
        numeroDoc: usuario.numeroDoc
    };

    // Persistir la transacción y el usuario actualizado
    funciones.guardarTransacciones(transaccion);
    funciones.actualizarUsuario(usuario);

    return {
        ok: true,
        mensaje: "Pago de servicio realizado correctamente",
        usuario,
        transaccion
    };
}
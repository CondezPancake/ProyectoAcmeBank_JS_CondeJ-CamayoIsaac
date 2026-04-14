import * as funciones from "../core/storage.js";

export function pagarServicio(usuario, servicio, referencia, valor){
    const cantidad = Number(valor);

    if (servicio === "") {
        return { ok:false, mensaje:"Selecciona un servicio" };
    }

    if (referencia.trim() === "") {
        return { ok:false, mensaje:"La referencia del servicio es obligatoria" };
    }

    if (isNaN(cantidad) || cantidad <= 0) {
        return { ok:false, mensaje:"Ingresa un valor válido para el pago" };
    }

    if (cantidad > Number(usuario.cuenta.dinero || 0)) {
        return { ok:false, mensaje:"Saldo insuficiente para pagar este servicio" };
    }

    usuario.cuenta.dinero = Number(usuario.cuenta.dinero || 0) - cantidad;

    const transaccion = {
        fecha: new Date().toISOString(),
        numeroReferencia: "REF" + Date.now(),
        tipoTransaccion: "Retiro",
        concepto: "Pago de servicio público " + servicio,
        valor: cantidad,
        referenciaServicio: referencia,
        numCuenta: usuario.cuenta.numCuenta,
        numeroDoc: usuario.numeroDoc
    };

    funciones.guardarTransacciones(transaccion);
    funciones.actualizarUsuario(usuario);

    return {
        ok:true,
        mensaje:"Pago de servicio realizado correctamente",
        usuario,
        transaccion
    };
}

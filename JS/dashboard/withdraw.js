import * as funciones from "../core/storage.js";

export function hacerRetiro(usuario, valor){
    const cantidad = Number(valor);

    if (isNaN(cantidad) || cantidad <= 0) {
        return { ok:false, mensaje:"Ingresa un valor válido para retirar" };
    }

    if (cantidad > Number(usuario.cuenta.dinero || 0)) {
        return { ok:false, mensaje:"Saldo insuficiente para realizar el retiro" };
    }

    usuario.cuenta.dinero = Number(usuario.cuenta.dinero || 0) - cantidad;

    const transaccion = {
        fecha: new Date().toISOString(),
        numeroReferencia: "REF" + Date.now(),
        tipoTransaccion: "Retiro",
        concepto: "Retiro de dinero",
        valor: cantidad,
        numCuenta: usuario.cuenta.numCuenta,
        numeroDoc: usuario.numeroDoc
    };

    funciones.guardarTransacciones(transaccion);
    funciones.actualizarUsuario(usuario);

    return {
        ok:true,
        mensaje:"Retiro realizado correctamente",
        usuario,
        transaccion
    };
}

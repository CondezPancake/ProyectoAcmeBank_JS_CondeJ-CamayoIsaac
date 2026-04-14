import * as funciones from "../core/storage.js";

export function hacerConsignacion(usuario, valor){
    const cantidad = Number(valor);

    if (isNaN(cantidad) || cantidad <= 0) {
        return { ok:false, mensaje:"Ingresa un valor válido para consignar" };
    }

    usuario.cuenta.dinero = Number(usuario.cuenta.dinero || 0) + cantidad;

    const transaccion = {
        fecha: new Date().toISOString(),
        numeroReferencia: "REF" + Date.now(),
        tipoTransaccion: "Consignación",
        concepto: "Consignación por canal electrónico",
        valor: cantidad,
        numCuenta: usuario.cuenta.numCuenta,
        numeroDoc: usuario.numeroDoc
    };

    funciones.guardarTransacciones(transaccion);
    funciones.actualizarUsuario(usuario);

    return {
        ok:true,
        mensaje:"Consignación realizada correctamente",
        usuario,
        transaccion
    };
}

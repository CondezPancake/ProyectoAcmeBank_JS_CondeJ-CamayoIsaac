import * as funciones from "../core/storage.js";

export function obtenerUltimasTransacciones(usuario){
    if (!usuario || !usuario.cuenta) {
        return [];
    }

    return funciones.obtenerTransacciones(usuario.cuenta.numCuenta);
}

export function pintarTransacciones(usuario, contenedor){
    if (!contenedor) {
        return;
    }

    const transacciones = obtenerUltimasTransacciones(usuario);

    if (transacciones.length === 0) {
        contenedor.innerHTML = '<p class="sin-movimientos">No tienes transacciones registradas todavía.</p>';
        return;
    }

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

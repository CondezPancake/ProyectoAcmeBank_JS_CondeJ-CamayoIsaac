export function obtenerUsuario(documentoU) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (!usuarios) {
        return null
    }

    const usuario = usuarios.find(u => u.numeroDoc === documentoU);
    return usuario;
}

export function guardarUsuario(usuario) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (!usuarios) {
        usuarios = [];
    }
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return true;
}

export function obtenerTransacciones(numeroReferencia) {
    const transferencias = JSON.parse(localStorage.getItem("transferencias"));
    if (!transferencias) {
        return []
    }

    const tranferencia = transferencias.slice(-10);
    return tranferencia;
}
export function guardarTransacciones(transaccion) {
    let transferencias = JSON.parse(localStorage.getItem("transferencias"));
    if (!transferencias) {
        transferencias = [];
    }
    transferencias.push(transaccion);
    localStorage.setItem("transferencias", JSON.stringify(transferencias));
    return true;
}


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

export function obtenerTransacciones(numeroCuenta) {
    const transferencias = JSON.parse(localStorage.getItem("transferencias"));
    if (!transferencias) {
        return []
    }

    if (!numeroCuenta) {
        return transferencias.slice(-10);
    }

    const tranferencia = transferencias.filter(t => t.numCuenta === numeroCuenta).slice(-10).reverse();
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

export function actualizarUsuario(usuarioActualizado) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (!usuarios) {
        usuarios = [];
    }

    let indiceU = usuarios.findIndex(u => u.numeroDoc === usuarioActualizado.numeroDoc);

    if (indiceU !== -1) {
        usuarios[indiceU] = usuarioActualizado;
    } else {
        usuarios.push(usuarioActualizado);
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActualizado));
    localStorage.setItem("acmeUser", JSON.stringify(usuarioActualizado));
    localStorage.setItem("sessionUser", JSON.stringify(usuarioActualizado));
    return true;
}

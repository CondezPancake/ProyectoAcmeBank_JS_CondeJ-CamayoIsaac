//Funciones auxiliares para las validaciones
export function mostrarError(input,elementoError,mensaje){
    elementoError.textContent=mensaje;
    input.classList.add("incorrecto");
    input.classList.remove("correcto");
}


export function mostrarCorrecto(input,elementoError,){
    elementoError.textContent="";
    input.classList.add("correcto");
    input.classList.remove("incorrecto");
}

export function mostrarUsuario(usuario){
    alert ("usuario : " + JSON.stringify(usuario));
}

export function mostrarAlerta(mensaje,tipo="success"){
    let contenedor = document.querySelector(".contenedor-alertas");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.className = "contenedor-alertas";
        document.body.appendChild(contenedor);
    }

    const alerta = document.createElement("div");
    alerta.className = "alerta-personalizada " + tipo;
    alerta.textContent = mensaje;
    contenedor.appendChild(alerta);

    setTimeout(() => {
        alerta.classList.add("mostrar");
    }, 50);

    setTimeout(() => {
        alerta.classList.remove("mostrar");
        setTimeout(() => {
            alerta.remove();
        }, 300);
    }, 2600);
}

export function mostrarErrorGeneral(mensaje){
    mostrarAlerta(mensaje,"error");
}

export function mostrarExito(mensaje){
    mostrarAlerta(mensaje,"success");
}

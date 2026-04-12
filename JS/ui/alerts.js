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
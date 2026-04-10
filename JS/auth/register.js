//importacion de funciones desde el storage.js
import * as funciones from "../core/storage.js";

//funcion para validar correo
function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}


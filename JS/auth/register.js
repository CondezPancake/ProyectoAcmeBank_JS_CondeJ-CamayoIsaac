//importacion de funciones desde el storage.js
import * as funciones from "../core/storage.js";
import * as alertas from "../ui/alerts.js";

//acceder al boton
const btnRegistro = document.querySelector(".btnRegistrarse");
const btnCancelar = document.querySelector(".btnCancelar");

//espacios de errores
const errorTipoDoc = document.querySelector("#errorTipoDoc");
const errorNumDoc = document.querySelector("#errorNumDoc");
const errorNombres = document.querySelector("#errorNombres");
const errorApellidos = document.querySelector("#errorApellidos");
const errorGenero = document.querySelector("#errorGenero");
const errorTelefono = document.querySelector("#errorTelefono");
const errorEmail = document.querySelector("#errorEmail");
const errorDireccion = document.querySelector("#errorDireccion");
const errorCiudad = document.querySelector("#errorCiudad");
const errorPassword = document.querySelector("#errorPassword");
const errorTerminos = document.querySelector("#errorTerminos");

//inputs
const tipoDocInput = document.querySelector(".tipoDoc");
const numeroDocInput = document.querySelector(".numeroDoc");
const nombresInput = document.querySelector(".nombres");
const apellidosInput = document.querySelector(".apellidos");
const generoInput = document.querySelector(".genero");
const telefonoInput = document.querySelector(".numeroTel");
const emailInput = document.querySelector(".email");
const direccionInput = document.querySelector(".direccion");
const ciudadInput = document.querySelector(".ciudad");
const passwordInput = document.querySelector(".password");
const terminosInput = document.querySelector(".terminos");

//funcion para validar correo
function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

//funcion para limpiar todos los mensajes de error
function limpiarErrores() {
    errorTipoDoc.textContent="";
    errorNumDoc.textContent="";
    errorNombres.textContent="";
    errorApellidos.textContent="";
    errorGenero.textContent="";
    errorTelefono.textContent="";
    errorEmail.textContent="";
    errorDireccion.textContent="";
    errorCiudad.textContent="";
    errorPassword.textContent="";
    errorTerminos.textContent="";

    tipoDocInput.classList.remove("incorrecto","correcto");
    numeroDocInput.classList.remove("incorrecto","correcto");
    nombresInput.classList.remove("incorrecto","correcto");
    apellidosInput.classList.remove("incorrecto","correcto");
    generoInput.classList.remove("incorrecto","correcto");
    telefonoInput.classList.remove("incorrecto","correcto");
    emailInput.classList.remove("incorrecto","correcto");
    direccionInput.classList.remove("incorrecto","correcto");
    ciudadInput.classList.remove("incorrecto","correcto");
    passwordInput.classList.remove("incorrecto","correcto");
    terminosInput.classList.remove("incorrecto","correcto");
}

btnRegistro.addEventListener("click",(event)=>{
    //prevenir reinicio
    event.preventDefault()

    limpiarErrores();

    //toma de datos
    const tipoDoc = document.querySelector(".tipoDoc").value;
    const numeroDocTexto = document.querySelector(".numeroDoc").value.trim();
    const numeroDoc = Number(numeroDocTexto);
    const nombres = document.querySelector(".nombres").value.trim();
    const apellidos = document.querySelector(".apellidos").value.trim();
    const genero = document.querySelector(".genero").value;
    const telefonoTexto = document.querySelector(".numeroTel").value.trim();
    const telefono = Number(telefonoTexto);
    const email = document.querySelector(".email").value.trim();
    const direccion = document.querySelector(".direccion").value.trim();
    const ciudad = document.querySelector(".ciudad").value.trim();
    const password = document.querySelector(".password").value.trim();
    const terminos=terminosInput.checked;


    //validaciones
    let formularioEsValido = true;

    //tipoDoc
    if (tipoDoc=="") {
        alertas.mostrarError(tipoDocInput,errorTipoDoc,"este espacio es obligatorio");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(tipoDocInput,errorTipoDoc);
    }

    //numeroDoc
    if (numeroDocTexto=="") {
        alertas.mostrarError(numeroDocInput,errorNumDoc,"el numero de documento es obligatorio");
        formularioEsValido=false;
    }else if(isNaN(numeroDoc)){
        alertas.mostrarError(numeroDocInput,errorNumDoc,"solo puede ingresar números");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(numeroDocInput,errorNumDoc);
    }
    
    //nombres
    if (nombres=="") {
        alertas.mostrarError(nombresInput,errorNombres,"este es un campo necesario");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(nombresInput,errorNombres);
    }
    
    //apellidos
    if (apellidos=="") {
        alertas.mostrarError(apellidosInput,errorApellidos,"este es un campo necesario");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(apellidosInput,errorApellidos);
    }
    
    //genero
    if (genero=="") {
        alertas.mostrarError(generoInput,errorGenero,"ingrese una opcion");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(generoInput,errorGenero);
    }
    
    //telefono
    if (telefonoTexto=="") {
        alertas.mostrarError(telefonoInput,errorTelefono,"telefono es un espacio obligatorio");
        formularioEsValido=false;
    }else if(isNaN(telefono)){
        alertas.mostrarError(telefonoInput,errorTelefono,"solo se pueden ingresar números");
        formularioEsValido=false;
    }else if (telefonoTexto.length != 10) {
        alertas.mostrarError(telefonoInput,errorTelefono,"invalido, 10 caracteres requeridos");
        formularioEsValido=false;
    }
    else{
        alertas.mostrarCorrecto(telefonoInput,errorTelefono);
    }
    
    //email
    if (email=="") {
        alertas.mostrarError(emailInput,errorEmail,"el email es obligatorio");
        formularioEsValido=false;
    }else if(correoValido(email)){
        alertas.mostrarCorrecto(emailInput,errorEmail);
    }else{
        alertas.mostrarError(emailInput,errorEmail,"email invalido")
        formularioEsValido=false;
    }
    
    //direccion
    if (direccion=="") {
        alertas.mostrarError(direccionInput,errorDireccion,"es necesaria esta informacion");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(direccionInput,errorDireccion);
    }
    
    //ciudad
    if (ciudad=="") {
        alertas.mostrarError(ciudadInput,errorCiudad,"es necesaria esta informacion");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(ciudadInput,errorCiudad);
    }
    
    //contraseña
    if (password=="") {
        alertas.mostrarError(passwordInput,errorPassword,"no se puede dejar espacio en blanco");
        formularioEsValido=false;
    }else if (password.length<8 || password.length>12) {
        alertas.mostrarError(passwordInput,errorPassword,"minimo 8 caracteres y maximo 12 caracteres");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(passwordInput,errorPassword);
    }
    
    //terminos
    if (!terminos) {
        alertas.mostrarError(terminosInput,errorTerminos,"obligao tiene que estar de acuerdo");
        formularioEsValido=false;
    }else{
        alertas.mostrarCorrecto(terminosInput,errorTerminos);
    }

    if (formularioEsValido) {
        const ExisteElUsuario = funciones.obtenerUsuario(numeroDoc)

        if (ExisteElUsuario) {
            alert("el usuario ya existe");
            return;
        }

        const usuario={
            "id": Date.now()+numeroDoc,
            "tipoDoc" : tipoDoc,
            "numeroDoc" : numeroDoc,
            "nombres" : nombres,
            "apellidos" : apellidos,
            "genero" : genero,
            "telefono" : telefono,
            "email" : email,
            "direccion" : direccion,
            "ciudad" : ciudad,
            "password" : password,
            "terminos" : terminos,
            "cuenta":{
                "numCuenta": "AC"+Math.floor(Math.random() * 100000)+Date.now(),
                "fecha": new Date().toISOString(),
                "dinero": 0.0
            }
        };

        //mostrar resumen, se puede hacer luego con innerHTML, provisional para los requerimientos
        alertas.mostrarUsuario(usuario)
        
        funciones.guardarUsuario(usuario);
        window.location.href="index.html";
    }
})

btnCancelar.addEventListener("click",()=>{
    window.location.href = "index.html"
})

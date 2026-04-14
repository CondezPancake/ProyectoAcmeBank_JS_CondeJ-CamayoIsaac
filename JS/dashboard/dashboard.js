import { getSession, setSession, logout, protectRoute } from "../core/session.js";
import { hacerConsignacion } from "./deposit.js";
import { hacerRetiro } from "./withdraw.js";
import { pagarServicio } from "./services.js";
import { pintarTransacciones } from "./transactions.js";
import * as alertas from "../ui/alerts.js";

const notificationToggle = document.getElementById("notificationToggle");
const profileToggle = document.getElementById("profileToggle");
const notificationsPanel = document.getElementById("notificationsPanel");
const profilePanel = document.getElementById("profilePanel");
const closeNotifications = document.getElementById("closeNotifications");
const closeProfile = document.getElementById("closeProfile");
const profileForm = document.getElementById("profileForm");

const goHome = document.getElementById("goHome")
const goCuentas = document.getElementById("goCuentas");
const goSettings = document.getElementById("goSettings");
const goInicio = document.getElementById("goInicio");
const logoutBtn = document.getElementById("logoutBtn");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");

const saludoUsuario = document.getElementById("saludoUsuario");
const numeroCuentaUsuario = document.getElementById("numeroCuentaUsuario");
const saldoActualUsuario = document.getElementById("saldoActualUsuario");
const fechaCreacionUsuario = document.getElementById("fechaCreacionUsuario");

protectRoute();

let userData = getSession() || JSON.parse(localStorage.getItem("acmeUser")) || JSON.parse(localStorage.getItem("usuarioActivo"));

if (userData) {
    profileName.value = userData.nombres || userData.name || "";
    profileEmail.value = userData.email || "";
    profilePhone.value = userData.telefono || userData.phone || "";

    pintarDatosUsuario();
}

function pintarDatosUsuario(){
    if (saludoUsuario) {
        saludoUsuario.textContent = (userData.nombres || "") + " " + (userData.apellidos || "");
    }

    if (numeroCuentaUsuario && userData.cuenta) {
        numeroCuentaUsuario.textContent = userData.cuenta.numCuenta || "";
    }

    if (saldoActualUsuario && userData.cuenta) {
        saldoActualUsuario.textContent = "$" + Number(userData.cuenta.dinero || 0).toLocaleString("es-CO");
    }

    if (fechaCreacionUsuario && userData.cuenta && userData.cuenta.fecha) {
        fechaCreacionUsuario.textContent = new Date(userData.cuenta.fecha).toLocaleDateString("es-CO");
    }
}

notificationToggle.addEventListener("click", function () {
    notificationsPanel.classList.toggle("active");
    profilePanel.classList.remove("active");
});

profileToggle.addEventListener("click", function () {
    profilePanel.classList.toggle("active");
    notificationsPanel.classList.remove("active");
});

closeNotifications.addEventListener("click", function () {
    notificationsPanel.classList.remove("active");
});

closeProfile.addEventListener("click", function () {
    profilePanel.classList.remove("active");
});

profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedUser = {
        ...userData,
        name: profileName.value,
        nombres: profileName.value,
        email: profileEmail.value,
        phone: profilePhone.value,
        telefono: profilePhone.value
    };

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let indiceU = usuarios.findIndex(u => u.numeroDoc === updatedUser.numeroDoc);

    if (indiceU !== -1) {
        usuarios[indiceU] = {
            ...usuarios[indiceU],
            name: updatedUser.name,
            nombres: updatedUser.nombres,
            email: updatedUser.email,
            phone: updatedUser.phone,
            telefono: updatedUser.telefono
        };
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        userData = usuarios[indiceU];
    } else {
        userData = updatedUser;
    }

    localStorage.setItem("acmeUser", JSON.stringify(userData));
    localStorage.setItem("usuarioActivo", JSON.stringify(userData));
    setSession(userData);
    alertas.mostrarExito("Perfil actualizado");
    profilePanel.classList.remove("active");

    if (saludoUsuario) {
        saludoUsuario.textContent = (userData.nombres || "") + " " + (userData.apellidos || "");
    }
});


goHome.addEventListener("click", function (){
    window.location.href = "dashboard.html";
})

goCuentas.addEventListener("click", function () {
    window.location.href = "accounts.html";
});

goSettings.addEventListener("click", function () {
    window.location.href = "settings.html";
});

goInicio.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

logoutBtn.addEventListener("click", logout);

document.addEventListener("click", function (e) {
    if (!notificationsPanel.contains(e.target) && !notificationToggle.contains(e.target)) {
        notificationsPanel.classList.remove("active");
    }

    if (!profilePanel.contains(e.target) && !profileToggle.contains(e.target)) {
        profilePanel.classList.remove("active");
    }
});

const mainContent = document.querySelector(".main-content");
const sidebarItems = document.querySelectorAll(".sidebar li");
const cards = document.querySelectorAll(".stats-grid .card");

let seccionBancaria = null;

function crearSeccionBancaria(){
    if (seccionBancaria) {
        return;
    }

    seccionBancaria = document.createElement("section");
    seccionBancaria.className = "seccion-bancaria";
    seccionBancaria.innerHTML = `
        <div class="card modulo-bancario" id="moduloTransacciones">
            <h2>Resumen de Transacciones</h2>
            <div id="contenedorTransacciones"></div>
        </div>

        <div class="card modulo-bancario oculto" id="moduloConsignacion">
            <h2>Consignación electrónica</h2>
            <form class="form-bancario" id="formConsignacion">
                <p><strong>Número de cuenta:</strong> <span>${userData.cuenta.numCuenta}</span></p>
                <p><strong>Nombre:</strong> <span>${userData.nombres} ${userData.apellidos}</span></p>
                <label for="valorConsignacion">Cantidad a consignar</label>
                <input type="number" id="valorConsignacion" min="1" placeholder="Ingresa el valor">
                <small class="mensaje-error" id="errorConsignacion"></small>
                <button type="submit">Consignar</button>
            </form>
            <div class="resumen-transaccion oculto" id="resumenConsignacion"></div>
        </div>

        <div class="card modulo-bancario oculto" id="moduloRetiro">
            <h2>Retiro de dinero</h2>
            <form class="form-bancario" id="formRetiro">
                <p><strong>Número de cuenta:</strong> <span>${userData.cuenta.numCuenta}</span></p>
                <p><strong>Nombre:</strong> <span>${userData.nombres} ${userData.apellidos}</span></p>
                <label for="valorRetiro">Cantidad a retirar</label>
                <input type="number" id="valorRetiro" min="1" placeholder="Ingresa el valor">
                <small class="mensaje-error" id="errorRetiro"></small>
                <button type="submit">Retirar</button>
            </form>
            <div class="resumen-transaccion oculto" id="resumenRetiro"></div>
        </div>

        <div class="card modulo-bancario oculto" id="moduloServicios">
            <h2>Pago de servicios públicos</h2>
            <form class="form-bancario" id="formServicios">
                <p><strong>Número de cuenta:</strong> <span>${userData.cuenta.numCuenta}</span></p>
                <p><strong>Nombre:</strong> <span>${userData.nombres} ${userData.apellidos}</span></p>
                <label for="tipoServicio">Servicio</label>
                <select id="tipoServicio">
                    <option value="">Selecciona</option>
                    <option value="Energía">Energía</option>
                    <option value="Agua">Agua</option>
                    <option value="Gas natural">Gas natural</option>
                    <option value="Internet">Internet</option>
                </select>
                <small class="mensaje-error" id="errorServicio"></small>
                <label for="referenciaServicio">Referencia</label>
                <input type="text" id="referenciaServicio" placeholder="Ingresa la referencia">
                <small class="mensaje-error" id="errorReferenciaServicio"></small>
                <label for="valorServicio">Valor a pagar</label>
                <input type="number" id="valorServicio" min="1" placeholder="Ingresa el valor">
                <small class="mensaje-error" id="errorValorServicio"></small>
                <button type="submit">Pagar servicio</button>
            </form>
            <div class="resumen-transaccion oculto" id="resumenServicio"></div>
        </div>
    `;

    mainContent.appendChild(seccionBancaria);
    pintarTransacciones(userData, document.getElementById("contenedorTransacciones"));
    activarEventosBancarios();
}

function ocultarModulos(){
    if (!seccionBancaria) {
        return;
    }

    const modulos = seccionBancaria.querySelectorAll(".modulo-bancario");
    modulos.forEach(modulo => modulo.classList.add("oculto"));
}

function mostrarModulo(idModulo){
    crearSeccionBancaria();
    ocultarModulos();
    const modulo = document.getElementById(idModulo);
    if (modulo) {
        modulo.classList.remove("oculto");
    }
    if (idModulo === "moduloTransacciones") {
        pintarTransacciones(userData, document.getElementById("contenedorTransacciones"));
    }
}

function limpiarError(id){
    const error = document.getElementById(id);
    if (error) {
        error.textContent = "";
    }
}

function activarEventosBancarios(){
    const formConsignacion = document.getElementById("formConsignacion");
    const formRetiro = document.getElementById("formRetiro");
    const formServicios = document.getElementById("formServicios");

    formConsignacion.addEventListener("submit", function(e){
        e.preventDefault();
        limpiarError("errorConsignacion");

        const valorConsignacion = document.getElementById("valorConsignacion").value;
        const resultado = hacerConsignacion(userData, valorConsignacion);

        if (!resultado.ok) {
            document.getElementById("errorConsignacion").textContent = resultado.mensaje;
            alertas.mostrarErrorGeneral(resultado.mensaje);
            return;
        }

        userData = resultado.usuario;
        setSession(userData);
        pintarDatosUsuario();
        pintarResumen("resumenConsignacion", resultado.transaccion);
        pintarTransacciones(userData, document.getElementById("contenedorTransacciones"));
        formConsignacion.reset();
        alertas.mostrarExito(resultado.mensaje);
    });

    formRetiro.addEventListener("submit", function(e){
        e.preventDefault();
        limpiarError("errorRetiro");

        const valorRetiro = document.getElementById("valorRetiro").value;
        const resultado = hacerRetiro(userData, valorRetiro);

        if (!resultado.ok) {
            document.getElementById("errorRetiro").textContent = resultado.mensaje;
            alertas.mostrarErrorGeneral(resultado.mensaje);
            return;
        }

        userData = resultado.usuario;
        setSession(userData);
        pintarDatosUsuario();
        pintarResumen("resumenRetiro", resultado.transaccion);
        pintarTransacciones(userData, document.getElementById("contenedorTransacciones"));
        formRetiro.reset();
        alertas.mostrarExito(resultado.mensaje);
    });

    formServicios.addEventListener("submit", function(e){
        e.preventDefault();
        limpiarError("errorServicio");
        limpiarError("errorReferenciaServicio");
        limpiarError("errorValorServicio");

        const tipoServicio = document.getElementById("tipoServicio").value;
        const referenciaServicio = document.getElementById("referenciaServicio").value;
        const valorServicio = document.getElementById("valorServicio").value;
        const resultado = pagarServicio(userData, tipoServicio, referenciaServicio, valorServicio);

        if (!resultado.ok) {
            if (resultado.mensaje.includes("Selecciona")) {
                document.getElementById("errorServicio").textContent = resultado.mensaje;
            } else if (resultado.mensaje.includes("referencia")) {
                document.getElementById("errorReferenciaServicio").textContent = resultado.mensaje;
            } else {
                document.getElementById("errorValorServicio").textContent = resultado.mensaje;
            }
            alertas.mostrarErrorGeneral(resultado.mensaje);
            return;
        }

        userData = resultado.usuario;
        setSession(userData);
        pintarDatosUsuario();
        pintarResumen("resumenServicio", resultado.transaccion);
        pintarTransacciones(userData, document.getElementById("contenedorTransacciones"));
        formServicios.reset();
        alertas.mostrarExito(resultado.mensaje);
    });
}

function pintarResumen(idResumen, transaccion){
    const resumen = document.getElementById(idResumen);
    if (!resumen) {
        return;
    }

    resumen.classList.remove("oculto");
    resumen.innerHTML = `
        <h3>Resumen de la transacción</h3>
        <p><strong>Fecha:</strong> ${new Date(transaccion.fecha).toLocaleString("es-CO")}</p>
        <p><strong>Número de referencia:</strong> ${transaccion.numeroReferencia}</p>
        <p><strong>Tipo de transacción:</strong> ${transaccion.tipoTransaccion}</p>
        <p><strong>Concepto:</strong> ${transaccion.concepto}</p>
        <p><strong>Valor:</strong> $${Number(transaccion.valor).toLocaleString("es-CO")}</p>
    `;
}

crearSeccionBancaria();

document.getElementById("navTransacciones")
    .addEventListener("click", () => mostrarModulo("moduloTransacciones"));

document.getElementById("navConsignar")
    .addEventListener("click", () => mostrarModulo("moduloConsignacion"));

document.getElementById("navRetirar")
    .addEventListener("click", () => mostrarModulo("moduloRetiro"));

document.getElementById("navServicios")
    .addEventListener("click", () => mostrarModulo("moduloServicios"));

if (cards[0]) {
    cards[0].addEventListener("click", function(){
        mostrarModulo("moduloServicios");
    });
}

if (cards[1]) {
    cards[1].addEventListener("click", function(){
        mostrarModulo("moduloTransacciones");
    });
}

if (cards[2]) {
    cards[2].addEventListener("click", function(){
        mostrarModulo("moduloConsignacion");
    });
}

const params = new URLSearchParams(window.location.search);
const modulo = params.get("modulo");

if (modulo) {
    switch (modulo) {
        case "transacciones":
            mostrarModulo("moduloTransacciones");
            break;
        case "consignar":
            mostrarModulo("moduloConsignacion");
            break;
        case "retirar":
            mostrarModulo("moduloRetiro");
            break;
        case "servicios":
            mostrarModulo("moduloServicios");
            break;
    }
}
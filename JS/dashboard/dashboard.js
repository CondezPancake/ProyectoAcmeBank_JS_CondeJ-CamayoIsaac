/**
 * dashboard.js
 * Página principal de la aplicación bancaria después del login.
 * Gestiona:
 * - La barra de navegación superior (notificaciones y perfil editable).
 * - La barra lateral (sidebar) con navegación a otras páginas.
 * - Los módulos bancarios: transacciones, consignación, retiro y pago de servicios.
 * - La lectura de parámetros en la URL para abrir un módulo directamente.
 */

import { getSession, setSession, logout, protectRoute } from "../core/session.js";
import { hacerConsignacion } from "./deposit.js";
import { hacerRetiro } from "./withdraw.js";
import { pagarServicio } from "./services.js";
import { pintarTransacciones } from "./transactions.js";
import { hacerRecarga } from "./recargas.js";
import * as alertas from "../ui/alerts.js";

// --- Referencias a elementos de la barra de navegación superior ---
const notificationToggle = document.getElementById("notificationToggle");
const profileToggle = document.getElementById("profileToggle");
const notificationsPanel = document.getElementById("notificationsPanel");
const profilePanel = document.getElementById("profilePanel");
const closeNotifications = document.getElementById("closeNotifications");
const closeProfile = document.getElementById("closeProfile");
const profileForm = document.getElementById("profileForm");

// Campos editables del perfil dentro del panel
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");

// --- Referencias a elementos del sidebar ---
const goHome = document.getElementById("goHome");
const goCuentas = document.getElementById("goCuentas");
const goSettings = document.getElementById("goSettings");
const goInicio = document.getElementById("goInicio");
const logoutBtn = document.getElementById("logoutBtn");

// --- Referencias a elementos de resumen del usuario en el dashboard ---
const saludoUsuario = document.getElementById("saludoUsuario");           // Nombre del usuario
const numeroCuentaUsuario = document.getElementById("numeroCuentaUsuario"); // Número de cuenta
const saldoActualUsuario = document.getElementById("saldoActualUsuario");   // Saldo actual
const fechaCreacionUsuario = document.getElementById("fechaCreacionUsuario"); // Fecha de apertura

// Proteger la ruta: si no hay sesión, redirige al login
protectRoute();

// Obtener datos del usuario activo (sesión > acmeUser > usuarioActivo)
let userData = getSession() || JSON.parse(localStorage.getItem("acmeUser")) || JSON.parse(localStorage.getItem("usuarioActivo"));

// Inicializar panel de perfil y tarjetas del dashboard con los datos del usuario
if (userData) {
    profileName.value = userData.nombres || userData.name || "";
    profileEmail.value = userData.email || "";
    profilePhone.value = userData.telefono || userData.phone || "";

    pintarDatosUsuario();
}

/**
 * Actualiza los elementos del dashboard con la información actual del usuario:
 * nombre completo, número de cuenta, saldo y fecha de apertura de la cuenta.
 */
function pintarDatosUsuario() {
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

// --- Eventos del panel de notificaciones y perfil ---

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

// Guardar cambios del perfil del usuario
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

    // Actualizar en el arreglo de usuarios de localStorage
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

    // Sincronizar todas las claves de sesión
    localStorage.setItem("acmeUser", JSON.stringify(userData));
    localStorage.setItem("usuarioActivo", JSON.stringify(userData));
    setSession(userData);
    alertas.mostrarExito("Perfil actualizado");
    profilePanel.classList.remove("active");

    // Actualizar el nombre en el saludo del dashboard
    if (saludoUsuario) {
        saludoUsuario.textContent = (userData.nombres || "") + " " + (userData.apellidos || "");
    }
});

// --- Eventos de navegación del sidebar ---

goHome.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

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

// Cerrar paneles al hacer clic fuera de ellos
document.addEventListener("click", function (e) {
    if (!notificationsPanel.contains(e.target) && !notificationToggle.contains(e.target)) {
        notificationsPanel.classList.remove("active");
    }

    if (!profilePanel.contains(e.target) && !profileToggle.contains(e.target)) {
        profilePanel.classList.remove("active");
    }
});

// --- Módulos bancarios (sección dinámica) ---

const mainContent = document.querySelector(".main-content");
const sidebarItems = document.querySelectorAll(".sidebar li");
const cards = document.querySelectorAll(".stats-grid .card");

let seccionBancaria = null; // Referencia a la sección creada dinámicamente

/**
 * Crea la sección bancaria con los cuatro módulos (transacciones, consignación,
 * retiro y pago de servicios) e inyecta el HTML en el contenido principal.
 * Solo se ejecuta una vez; si ya existe, no hace nada.
 */
function crearSeccionBancaria() {
    if (seccionBancaria) {
        return; // Ya fue creada previamente
    }

    seccionBancaria = document.createElement("section");
    seccionBancaria.className = "seccion-bancaria";
    seccionBancaria.innerHTML = `
        <!-- Módulo: Resumen de transacciones -->
        <div class="card modulo-bancario" id="moduloTransacciones">
            <h2>Resumen de Transacciones</h2>
            <div id="contenedorTransacciones"></div>
        </div>

        <!-- Módulo: Consignación electrónica -->
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

        <!-- Módulo: Retiro de dinero -->
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

        <!-- Módulo: Pago de servicios públicos -->
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

        <!-- Módulo: Recargas telefonicas -->
        <div class="card modulo-bancario oculto" id="moduloRecargas">
            <h2>Recarga telefonica</h2>
            <form class="form-bancario" id="formRecargas">
                <p><strong>Número de cuenta:</strong> <span>${userData.cuenta.numCuenta}</span></p>
                <p><strong>Nombre:</strong> <span>${userData.nombres} ${userData.apellidos}</span></p>
                <label for="tipoOperador">Servicio</label>
                <select id="operador">
                        <option value="">Selecciona</option>
                        <option value="MovilNet">MovilNet</option>
                        <option value="Amber Phone">Amber Phone</option>
                        <option value="Dynaphone">Dynaphone</option>
                        <option value="SkyPhone">SkyPhone</option>
                </select>
                <small class="mensaje-error" id="errorOperador"></small>
                <label for="referenciaServicio">numero de telefono</label>
                <input type="number" id="numeroRecarga" placeholder="Ingresa el numero">
                <small class="mensaje-error" id="errorNumeroRecarga"></small>
                <label for="valorRecarga">Valor de la recarga</label>
                <input type="number" id="valorRecarga" min="1" placeholder="Ingresa el valor a recargar">
                <small class="mensaje-error" id="errorValorRecarga"></small>
                <button type="submit">Pagar servicio</button>
            </form>
            <div class="resumen-transaccion oculto" id="resumenRecarga"></div>
        </div>
    `;

    mainContent.appendChild(seccionBancaria);

    // Cargar transacciones iniciales en el módulo de transacciones
    pintarTransacciones(userData, document.getElementById("contenedorTransacciones"));

    // Registrar eventos de los formularios bancarios
    activarEventosBancarios();
}

/**
 * Oculta todos los módulos bancarios de la sección (agrega clase "oculto").
 * Se llama antes de mostrar un módulo específico.
 */
function ocultarModulos() {
    if (!seccionBancaria) {
        return;
    }

    const modulos = seccionBancaria.querySelectorAll(".modulo-bancario");
    modulos.forEach(modulo => modulo.classList.add("oculto"));
}

/**
 * Muestra un módulo bancario específico por su ID.
 * Crea la sección si no existe, oculta el resto de módulos y muestra el solicitado.
 * Si es el módulo de transacciones, recarga la lista actualizada.
 *
 * @param {string} idModulo - ID del módulo a mostrar (ej: "moduloConsignacion").
 */
function mostrarModulo(idModulo) {
    crearSeccionBancaria();
    ocultarModulos();
    const modulo = document.getElementById(idModulo);
    if (modulo) {
        modulo.classList.remove("oculto");
    }
    // Recargar transacciones si se abre ese módulo
    if (idModulo === "moduloTransacciones") {
        pintarTransacciones(userData, document.getElementById("contenedorTransacciones"));
    }
}

/**
 * Limpia el texto de un elemento de error por su ID.
 * @param {string} id - ID del elemento de error a limpiar.
 */
function limpiarError(id) {
    const error = document.getElementById(id);
    if (error) {
        error.textContent = "";
    }
}

/**
 * Registra los eventos submit de los tres formularios bancarios:
 * consignación, retiro y pago de servicios.
 * Llama a las funciones de lógica de negocio correspondientes y actualiza la UI.
 */
function activarEventosBancarios() {
    const formConsignacion = document.getElementById("formConsignacion");
    const formRetiro = document.getElementById("formRetiro");
    const formServicios = document.getElementById("formServicios");
    const formRecargas = document.getElementById("formServicios");

    // --- Formulario de consignación ---
    formConsignacion.addEventListener("submit", function (e) {
        e.preventDefault();
        limpiarError("errorConsignacion");

        const valorConsignacion = document.getElementById("valorConsignacion").value;
        const resultado = hacerConsignacion(userData, valorConsignacion);

        if (!resultado.ok) {
            document.getElementById("errorConsignacion").textContent = resultado.mensaje;
            alertas.mostrarErrorGeneral(resultado.mensaje);
            return;
        }

        // Actualizar estado del usuario y refrescar la UI
        userData = resultado.usuario;
        setSession(userData);
        pintarDatosUsuario();
        pintarResumen("resumenConsignacion", resultado.transaccion);
        pintarTransacciones(userData, document.getElementById("contenedorTransacciones"));
        formConsignacion.reset();
        alertas.mostrarExito(resultado.mensaje);
    });

    // --- Formulario de retiro ---
    formRetiro.addEventListener("submit", function (e) {
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

    // --- Formulario de pago de servicios ---
    formServicios.addEventListener("submit", (e) =>{
        e.preventDefault();
        limpiarError("errorServicio");
        limpiarError("errorReferenciaServicio");
        limpiarError("errorValorServicio");

        const tipoServicio = document.getElementById("tipoServicio").value;
        const referenciaServicio = document.getElementById("referenciaServicio").value;
        const valorServicio = document.getElementById("valorServicio").value;
        const resultado = pagarServicio(userData, tipoServicio, referenciaServicio, valorServicio);

        if (!resultado.ok) {
            // Mostrar el error en el campo específico según el mensaje recibido
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
    });

    // --- Formulario de pago de recargas ---
    formRecargas.addEventListener("submit", function (e) {
        e.preventDefault();
        limpiarError("errorOperador");
        limpiarError("errorNumeroRecarga");
        limpiarError("errorValorRecarga");

        const tipoOperador = document.getElementById("operador").value;
        const numeroRecarga = document.getElementById("numeroRecarga").value.trim();
        const valorRecarga = document.getElementById("valorRecarga").value.trim();
        const resultado = pagarServicio(userData, tipoOperador, numeroRecarga, valorRecarga);

        if (!resultado.ok) {
            // Mostrar el error en el campo específico según el mensaje recibido
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

/**
 * Muestra un resumen de la transacción realizada en el contenedor indicado.
 * Incluye fecha, referencia, tipo, concepto y valor de la operación.
 *
 * @param {string} idResumen - ID del elemento donde mostrar el resumen.
 * @param {Object} transaccion - Objeto de la transacción recién realizada.
 */
function pintarResumen(idResumen, transaccion) {
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

// --- Inicialización de la sección bancaria al cargar la página ---
crearSeccionBancaria();

// --- Eventos de navegación rápida del sidebar hacia módulos bancarios ---
document.getElementById("navTransacciones")
    .addEventListener("click", () => mostrarModulo("moduloTransacciones"));

document.getElementById("navConsignar")
    .addEventListener("click", () => mostrarModulo("moduloConsignacion"));

document.getElementById("navRetirar")
    .addEventListener("click", () => mostrarModulo("moduloRetiro"));

document.getElementById("navServicios")
    .addEventListener("click", () => mostrarModulo("moduloServicios"));

document.getElementById("navRecargas")
    .addEventListener("click", () => mostrarModulo("moduloRecargas"));

// --- Eventos de las tarjetas (cards) del dashboard para acceso rápido a módulos ---
if (cards[0]) {
    cards[0].addEventListener("click", function () {
        mostrarModulo("moduloServicios");
    });
}

if (cards[1]) {
    cards[1].addEventListener("click", function () {
        mostrarModulo("moduloTransacciones");
    });
}

if (cards[2]) {
    cards[2].addEventListener("click", function () {
        mostrarModulo("moduloConsignacion");
    });
}

if (cards[3]) {
    cards[3].addEventListener("click", function () {
        mostrarModulo("moduloRecargas");
    });
}

// --- Leer parámetro "modulo" de la URL para abrir un módulo directamente ---
// Ejemplo: dashboard.html?modulo=consignar abrirá el módulo de consignación al cargar
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
        case "Recargas":
            mostrarModulo("moduloRecargas");
            break;
    }
}
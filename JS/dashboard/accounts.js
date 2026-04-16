/**
 * accounts.js
 * Controla la página de cuentas del usuario.
 * Gestiona la barra de navegación superior (notificaciones y perfil),
 * la barra lateral (sidebar) y la actualización de datos del perfil.
 */

import { getSession, setSession, logout, protectRoute } from "../core/session.js";

// --- Referencias a elementos de la barra de navegación superior ---
const notificationToggle = document.getElementById("notificationToggle");   // Botón abrir panel notificaciones
const profileToggle = document.getElementById("profileToggle");             // Botón abrir panel perfil
const notificationsPanel = document.getElementById("notificationsPanel");   // Panel lateral de notificaciones
const profilePanel = document.getElementById("profilePanel");               // Panel lateral de perfil
const closeNotifications = document.getElementById("closeNotifications");   // Cerrar notificaciones
const closeProfile = document.getElementById("closeProfile");               // Cerrar perfil
const profileForm = document.getElementById("profileForm");                 // Formulario de edición de perfil

// Campos editables del perfil dentro del panel
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");

// --- Referencias a elementos de la barra lateral (sidebar) ---
const backDashboard = document.getElementById("backDashboard");
const goSettingsPage = document.getElementById("goSettings");
const logoutButton = document.getElementById("logoutBtn");
const goHome = document.getElementById("goHome");
const goCuentas = document.getElementById("goCuentas");

// Elementos que muestran la información de la cuenta en la página
const numeroCuentaUsuario = document.getElementById("numeroCuentaUsuario");
const saldoActualUsuario = document.getElementById("saldoActualUsuario");

// Proteger la ruta: redirige al login si no hay sesión activa
protectRoute();

// Obtener datos del usuario desde la sesión activa o localStorage (fallback)
let userData = getSession() || JSON.parse(localStorage.getItem("acmeUser")) || JSON.parse(localStorage.getItem("usuarioActivo"));

// --- Inicialización: poblar campos del panel de perfil y datos de cuenta ---
if (userData) {
    profileName.value = userData.nombres || userData.name || "";
    profileEmail.value = userData.email || "";
    profilePhone.value = userData.telefono || userData.phone || "";

    // Mostrar número de cuenta si el elemento existe
    if (numeroCuentaUsuario && userData.cuenta) {
        numeroCuentaUsuario.textContent = userData.cuenta.numCuenta || "";
    }

    // Mostrar saldo actual formateado en pesos colombianos
    if (saldoActualUsuario && userData.cuenta) {
        saldoActualUsuario.textContent = "$" + Number(userData.cuenta.dinero || 0).toLocaleString("es-CO");
    }
}

// --- Eventos del panel de notificaciones y perfil ---

// Abrir/cerrar panel de notificaciones (cierra el de perfil si está abierto)
notificationToggle.addEventListener("click", function () {
    notificationsPanel.classList.toggle("active");
    profilePanel.classList.remove("active");
});

// Abrir/cerrar panel de perfil (cierra el de notificaciones si está abierto)
profileToggle.addEventListener("click", function () {
    profilePanel.classList.toggle("active");
    notificationsPanel.classList.remove("active");
});

// Cerrar panel de notificaciones
closeNotifications.addEventListener("click", function () {
    notificationsPanel.classList.remove("active");
});

// Cerrar panel de perfil
closeProfile.addEventListener("click", function () {
    profilePanel.classList.remove("active");
});

// Evento de envío del formulario de actualización de perfil
profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Construir objeto actualizado con los nuevos valores del formulario
    const updatedUser = {
        ...userData,
        name: profileName.value,
        nombres: profileName.value,
        email: profileEmail.value,
        phone: profilePhone.value,
        telefono: profilePhone.value
    };

    // Actualizar el usuario en el arreglo de usuarios en localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let indiceU = usuarios.findIndex(u => u.numeroDoc === updatedUser.numeroDoc);

    if (indiceU !== -1) {
        // Actualizar solo los campos de perfil editables, sin sobreescribir el resto
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

    // Sincronizar las claves de sesión con los datos actualizados
    localStorage.setItem("acmeUser", JSON.stringify(userData));
    localStorage.setItem("usuarioActivo", JSON.stringify(userData));
    setSession(userData);
    alert("Perfil actualizado");
    profilePanel.classList.remove("active");
});

// --- Eventos de navegación del sidebar ---

goHome.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

goCuentas.addEventListener("click", function () {
    window.location.href = "accounts.html";
});

backDashboard.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

goSettingsPage.addEventListener("click", function () {
    window.location.href = "settings.html";
});

// Cerrar sesión
logoutButton.addEventListener("click", logout);

// --- Navegación rápida a módulos del dashboard desde el sidebar ---

document.getElementById("navTransacciones").addEventListener("click", () => {
    window.location.href = "dashboard.html?modulo=transacciones";
});

document.getElementById("navConsignar").addEventListener("click", () => {
    window.location.href = "dashboard.html?modulo=consignar";
});

document.getElementById("navRetirar").addEventListener("click", () => {
    window.location.href = "dashboard.html?modulo=retirar";
});

document.getElementById("navServicios").addEventListener("click", () => {
    window.location.href = "dashboard.html?modulo=servicios";
});

// --- Cerrar paneles al hacer clic fuera de ellos ---
document.addEventListener("click", function (e) {
    // Cerrar notificaciones si el clic fue fuera del panel y del botón
    if (!notificationsPanel.contains(e.target) && !notificationToggle.contains(e.target)) {
        notificationsPanel.classList.remove("active");
    }

    // Cerrar perfil si el clic fue fuera del panel y del botón
    if (!profilePanel.contains(e.target) && !profileToggle.contains(e.target)) {
        profilePanel.classList.remove("active");
    }
});
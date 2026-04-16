/**
 * settings.js
 * Controla la página de configuración del usuario.
 * Gestiona los paneles de notificaciones y perfil, la navegación del sidebar
 * y la actualización de datos personales del usuario.
 * Su estructura es equivalente a accounts.js pero aplicada a la página de ajustes.
 */

import { getSession, setSession, logout, protectRoute } from "../core/session.js";

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
const backHome = document.getElementById("backDashboard");
const accountsPage = document.getElementById("goCuentas");
const logoutSettings = document.getElementById("logoutBtn");
const goSettings = document.getElementById("goSettings");
const goHome = document.getElementById("goHome");

// Proteger la ruta: redirige al login si no hay sesión activa
protectRoute();

// Obtener datos del usuario desde la sesión activa o localStorage (fallback)
let userData = getSession() || JSON.parse(localStorage.getItem("acmeUser")) || JSON.parse(localStorage.getItem("usuarioActivo"));

// --- Inicialización: poblar campos del panel de perfil ---
if (userData) {
    profileName.value = userData.nombres || userData.name || "";
    profileEmail.value = userData.email || "";
    profilePhone.value = userData.telefono || userData.phone || "";
}

// --- Eventos del panel de notificaciones y perfil ---

// Abrir/cerrar panel de notificaciones
notificationToggle.addEventListener("click", function () {
    notificationsPanel.classList.toggle("active");
    profilePanel.classList.remove("active");
});

// Abrir/cerrar panel de perfil
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

    // Construir objeto con los nuevos valores del formulario
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
        // Actualizar solo los campos editables del perfil
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

    // Sincronizar claves de sesión con los datos actualizados
    localStorage.setItem("acmeUser", JSON.stringify(userData));
    localStorage.setItem("usuarioActivo", JSON.stringify(userData));
    setSession(userData);
    alert("Perfil actualizado");
    profilePanel.classList.remove("active");
});

// --- Eventos de navegación del sidebar ---

backHome.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

accountsPage.addEventListener("click", function () {
    window.location.href = "accounts.html";
});

// Cerrar sesión
logoutSettings.addEventListener("click", logout);

goSettings.addEventListener("click", function () {
    window.location.href = "settings.html";
});

goHome.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

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
    if (!notificationsPanel.contains(e.target) && !notificationToggle.contains(e.target)) {
        notificationsPanel.classList.remove("active");
    }

    if (!profilePanel.contains(e.target) && !profileToggle.contains(e.target)) {
        profilePanel.classList.remove("active");
    }
});
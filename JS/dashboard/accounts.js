import { getSession, setSession, logout, protectRoute } from "../core/session.js";

//--------------NAV----------------------//
const notificationToggle = document.getElementById("notificationToggle");
const profileToggle = document.getElementById("profileToggle");
const notificationsPanel = document.getElementById("notificationsPanel");
const profilePanel = document.getElementById("profilePanel");
const closeNotifications = document.getElementById("closeNotifications");
const closeProfile = document.getElementById("closeProfile");
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");

//-----------------SIDE BAR-----------------//
const backDashboard = document.getElementById("backDashboard");
const goSettingsPage = document.getElementById("goSettings");
const logoutButton = document.getElementById("logoutBtn");
const goHome = document.getElementById("goHome");
const goCuentas = document.getElementById("goCuentas")

const numeroCuentaUsuario = document.getElementById("numeroCuentaUsuario");
const saldoActualUsuario = document.getElementById("saldoActualUsuario");

protectRoute();

//---------------LOCAL STORAGE-------------------//
let userData = getSession() || JSON.parse(localStorage.getItem("acmeUser")) || JSON.parse(localStorage.getItem("usuarioActivo"));


//---------EVENTS NOTIFICATION-PROFILE-----------//
if (userData) {
    profileName.value = userData.nombres || userData.name || "";
    profileEmail.value = userData.email || "";
    profilePhone.value = userData.telefono || userData.phone || "";

    if (numeroCuentaUsuario && userData.cuenta) {
        numeroCuentaUsuario.textContent = userData.cuenta.numCuenta || "";
    }

    if (saldoActualUsuario && userData.cuenta) {
        saldoActualUsuario.textContent = "$" + Number(userData.cuenta.dinero || 0).toLocaleString("es-CO");
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
    alert("Perfil actualizado");
    profilePanel.classList.remove("active");
});


//----------------EVENTS SIDEBAR-----------------//
goHome.addEventListener("click", function() {
    window.location.href = "dashboard.html";
})

goCuentas.addEventListener("click", function() {
    window.location.href = "accounts.html";
})

backDashboard.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

goSettingsPage.addEventListener("click", function () {
    window.location.href = "settings.html";
});

logoutButton.addEventListener("click", logout);


//------------EVENT PROFILE-NOTIFICATION PANEL--------------//
document.addEventListener("click", function (e) {
    if (!notificationsPanel.contains(e.target) && !notificationToggle.contains(e.target)) {
        notificationsPanel.classList.remove("active");
    }

    if (!profilePanel.contains(e.target) && !profileToggle.contains(e.target)) {
        profilePanel.classList.remove("active");
    }
});

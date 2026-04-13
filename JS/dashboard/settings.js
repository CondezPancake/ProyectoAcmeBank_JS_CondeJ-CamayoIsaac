import { getSession, setSession, logout, protectRoute } from "../core/session.js";

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

const backHome = document.getElementById("backDashboard");
const accountsPage = document.getElementById("goCuentas");
const logoutSettings = document.getElementById("logoutBtn");
const goSettings = document.getElementById("goSettings");
const goHome = document.getElementById("goHome");

protectRoute();

//---------------LOCAL STORAGE-------------------//
let userData = getSession() || JSON.parse(localStorage.getItem("acmeUser")) || JSON.parse(localStorage.getItem("usuarioActivo"));


//---------EVENTS NOTIFICATION-PROFILE-----------//
if (userData) {
    profileName.value = userData.nombres || userData.name || "";
    profileEmail.value = userData.email || "";
    profilePhone.value = userData.telefono || userData.phone || "";
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

//---------------EVENTS SIDEBAR-------------------//

backHome.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

accountsPage.addEventListener("click", function () {
    window.location.href = "accounts.html";
});

logoutSettings.addEventListener("click", logout);

goSettings.addEventListener("click", function (){
    window.location.href = "settings.html";
})

goHome.addEventListener("click", function(){
    window.location.href = "dashboard.html";
})

//------------EVENT PROFILE-NOTIFICATION PANEL--------------//
document.addEventListener("click", function (e) {
    if (!notificationsPanel.contains(e.target) && !notificationToggle.contains(e.target)) {
        notificationsPanel.classList.remove("active");
    }

    if (!profilePanel.contains(e.target) && !profileToggle.contains(e.target)) {
        profilePanel.classList.remove("active");
    }
});

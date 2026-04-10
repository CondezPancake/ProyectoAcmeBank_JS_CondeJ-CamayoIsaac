const notificationToggle = document.getElementById("notificationToggle");
const profileToggle = document.getElementById("profileToggle");
const notificationsPanel = document.getElementById("notificationsPanel");
const profilePanel = document.getElementById("profilePanel");
const closeNotifications = document.getElementById("closeNotifications");
const closeProfile = document.getElementById("closeProfile");
const profileForm = document.getElementById("profileForm");

const goCuentas = document.getElementById("goCuentas");
const goSettings = document.getElementById("goSettings");
const goInicio = document.getElementById("goInicio");
const logoutBtn = document.getElementById("logoutBtn");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");

const userData = JSON.parse(localStorage.getItem("acmeUser"));

if (userData) {
    profileName.value = userData.name || "";
    profileEmail.value = userData.email || "";
    profilePhone.value = userData.phone || "";
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
        name: profileName.value,
        email: profileEmail.value,
        phone: profilePhone.value
    };

    localStorage.setItem("acmeUser", JSON.stringify(updatedUser));
    alert("Perfil actualizado");
    profilePanel.classList.remove("active");
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

logoutBtn.addEventListener("click", function () {
    window.location.href = "index.html";
});

document.addEventListener("click", function (e) {
    if (!notificationsPanel.contains(e.target) && !notificationToggle.contains(e.target)) {
        notificationsPanel.classList.remove("active");
    }

    if (!profilePanel.contains(e.target) && !profileToggle.contains(e.target)) {
        profilePanel.classList.remove("active");
    }
});
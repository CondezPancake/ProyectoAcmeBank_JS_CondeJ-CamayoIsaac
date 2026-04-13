//--------------NAV----------------------//
const notificationToggle = document.getElementById("notificationToggle");
const profileToggle = document.getElementById("profileToggle");
const notificationsPanel = document.getElementById("notificationsPanel");
const profilePanel = document.getElementById("profilePanel");
const closeNotifications = document.getElementById("closeNotifications");
const closeProfile = document.getElementById("closeProfile");
const profileForm = document.getElementById("profileForm");

//-----------------SIDE BAR-----------------//
const backDashboard = document.getElementById("backDashboard");
const goSettingsPage = document.getElementById("goSettings");
const logoutButton = document.getElementById("logoutBtn");
const goHome = document.getElementById("goHome");
const goCuentas = document.getElementById("goCuentas")


//---------------LOCAL STORAGE-------------------//
const userData = JSON.parse(localStorage.getItem("acmeUser"));


//---------EVENTS NOTIFICATION-PROFILE-----------//
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

logoutButton.addEventListener("click", function () {
    window.location.href = "index.html";
});


//------------EVENT PROFILE-NOTIFICATION PANEL--------------//
document.addEventListener("click", function (e) {
    if (!notificationsPanel.contains(e.target) && !notificationToggle.contains(e.target)) {
        notificationsPanel.classList.remove("active");
    }

    if (!profilePanel.contains(e.target) && !profileToggle.contains(e.target)) {
        profilePanel.classList.remove("active");
    }
});
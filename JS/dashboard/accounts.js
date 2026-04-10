const backDashboard = document.getElementById("backDashboard");
const goSettingsPage = document.getElementById("goSettings");
const logoutButton = document.getElementById("logoutBtn");

backDashboard.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

goSettingsPage.addEventListener("click", function () {
    window.location.href = "settings.html";
});

logoutButton.addEventListener("click", function () {
    window.location.href = "index.html";
});
const backHome = document.getElementById("backDashboard");
const accountsPage = document.getElementById("goCuentas");
const logoutSettings = document.getElementById("logoutBtn");

backHome.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});

accountsPage.addEventListener("click", function () {
    window.location.href = "cuentas.html";
});

logoutSettings.addEventListener("click", function () {
    window.location.href = "index.html";
});
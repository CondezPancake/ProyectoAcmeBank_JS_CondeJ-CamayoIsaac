function setSession(user) {
    localStorage.setItem("sessionUser", JSON.stringify(user));
}

function getSession() {
    return JSON.parse(localStorage.getItem("sessionUser"));
}

function logout() {
    localStorage.removeItem("sessionUser");
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("acmeUser");
    window.location.href = "index.html";
}

function protectRoute() {
    const user = getSession();

    if (!user) {
        window.location.href = "index.html";
    }
}

window.setSession = setSession;
window.getSession = getSession;
window.logout = logout;
window.protectRoute = protectRoute;

export { setSession, getSession, logout, protectRoute };

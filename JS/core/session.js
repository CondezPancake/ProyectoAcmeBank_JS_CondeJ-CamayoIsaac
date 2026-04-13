export function setSession(user) {
    localStorage.setItem("sessionUser", JSON.stringify(user));
}

export function getSession() {
    return JSON.parse(localStorage.getItem("sessionUser"));
}

export function logout() {
    localStorage.removeItem("sessionUser");
    window.location.href = "../../index.html";
}

export function protectRoute() {
    const user = getSession();

    if (!user) {
        window.location.href = "../../index.html";
    }
}
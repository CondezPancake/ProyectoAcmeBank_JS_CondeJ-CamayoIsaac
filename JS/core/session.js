const currentUser = {
    name: "Usuario Acme",
    email: "usuario@acmebank.com",
    phone: "3000000000"
};

if (!localStorage.getItem("acmeUser")) {
    localStorage.setItem("acmeUser", JSON.stringify(currentUser));
}
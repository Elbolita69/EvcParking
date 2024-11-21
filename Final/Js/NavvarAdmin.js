document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));

    if (usuarioLogueado && usuarioLogueado.role === "admin") {
        const navbarNav = document.querySelector("#navbarNav .navbar-nav");

        if (navbarNav) {

            const adminNavItem = document.createElement("li");
            adminNavItem.classList.add("nav-item");
            adminNavItem.innerHTML = `
                <a class="nav-link" href="./admin.html">Admin</a>
            `;

            
            const parkingNavItem = navbarNav.querySelector("a[href='./Parking.html']").parentElement;
            parkingNavItem.insertAdjacentElement("afterend", adminNavItem);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));

    if (usuarioLogueado && usuarioLogueado.role === "admin") {
        const navbarNav = document.querySelector("#navbarNav .navbar-nav");

        if (navbarNav) {

            const adminNavItem = document.createElement("li");
            adminNavItem.classList.add("nav-item");
            adminNavItem.innerHTML = `
                <a class="nav-link" href="http://127.0.0.1:5000/">Cámaras</a>
            `;

            
            const parkingNavItem = navbarNav.querySelector("a[href='./Parking.html']").parentElement;
            parkingNavItem.insertAdjacentElement("afterend", adminNavItem);
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));

    if (usuarioLogueado && usuarioLogueado.role === "admin") {
        const navbarNav = document.querySelector("#navbarNav .navbar-nav");

        if (navbarNav) {
            // Crear los nuevos elementos de navegación para el admin
            const adminNavItems = [
                {
                    href: "./admin.html",
                    text: "Admin"
                },
                {
                    href: "/EvcParking/Lector_PlacasIA/templates/index.html",
                    text: "Cámaras"
                },
                {
                    href: "./graficas.html",
                    text: "Gráficas"
                }
            ];

            // Agregar los nuevos elementos de navegación
            adminNavItems.forEach(item => {
                const adminNavItem = document.createElement("li");
                adminNavItem.classList.add("nav-item");
                adminNavItem.innerHTML = `<a class="nav-link" href="${item.href}">${item.text}</a>`;
                const parkingNavItem = navbarNav.querySelector("a[href='./Parking.html']").parentElement;
                parkingNavItem.insertAdjacentElement("afterend", adminNavItem);
            });

            // Eliminar el enlace de Faq.html si está presente en el navbar
            const faqNavItem = navbarNav.querySelector("a[href='./Faq.html']");
            if (faqNavItem) {
                faqNavItem.parentElement.remove();  // Elimina el elemento de la lista
            }
        }
    }
});

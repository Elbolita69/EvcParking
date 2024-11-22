function verificarAccesoUsuario() {
    // Obtiene el usuario logueado del localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));
    
    // Verifica si el usuario está logueado y si tiene el rol 'regular' o 'admin'
    if (!usuarioLogueado || (usuarioLogueado.role !== "regular" && usuarioLogueado.role !== "admin")) {
        // Si no está logueado o no tiene rol 'regular' ni 'admin', mostramos la modal
        const modal = new bootstrap.Modal(document.getElementById('accessDeniedModal'));
        modal.show();

        // Redirigir al login cuando el usuario haga clic en "Ir al Login"
        const redirectLoginBtn = document.getElementById('redirectLoginBtn');
        redirectLoginBtn.addEventListener('click', () => {
            window.location.href = "/Final/Html/login.html";
        });

        // Evitar que el usuario cierre la modal haciendo clic en la "X" o el botón de "Cerrar"
        const modalElement = document.getElementById('accessDeniedModal');
        modalElement.addEventListener('hidden.bs.modal', (event) => {
            // Redirigir al login siempre que se cierre la modal
            window.location.href = "/Final/Html/login.html";
        });
    }
}

verificarAccesoUsuario();

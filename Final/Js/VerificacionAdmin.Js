function verificarAccesoAdmin() {
    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (!usuarioLogueado || usuarioLogueado.role !== "admin") {
        mostrarModalAccesoDenegado();
    }
}

function mostrarModalAccesoDenegado() {
    // Obtén la modal ya presente en el HTML
    const modal = new bootstrap.Modal(document.getElementById('accesoDenegadoModal'));
    
    // Muestra la modal usando Bootstrap
    modal.show();

    // Redirigir después de 2 segundos
    setTimeout(function() {
        window.location.href = "/Final/Html/Inicio.html";  // Redirige al inicio
    }, 2000); // Espera 2 segundos antes de redirigir

    // Eliminamos la modal después de cerrarla
    document.getElementById('cerrarModalBtn').addEventListener('click', function() {
        // No es necesario eliminarla porque ya está en el HTML
        document.getElementById('accesoDenegadoModal').remove();
    });
}

verificarAccesoAdmin();

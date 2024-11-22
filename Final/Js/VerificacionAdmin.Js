function verificarAccesoAdmin() {
    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (!usuarioLogueado || usuarioLogueado.role !== "admin") {
        mostrarModalAccesoDenegado();
    }
}

function mostrarModalAccesoDenegado() {
    const modalHTML = `
        <div class="modal fade" id="accesoDenegadoModal" tabindex="-1" aria-labelledby="accesoDenegadoModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="accesoDenegadoModalLabel">Acceso Denegado</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Solo los administradores tienen acceso a esta página. Redirigiendo...</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal" id="cerrarModalBtn">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insertamos la modal en el cuerpo del documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostramos la modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('accesoDenegadoModal'));
    modal.show();

    // Redirigir después de 2 segundos
    setTimeout(function() {
        window.location.href = "/Final/Html/Inicio.html";  // Redirige al inicio
    }, 2000); // Espera 2 segundos antes de redirigir

    // Eliminamos la modal después de cerrarla
    document.getElementById('cerrarModalBtn').addEventListener('click', function() {
        document.getElementById('accesoDenegadoModal').remove();
    });
}

verificarAccesoAdmin();

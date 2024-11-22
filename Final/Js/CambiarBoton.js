function verificarEstadoSesion() {
    const loginBtn = document.getElementById("loginBtn");
    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));

    if (usuarioLogueado) {
        loginBtn.textContent = "Cerrar Sesión";
        loginBtn.href = "#"; 
        loginBtn.addEventListener("click", function(event) {
            event.preventDefault(); 
            cerrarSesion(); 
        });
    } else {
        loginBtn.textContent = "Login";
        loginBtn.href = "./Login.html"; 
    }
}

function cerrarSesion() {
    localStorage.removeItem("loggedInUser");

    // Mostrar la modal de sesión cerrada
    const modal = new bootstrap.Modal(document.getElementById('sesionCerradaModal'));
    modal.show();

    // Redirigir después de un pequeño retraso (por ejemplo, 2 segundos)
    setTimeout(function() {
        window.location.href = "Login.html"; 
    }, 2000);  // 2 segundos de espera
}

document.addEventListener("DOMContentLoaded", verificarEstadoSesion);

window.onload = function() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('loggedInUser'));
    if (usuarioLogueado) {
        document.getElementById('nombreUsuario').textContent = `Hola, ${usuarioLogueado.nombre}!`;
    }
}

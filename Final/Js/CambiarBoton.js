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
    alert("Sesión cerrada correctamente.");
    window.location.href = "Login.html"; 
}

document.addEventListener("DOMContentLoaded", verificarEstadoSesion);


window.onload = function() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('loggedInUser'));
    if (usuarioLogueado) {
        document.getElementById('nombreUsuario').textContent = `Hola, ${usuarioLogueado.nombre}!`;
    }
}

//SOLO PARA EL BOT
const usuarioLogueado = JSON.parse(localStorage.getItem('loggedInUser'));
const botMessage = document.getElementById('botMessage');

if (usuarioLogueado) {
    botMessage.innerHTML = `<strong>Bot:</strong> ¡Hola, ${usuarioLogueado.nombre}! ¿Cómo estás?`;
} else {
    botMessage.innerHTML = `<strong>Bot:</strong> Este bot es solo para los usuarios de la página. Debes iniciar sesión antes de usar nuestro EVC bot.`;
}
 

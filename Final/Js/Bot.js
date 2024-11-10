const apiKey = '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'; // Reemplaza con tu clave API de OpenAI

// Verifica si el usuario tiene acceso al chatbot
function verificarAccesoChatbot() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!usuarioLogueado) {
        alert("Acceso denegado. Debes iniciar sesión.");
        window.location.href = "Login.html";
        return false;
    }
    return true;
}

// Configuración inicial al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    if (verificarAccesoChatbot()) {
        const usuarioLogueado = JSON.parse(localStorage.getItem('loggedInUser'));
        mostrarMensajeBot(`¡Hola, ${usuarioLogueado.nombre}! ¿Cómo estás?`);
    }
});

// Evento para enviar el mensaje al hacer clic en "Enviar"
document.getElementById('sendButton').addEventListener('click', async function() {
    const userInput = document.getElementById('userInput').value;
    if (userInput) {
        mostrarMensajeUsuario(userInput);  // Muestra el mensaje del usuario en el chat
        await obtenerRespuestaBot(userInput); // Llama a la API y muestra la respuesta del bot
        document.getElementById('userInput').value = ''; // Limpia el campo de entrada
    }
});

// Muestra el mensaje del usuario en el chat
function mostrarMensajeUsuario(mensaje) {
    const chatbox = document.getElementById('chatbox');
    const userMessage = document.createElement('p');
    userMessage.innerHTML = `<strong>Tú:</strong> ${mensaje}`;
    chatbox.appendChild(userMessage);
    chatbox.scrollTop = chatbox.scrollHeight; // Baja el scroll al final
}

// Muestra la respuesta del bot en el chat
// function mostrarMensajeBot(mensaje) {
//     const chatbox = document.getElementById('chatbox');
//     const botMessage = document.createElement('p');
//     botMessage.innerHTML = `<strong>Bot:</strong> ${mensaje}`;
//     chatbox.appendChild(botMessage);
//     chatbox.scrollTop = chatbox.scrollHeight; // Baja el scroll al final
// }



    // var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    // (function(){
    // var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    // s1.async=true;
    // s1.src='https://embed.tawk.to/6720244b2480f5b4f5955dce/1ibaorht5';
    // s1.charset='UTF-8';
    // s1.setAttribute('crossorigin','*');
    // s0.parentNode.insertBefore(s1,s0);
    // })();
    
    
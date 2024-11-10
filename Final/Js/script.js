const formLogin = document.getElementById('form_login');
const formRegister = document.getElementById('form_register');
const btnSubmitLogin = document.getElementById('btn__submit-login');
const btnSubmitRegister = document.getElementById('btn__submit-register');

document.getElementById('btn__registrarse').addEventListener('click', function () {
    formLogin.classList.add('d-none');
    formRegister.classList.remove('d-none');
});

document.getElementById('btn__iniciar-sesion').addEventListener('click', function () {
    formRegister.classList.add('d-none');
    formLogin.classList.remove('d-none');
});

let data = {
    usuarios: JSON.parse(localStorage.getItem('usuarios')) || [],
    mensajes: {
        registroExitoso: "¡Registro exitoso! Ahora puedes iniciar sesión.",
        correoYaRegistrado: "Este correo ya está registrado",
        inicioSesionExitoso: "¡Inicio de sesión exitoso!",
        correoOContrasenaIncorrectos: "Correo o contraseña incorrectos"
    }
};

if (!data.usuarios.some(user => user.email === 'admin')) {
    data.usuarios.push({
        nombre: 'Administrador',
        email: 'admin',
        usuario: 'admin',
        password: 'admin',
        role: 'admin'
    });
    localStorage.setItem('usuarios', JSON.stringify(data.usuarios));
}

function register() {
    const nombre = document.getElementById('register_nombre').value;
    const email = document.getElementById('register_email').value;
    const usuario = document.getElementById('register_usuario').value;
    const password = document.getElementById('register_password').value;

    if (!nombre || !email || !usuario || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const usuarioExistente = data.usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        alert(data.mensajes.correoYaRegistrado);
        return;
    }

    const nuevoUsuario = { nombre, email, usuario, password, role: 'regular' };
    data.usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(data.usuarios));

    alert(data.mensajes.registroExitoso);
    formRegister.reset();
    formRegister.classList.add('d-none');
    formLogin.classList.remove('d-none');
}

function iniciarSesion() {
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    const usuarioExistente = data.usuarios.find(u => u.email === email && u.password === password);

    if (usuarioExistente) {
        alert(data.mensajes.inicioSesionExitoso);
        localStorage.setItem('loggedInUser', JSON.stringify(usuarioExistente));

        if (usuarioExistente.role === 'admin') {
            window.location.href = "admin.html";
        } else {
            window.location.href = "Parking.html";
        }
    } else {
        alert(data.mensajes.correoOContrasenaIncorrectos);
    }
}

btnSubmitRegister.addEventListener('click', register);
btnSubmitLogin.addEventListener('click', iniciarSesion);

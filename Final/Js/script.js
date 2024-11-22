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

// Si no existe un administrador en los usuarios, agregar uno
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
        showModal('error', "Por favor, completa todos los campos.");
        return;
    }

    const usuarioExistente = data.usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        showModal('error', data.mensajes.correoYaRegistrado);
        return;
    }

    const nuevoUsuario = { nombre, email, usuario, password, role: 'regular' };
    data.usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(data.usuarios));

    showModal('success', data.mensajes.registroExitoso);
    formRegister.reset();
    formRegister.classList.add('d-none');
    formLogin.classList.remove('d-none');
}

function iniciarSesion() {
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    // Buscar el usuario con el correo y la contraseña proporcionados
    const usuarioExistente = data.usuarios.find(u => u.email === email && u.password === password);

    if (usuarioExistente) {
        showModal('success', data.mensajes.inicioSesionExitoso);
        localStorage.setItem('loggedInUser', JSON.stringify(usuarioExistente));

        // Redirigir según el rol del usuario
        if (usuarioExistente.role === 'admin') {
            setTimeout(() => {
                window.location.href = "admin.html"; // Redirige a la página de administración
            }, 2000);
        } else {
            setTimeout(() => {
                window.location.href = "inicio.html"; // Redirige a la página de inicio
            }, 2000);
        }
    } else {
        // Si no existe el usuario, mostrar el error de "Correo o Contraseña Incorrectos"
        showModal('error', data.mensajes.correoOContrasenaIncorrectos);
    }
}

btnSubmitRegister.addEventListener('click', register);
btnSubmitLogin.addEventListener('click', iniciarSesion);

// Función para mostrar la modal adecuada
function showModal(tipo, mensaje) {
    let modalId = '';
    let modalTitle = '';
    
    // Determinar qué modal mostrar según el tipo de mensaje
    if (tipo === 'success') {
        modalId = 'registroExitosoModal';
        modalTitle = '¡Éxito!';
    } else if (tipo === 'error') {
        // Cambiar el modal de error dependiendo del tipo de error
        if (mensaje === data.mensajes.correoYaRegistrado) {
            modalId = 'correoYaRegistradoModal';
            modalTitle = '¡Error!';
        } else {
            modalId = 'correoContraseñaIncorrectosModal';
            modalTitle = '¡Error!';
        }
    }

    // Mostrar la modal correspondiente
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    document.getElementById(modalId).querySelector('.modal-body p').textContent = mensaje;
    modal.show();

    // Si es un registro exitoso, configurar el botón para redirigir al login
    // if (modalId === 'registroExitosoModal') {
    //     const goToLoginBtn = document.getElementById('goToLoginBtn');
    //     goToLoginBtn.addEventListener('click', () => {
    //         window.location.href = "/Final/Html/login.html";
    //     });
    // }
}

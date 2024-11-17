// Verificar acceso de administrador
function verificarAccesoAdmin() {
    const usuarioLogueado = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!usuarioLogueado || usuarioLogueado.role !== "admin") {
        alert("Acceso denegado. Solo administradores pueden acceder.");
        window.location.href = "index.html";
    }
}

// Cargar lista de usuarios
function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const userList = document.getElementById("userList");

    userList.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = "Lista de Usuarios";
    userList.appendChild(title);

    const ul = document.createElement('ul');
    ul.className = 'list-group';

    usuarios.forEach((usuario, index) => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        const userInfo = document.createElement('div');
        userInfo.innerHTML = `<strong>${usuario.nombre}</strong> - ${usuario.email} (${usuario.role})`;

        const buttonDiv = document.createElement('div');

        const btnCambiarRol = document.createElement('button');
        btnCambiarRol.className = "btn btn-sm btn-primary me-1"; 
        btnCambiarRol.textContent = "Cambiar Rol";
        btnCambiarRol.onclick = () => cambiarRol(index);

        const btnModificar = document.createElement('button');
        btnModificar.className = "btn btn-sm btn-success me-1"; 
        btnModificar.innerHTML = "✏️";
        btnModificar.onclick = () => modificarUsuario(index);

        const btnEliminar = document.createElement('button');
        btnEliminar.className = "btn btn-sm btn-danger";
        btnEliminar.innerHTML = "🗑️";
        btnEliminar.onclick = () => eliminarUsuario(index);

        buttonDiv.appendChild(btnCambiarRol);
        buttonDiv.appendChild(btnModificar);
        buttonDiv.appendChild(btnEliminar);

        li.appendChild(userInfo);
        li.appendChild(buttonDiv);

        ul.appendChild(li);
    });

    userList.appendChild(ul);
}

// Cambiar el rol de un usuario
function cambiarRol(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    usuarios[index].role = usuarios[index].role === "admin" ? "regular" : "admin";
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    cargarUsuarios();
}

// Modificar un usuario
function modificarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const usuario = usuarios[index];

    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-dialog';

    const modalInner = document.createElement('div');
    modalInner.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Modificar Usuario';
    const closeButton = document.createElement('button');
    closeButton.className = 'btn-close';
    closeButton.onclick = () => modal.remove();
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    const form = document.createElement('form');

    const nombreInput = document.createElement('input');
    nombreInput.type = 'text';
    nombreInput.value = usuario.nombre;
    nombreInput.className = 'form-control mb-2'; 
    nombreInput.placeholder = 'Nombre';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.value = usuario.email;
    emailInput.className = 'form-control mb-2'; 
    emailInput.placeholder = 'Correo';

    const rolSelect = document.createElement('select');
    rolSelect.className = 'form-select mb-2'; 
    const adminOption = document.createElement('option');
    adminOption.value = 'admin';
    adminOption.textContent = 'Admin';
    const regularOption = document.createElement('option');
    regularOption.value = 'regular';
    regularOption.textContent = 'Regular';
    rolSelect.appendChild(adminOption);
    rolSelect.appendChild(regularOption);
    rolSelect.value = usuario.role; 

    form.appendChild(nombreInput);
    form.appendChild(emailInput);
    form.appendChild(rolSelect);
    modalBody.appendChild(form);

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    const guardarButton = document.createElement('button');
    guardarButton.className = 'btn btn-primary';
    guardarButton.textContent = 'Guardar Cambios';
    guardarButton.onclick = () => {
        usuario.nombre = nombreInput.value;
        usuario.email = emailInput.value;
        usuario.role = rolSelect.value; 
        usuarios[index] = usuario; 
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        modal.remove();
        cargarUsuarios();
    };

    const cancelarButton = document.createElement('button');
    cancelarButton.className = 'btn btn-secondary';
    cancelarButton.textContent = 'Cancelar';
    cancelarButton.onclick = () => modal.remove();

    modalFooter.appendChild(guardarButton);
    modalFooter.appendChild(cancelarButton);

    modalInner.appendChild(modalHeader);
    modalInner.appendChild(modalBody);
    modalInner.appendChild(modalFooter);

    modalContent.appendChild(modalInner);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}

// Eliminar un usuario
function eliminarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    usuarios.splice(index, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    cargarUsuarios();
}

// Cargar la lista de usuarios estacionados
function loadUsers() {
    const parkedCars = JSON.parse(localStorage.getItem('parkedCars')) || {};
    const userList = document.getElementById('userList');

    userList.innerHTML = '';

    // Verificación del acceso de administrador
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedUser || loggedUser.role !== "admin") {
        alert("Acceso denegado. Solo administradores pueden acceder.");
        window.location.href = "index.html"; 
        return;
    }

    Object.entries(parkedCars).forEach(([spot, car]) => {
        const userCard = document.createElement('div');
        userCard.classList.add('card', 'mb-3');

        userCard.innerHTML = `
            <div class="card-body">
            <h5 class="card-title">${car.userName}</h5>
            <p class="card-text">Número de documento: ${car.documentNumber}</p>
            <p class="card-text">Lugar asignado: ${spot}</p>
            <p class="card-text">Placa del vehículo: ${car.plateNumber}</p> <!-- Mostrar la placa -->
            <button class="btn btn-danger" onclick="removeUser('${spot}')">Eliminar</button>
            </div>
        `;

        userList.appendChild(userCard);
    });
}

// Eliminar un usuario de estacionamiento
// Eliminar un usuario de estacionamiento
function removeUser(spot) {
    const parkedCars = JSON.parse(localStorage.getItem('parkedCars')) || {};

    if (parkedCars[spot]) {
        delete parkedCars[spot];
        localStorage.setItem('parkedCars', JSON.stringify(parkedCars));
        showConfirmationModal(spot);
    }
}

// Mostrar la modal de confirmación
function showConfirmationModal(spot) {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-dialog modal-dialog-centered';

    const modalInner = document.createElement('div');
    modalInner.className = 'modal-content rounded-4 shadow-lg';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header bg-danger text-white';
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Confirmación';
    const closeButton = document.createElement('button');
    closeButton.className = 'btn-close text-white';
    closeButton.onclick = () => modal.remove();
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = `<p class="fs-5">El lugar <strong>${spot}</strong> será borrado. ¿Deseas continuar?</p>`;

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    const yesButton = document.createElement('button');
    yesButton.className = 'btn btn-danger px-4';
    yesButton.textContent = 'Sí, borrar';
    yesButton.onclick = () => {
        modal.remove();
        // Aquí iría el código para borrar el lugar
        window.location.reload(); // Recargar la página después de la acción
    };

    const cancelButton = document.createElement('button');
    cancelButton.className = 'btn btn-secondary px-4';
    cancelButton.textContent = 'Cancelar';
    cancelButton.onclick = () => modal.remove();

    modalFooter.appendChild(yesButton);
    modalFooter.appendChild(cancelButton);

    modalInner.appendChild(modalHeader);
    modalInner.appendChild(modalBody);
    modalInner.appendChild(modalFooter);

    modalContent.appendChild(modalInner);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}





// Cargar la lista de estacionamientos disponibles
function loadParkingSpots() {
    const parkingSpots = JSON.parse(localStorage.getItem('parkingSpots')) || {};
    const estacionamientoList = document.getElementById('estacionamientoList');

    estacionamientoList.innerHTML = '';

    Object.entries(parkingSpots).forEach(([spot, status]) => {
        const spotCard = document.createElement('div');
        spotCard.classList.add('card', 'mb-3');

        spotCard.innerHTML = `
            <div class="card-body">
            <h5 class="card-title">Lugar: ${spot}</h5>
            <p class="card-text">Estado: ${status ? 'Ocupado' : 'Libre'}</p>
            </div>
        `;

        estacionamientoList.appendChild(spotCard);
    });
}

// Cerrar sesión
document.getElementById('loginBtn').addEventListener('click', function() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "Login.html"; 
});

// Ejecutar la verificación y carga de datos
document.addEventListener("DOMContentLoaded", function() {
    verificarAccesoAdmin(); 
    cargarUsuarios();
    loadUsers();
    loadParkingSpots();
});

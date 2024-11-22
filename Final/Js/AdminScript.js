

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

function cambiarRol(index) {
    
    
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    usuarios[index].role = usuarios[index].role === "admin" ? "regular" : "admin";
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    cargarUsuarios();
    
}

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

    modalFooter.appendChild(guardarButton);
    modalInner.appendChild(modalHeader);
    modalInner.appendChild(modalBody);
    modalInner.appendChild(modalFooter);
    modalContent.appendChild(modalInner);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
}

function eliminarUsuario(index) {
    
    
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    usuarios.splice(index, 1); 
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    cargarUsuarios();
    
}

 
 cargarUsuarios();
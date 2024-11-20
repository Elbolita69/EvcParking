// Selección de elementos del formulario y del lote de estacionamiento
const registrationForm = document.getElementById('registrationForm');
const parkingLot = document.getElementById('parkingLot');
const parkedCars = JSON.parse(localStorage.getItem('parkedCars')) || {}; // Obtiene los puestos ocupados de localStorage
let selectedSpot = null;
let formData = {}; // Objeto para almacenar los datos del formulario

// Desactivar la selección de puestos antes de registrar
const spots = parkingLot.getElementsByClassName('parking-spot');
for (let spot of spots) {
  spot.style.pointerEvents = 'none'; // Desactiva la selección hasta que se registre
}

// Actualizar el estado visual del estacionamiento
function updateParkingLot() {
  for (let spot of spots) {
    const spotId = spot.getAttribute('data-spot');
    const car = parkedCars[spotId];

    if (car) {
      spot.classList.add('bg-danger'); // Ocupa el puesto
      spot.classList.remove('bg-success'); // Desactiva la disponibilidad
      spot.textContent = `${spotId} (Ocupado)`; // Muestra el puesto como ocupado
    } else {
      spot.classList.remove('bg-danger'); // Si está libre
      spot.classList.add('bg-success');
      spot.textContent = `${spotId} (Libre)`; // Muestra el puesto como libre
    }
  }
}

// Manejo del formulario de registro
registrationForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const documentNumber = document.getElementById('documentNumber').value;
  const userName = document.getElementById('userName').value;
  const plateNumber = document.getElementById('plateNumber').value;

  // Verificar si el usuario ya ha reservado un puesto
  for (let spotId in parkedCars) {
    if (parkedCars[spotId].documentNumber === documentNumber) {
      alert("Este usuario ya ha reservado un puesto de estacionamiento.");
      return;
    }
  }

  // Validación de número de identificación solo con dígitos
  if (!/^\d+$/.test(documentNumber)) {
    document.getElementById('documentNumberError').textContent = 'El número de identificación solo debe contener dígitos.';
    return;
  } else {
    document.getElementById('documentNumberError').textContent = '';
  }

  // Validación de nombre sin números
  if (/\d/.test(userName)) {
    document.getElementById('userNameError').textContent = 'El nombre no debe contener números.';
    return;
  } else {
    document.getElementById('userNameError').textContent = '';
  }

  // Validación de placa con exactamente 6 caracteres
  if (!/^[A-Za-z0-9]{6}$/.test(plateNumber)) {
    document.getElementById('plateNumberError').textContent = 'La placa debe tener exactamente 6 caracteres alfanuméricos.';
    return;
  } else {
    document.getElementById('plateNumberError').textContent = '';
  }

  // Guardar los datos del formulario en un objeto
  formData = { documentNumber, userName, plateNumber };

  // Borrar formulario y habilitar la selección de puestos
  registrationForm.reset();
  for (let spot of spots) {
    spot.style.pointerEvents = 'auto'; // Activa la selección de puestos
  }

  // Mostrar modal de éxito
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();
});

// Manejador de eventos de click en el estacionamiento
parkingLot.addEventListener('click', function (event) {
  if (event.target.classList.contains('parking-spot') && !event.target.classList.contains('bg-danger')) {
    if (selectedSpot) {
      // Mostrar mensaje de error si ya se ha seleccionado un puesto
      document.getElementById('parkingSpotInfoModal').querySelector('.modal-body').textContent =
        "Este puesto no está disponible. Ya has seleccionado otro puesto previamente.";
      new bootstrap.Modal(document.getElementById('parkingSpotInfoModal')).show();
    } else {
      selectedSpot = event.target.getAttribute('data-spot');
      document.getElementById('parkingSpotInfoModal').querySelector('.modal-body').textContent =
        `¿Está seguro de que quiere parquearse en el puesto ${selectedSpot}?`;
      new bootstrap.Modal(document.getElementById('parkingSpotInfoModal')).show();
    }
  }
});

// Confirmación de la reserva
document.getElementById('confirmReservation').addEventListener('click', function () {
  if (selectedSpot && formData.userName && formData.documentNumber && formData.plateNumber) {
    // Guardar la información del usuario en el localStorage
    parkedCars[selectedSpot] = formData;
    localStorage.setItem('parkedCars', JSON.stringify(parkedCars));
    updateParkingLot(); // Actualiza el estado visual de los puestos
    selectedSpot = null;
    formData = {}; // Reiniciar los datos del formulario

    // Actualizar la gráfica después de la reserva
    updateParkingChart(); // Esto actualizará la gráfica circular

    // Cerrar la modal automáticamente después de confirmar
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('parkingSpotInfoModal'));
    modalInstance.hide();
  }
});


// Actualizar el estacionamiento cuando el contenido de la página se cargue
document.addEventListener("DOMContentLoaded", function () {
  updateParkingLot();
});


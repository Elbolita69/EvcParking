const registrationForm = document.getElementById('registrationForm');
const parkingLot = document.getElementById('parkingLot');
const parkedCars = JSON.parse(localStorage.getItem('parkedCars')) || {};
let selectedSpot = null;

// Desactivar la selección de puestos antes de registrar
const spots = parkingLot.getElementsByClassName('parking-spot');
for (let spot of spots) {
  spot.style.pointerEvents = 'none'; // Desactivar selección
}

function updateParkingLot() {
  for (let spot of spots) {
    const spotId = spot.getAttribute('data-spot');
    const car = parkedCars[spotId];
    
    if (car) {
      spot.classList.add('bg-danger');
      spot.classList.remove('bg-success');
      spot.textContent = `${spotId} (Ocupado)`;
    } else {
      spot.classList.remove('bg-danger');
      spot.classList.add('bg-success');
      spot.textContent = `${spotId} (Libre)`;
    }
  }
}

registrationForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const documentNumber = document.getElementById('documentNumber').value;
  const userName = document.getElementById('userName').value;
  const plateNumber = document.getElementById('plateNumber').value;
  
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

  // Borrar formulario y habilitar la selección de puestos
  registrationForm.reset();
  for (let spot of spots) {
    spot.style.pointerEvents = 'auto'; // Activar selección
  }
  
  // Mostrar modal de éxito
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();
});

// Manejador de eventos de click en el estacionamiento
parkingLot.addEventListener('click', function(event) {
  if (event.target.classList.contains('parking-spot') && !event.target.classList.contains('bg-danger')) {
    selectedSpot = event.target.getAttribute('data-spot');
    document.getElementById('parkingSpotInfoModal').querySelector('.modal-body').textContent = 
      `¿Está seguro de que quiere parquearse en el puesto ${selectedSpot}?`;
    new bootstrap.Modal(document.getElementById('parkingSpotInfoModal')).show();
  }
});

document.getElementById('confirmReservation').addEventListener('click', function() {
  if (selectedSpot) {
    parkedCars[selectedSpot] = { userName: 'Usuario', documentNumber: '123456', plateNumber: 'ABC123' };
    localStorage.setItem('parkedCars', JSON.stringify(parkedCars));
    updateParkingLot();
    selectedSpot = null;
    
    // Cerrar la modal automáticamente después de confirmar
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('parkingSpotInfoModal'));
    modalInstance.hide();
  }
});

document.addEventListener("DOMContentLoaded", function() {
  updateParkingLot();
});

const registrationForm = document.getElementById('registrationForm');
const parkingLot = document.getElementById('parkingLot');
const parkedCars = JSON.parse(localStorage.getItem('parkedCars')) || {};
let selectedSpot = null;

function updateParkingLot() {
  const spots = parkingLot.getElementsByClassName('parking-spot');
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

  if (!selectedSpot) {
    new bootstrap.Modal(document.getElementById('parkingSpotInfoModal')).show();
    return;
  }

  if (parkedCars[selectedSpot]) {
    alert('El puesto de estacionamiento ya está ocupado.');
  } else {
    parkedCars[selectedSpot] = { userName, documentNumber, plateNumber };
    localStorage.setItem('parkedCars', JSON.stringify(parkedCars));
    updateParkingLot();
    selectedSpot = null;
  }
});

document.getElementById('parkingLot').addEventListener('click', function(event) {
  if (event.target.classList.contains('parking-spot') && !event.target.classList.contains('bg-danger')) {
    selectedSpot = event.target.getAttribute('data-spot');
  }
});

document.getElementById('confirmReservation').addEventListener('click', function() {
  if (selectedSpot) {
    parkedCars[selectedSpot] = { userName: 'Usuario', documentNumber: '123456', plateNumber: 'ABC123' };
    localStorage.setItem('parkedCars', JSON.stringify(parkedCars));
    updateParkingLot();
    new bootstrap.Modal(document.getElementById('parkingSpotInfoModal')).hide();
  }
});

document.addEventListener("DOMContentLoaded", function() {
  updateParkingLot();
});

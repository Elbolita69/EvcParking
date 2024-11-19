const authToken = "JKYtkSfclE-QZRUtTj8OloflzqbduptZ";
let sensors = ["V0", "V1", "V2", "V3"];
let reservedSpaces = JSON.parse(localStorage.getItem("reservedSpaces")) || {};
let availableSpaces = 0;

async function getSensorData() {
    const data = {};
    availableSpaces = 0;

    for (let i = 0; i < sensors.length; i++) {
        const response = await fetch(`https://blynk.cloud/external/api/get?token=${authToken}&pin=${sensors[i]}`);
        const value = await response.text();
        data[sensors[i]] = value.trim();

        const statusElement = document.getElementById(`sensor${i + 1}`);
        const buttonElement = document.getElementById(`reserveButton${i + 1}`);
        const cancelButtonElement = document.getElementById(`cancelButton${i + 1}`);

        if (reservedSpaces[sensors[i]]) {
            statusElement.innerText = "Reservado";
            statusElement.className = "reserved";
            buttonElement.disabled = true;
            cancelButtonElement.style.display = "inline-block";
        } else if (data[sensors[i]] === "1") {
            statusElement.innerText = "Disponible";
            statusElement.className = "available";
            buttonElement.disabled = false;
            cancelButtonElement.style.display = "none";
            availableSpaces++;
        } else {
            statusElement.innerText = "Ocupado";
            statusElement.className = "occupied";
            buttonElement.disabled = true;
            cancelButtonElement.style.display = "none";
        }
    }

    document.getElementById('availableSpaces').innerText = `Espacios disponibles: ${availableSpaces}`;
}

function openReservationForm(sensorIndex) {
    document.getElementById('reserveForm').reset();
    document.getElementById('sensorToReserve').value = sensorIndex;
    const modal = new bootstrap.Modal(document.getElementById('reservationModal'));
    modal.show();
}

async function reserveSpace() {
    const sensorIndex = document.getElementById('sensorToReserve').value;
    const sensorKey = sensors[sensorIndex];
    const name = document.getElementById('name').value;
    const plate = document.getElementById('plate').value;

    if (!name || !plate) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    reservedSpaces[sensorKey] = { name, plate };
    localStorage.setItem("reservedSpaces", JSON.stringify(reservedSpaces));
    await fetch(`https://blynk.cloud/external/api/update?token=${authToken}&pin=${sensorKey}&value=0`);
    const modal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
    modal.hide();
    getSensorData();
}

async function cancelReservation(sensorIndex) {
    const sensorKey = sensors[sensorIndex];

    if (confirm(`¿Deseas cancelar la reserva del espacio ${sensorIndex + 1}?`)) {
        delete reservedSpaces[sensorKey];
        localStorage.setItem("reservedSpaces", JSON.stringify(reservedSpaces));
        await fetch(`https://blynk.cloud/external/api/update?token=${authToken}&pin=${sensorKey}&value=1`);
        getSensorData();
    }
}

setInterval(getSensorData, 2000);

const renderSpaces = () => {
    const container = document.getElementById('spacesContainer');
    container.innerHTML = '';
    for (let i = 0; i < sensors.length; i++) {
        container.innerHTML += `
            <div class="col-md-6 mb-4">
                <div class="card sensor-card">
                    <div class="card-header text-center">Espacio ${i + 1}</div>
                    <div class="card-body text-center">
                        <p id="sensor${i + 1}" class="available">Disponible</p>
                        <button id="reserveButton${i + 1}" class="btn btn-primary mt-2" onclick="openReservationForm(${i})">Reservar</button>
                        <button id="cancelButton${i + 1}" class="btn btn-danger mt-2" onclick="cancelReservation(${i})" style="display: none;">Cancelar Reserva</button>
                    </div>
                </div>
            </div>
        `;
    }
};

renderSpaces();

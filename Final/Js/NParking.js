const authToken = "igJkzHvuKQ9nlkp6ncgfnZ0ntiUcYWFq";
let sensors = ["V0", "V1", "V2", "V3"];
let reservedSpaces = JSON.parse(localStorage.getItem("reservedSpaces")) || {};
let availableSpaces = 0;

async function getSensorData() {
    const data = {};
    availableSpaces = 0;

    try {
        for (let i = 0; i < sensors.length; i++) {
            const response = await fetch(`https://blynk.cloud/external/api/get?token=${authToken}&pin=${sensors[i]}`);
            const value = await response.text();
            data[sensors[i]] = value.trim();

            const statusElement = document.getElementById(`sensor${i + 1}`);
            const buttonElement = document.getElementById(`reserveButton${i + 1}`);
            const cancelButtonElement = document.getElementById(`cancelButton${i + 1}`);
            const reservedInfoElement = document.getElementById(`reservedInfo${i + 1}`);

            // Verifica que los elementos existan antes de intentar modificarlos
            if (statusElement && buttonElement && cancelButtonElement && reservedInfoElement) {
                if (reservedSpaces[sensors[i]]) {
                    statusElement.innerText = "Reservado";
                    statusElement.className = "reserved";
                    buttonElement.disabled = true;
                    cancelButtonElement.style.display = "inline-block";
                    reservedInfoElement.innerHTML = `
                        <strong>Nombre:</strong> ${reservedSpaces[sensors[i]].name}<br>
                        <strong>Placa:</strong> ${reservedSpaces[sensors[i]].plate}
                    `;
                } else if (data[sensors[i]] === "1") {
                    statusElement.innerText = "Disponible";
                    statusElement.className = "available";
                    buttonElement.disabled = false;
                    cancelButtonElement.style.display = "none";
                    reservedInfoElement.innerHTML = '';
                    availableSpaces++;
                } else {
                    statusElement.innerText = "Ocupado";
                    statusElement.className = "occupied";
                    buttonElement.disabled = true;
                    cancelButtonElement.style.display = "none";
                    reservedInfoElement.innerHTML = '';
                }
            }
        }

        const availableSpacesElement = document.getElementById('availableSpaces');
        if (availableSpacesElement) {
            availableSpacesElement.innerText = `Espacios disponibles: ${availableSpaces}`;
        }
    } catch (error) {
        console.error('Error al obtener los datos de los sensores:', error);
    }
}

function openReservationForm(sensorIndex) {
    const reserveForm = document.getElementById('reserveForm');
    const sensorToReserve = document.getElementById('sensorToReserve');
    if (reserveForm && sensorToReserve) {
        reserveForm.reset();
        sensorToReserve.value = sensorIndex;  // Asignamos el índice del sensor
        const modal = new bootstrap.Modal(document.getElementById('reservationModal'));
        modal.show();
    }
}

async function reserveSpace() {
    const sensorIndex = document.getElementById('sensorToReserve').value;

    // Verificamos que sensorIndex no sea nulo o indefinido
    if (sensorIndex === null || sensorIndex === undefined) {
        alert("Hubo un error al intentar obtener el sensor.");
        return;
    }

    // Verificamos que el índice sea válido (no fuera del rango de los sensores)
    const sensorKey = sensors[sensorIndex];
    if (!sensorKey) {
        alert("Sensor no encontrado.");
        return;
    }

    const name = document.getElementById('name').value;
    const plate = document.getElementById('plate').value;

    if (!name || !plate) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    reservedSpaces[sensorKey] = { name, plate };
    localStorage.setItem("reservedSpaces", JSON.stringify(reservedSpaces));

    try {
        const response = await fetch(`https://blynk.cloud/external/api/update?token=${authToken}&pin=${sensorKey}&value=0`);
        console.log('Reserva exitosa:', await response.text());
    } catch (error) {
        console.error('Error al reservar el espacio:', error);
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
    modal.hide();

    getSensorData(); // Actualizamos la información del sensor
}

async function cancelReservation(sensorIndex) {
    const sensorKey = sensors[sensorIndex];

    if (confirm(`¿Deseas cancelar la reserva del espacio ${sensorIndex + 1}?`)) {
        delete reservedSpaces[sensorKey];
        localStorage.setItem("reservedSpaces", JSON.stringify(reservedSpaces));
        try {
            await fetch(`https://blynk.cloud/external/api/update?token=${authToken}&pin=${sensorKey}&value=1`);
        } catch (error) {
            console.error('Error al cancelar la reserva:', error);
        }
        getSensorData();
    }
}

setInterval(getSensorData, 2000);

const renderSpaces = () => {
    const container = document.getElementById('spacesContainer');
    if (container) {
        container.innerHTML = '';
        const spacesHtml = sensors.map((sensor, index) => {
            return `
                <div class="col-md-6 mb-4">
                    <div class="card sensor-card">
                        <div class="card-header text-center">Espacio ${index + 1}</div>
                        <div class="card-body text-center">
                            <p id="sensor${index + 1}" class="available">Disponible</p>
                            <p id="reservedInfo${index + 1}"></p>
                            <button id="reserveButton${index + 1}" class="btn btn-primary mt-2" onclick="openReservationForm(${index})">Reservar</button>
                            <button id="cancelButton${index + 1}" class="btn btn-danger mt-2" style="display: none;" onclick="cancelReservation(${index})">Cancelar Reserva</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = spacesHtml;
    }
};

renderSpaces();

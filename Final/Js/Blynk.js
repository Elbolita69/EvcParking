
        async function getSensorData() {
            const authToken = "s41iSHhmLQ124aj9xeBmW706kgJC3ILo";
            const sensors = ["V0", "V1", "V2", "V3"];
            const data = {};
            let availableSpaces = 0;

            for (let sensor of sensors) {
                const response = await fetch(https://blynk.cloud/external/api/get?token=${authToken}&pin=${sensor});
                const value = await response.text();
                data[sensor] = value.trim(); // Elimina espacios en blanco

                // Contar los espacios disponibles (valor "1" significa disponible)
                if (data[sensor] === "1") {
                    availableSpaces++;
                }
            }

            // Actualizar los valores de los sensores en la página
            document.getElementById('sensor1').innerText = data["V0"] === "1" ? "Disponible" : "Ocupado";
            document.getElementById('sensor1').className = data["V0"] === "1" ? "available" : "occupied";

            document.getElementById('sensor2').innerText = data["V1"] === "1" ? "Disponible" : "Ocupado";
            document.getElementById('sensor2').className = data["V1"] === "1" ? "available" : "occupied";

            document.getElementById('sensor3').innerText = data["V2"] === "1" ? "Disponible" : "Ocupado";
            document.getElementById('sensor3').className = data["V2"] === "1" ? "available" : "occupied";

            document.getElementById('sensor4').innerText = data["V3"] === "1" ? "Disponible" : "Ocupado";
            document.getElementById('sensor4').className = data["V3"] === "1" ? "available" : "occupied";

            // Actualizar el contador de espacios disponibles
            document.getElementById('availableSpaces').innerText = Espacios disponibles: ${availableSpaces};
        }

        setInterval(getSensorData, 2000); // Actualiza cada 2 segundos

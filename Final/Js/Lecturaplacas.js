function captureImage() {
    fetch('/leer_placa', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Placa detectada y guardada: " + data.plate);
            } else {
                alert("No se detectó ninguna placa.");
            }
        })
        .catch(error => console.error('Error:', error));
}

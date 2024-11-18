document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("tableBody");

    // Obtén los datos de 'parkedCars' desde el localStorage
    const parkedCars = JSON.parse(localStorage.getItem("parkedCars")) || {};

    // Recorre cada vehículo estacionado y crea una fila en la tabla
    Object.entries(parkedCars).forEach(([spot, car]) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${car.userName}</td>
            <td>${car.documentNumber}</td>
            <td>${spot}</td>
            <td>${car.plateNumber}</td>
        `;

        tableBody.appendChild(row);
    });

    // Inicializa la tabla DataTable
    $('#registrosTable').DataTable({
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 registros de un total de 0",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sFirst": "Primero",
                "sPrevious": "Anterior",
                "sNext": "Siguiente",
                "sLast": "Último"
            }
        }
    });

    // Exportar a Excel (XLSX)
    document.getElementById('exportXLSX').addEventListener('click', function () {
        var table = document.getElementById('registrosTable');
        var wb = XLSX.utils.table_to_book(table, { sheet: "Registros" });
        XLSX.writeFile(wb, "registros_ebc_parking.xlsx");
    });

    // Exportar a PDF usando jsPDF
    document.getElementById('exportPDF').addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Obtener el contenido de la tabla
        var elementHTML = document.getElementById('registrosTable');

        // Generar el PDF
        doc.autoTable({ html: elementHTML });

        // Descargar el PDF
        doc.save('registros_ebc_parking.pdf');
    });
});

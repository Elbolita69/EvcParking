$(document).ready(function () {
    // Comprobar si ya existe una instancia de DataTable y destruirla si es necesario
    if ($.fn.dataTable.isDataTable('#reservationHistoryTable')) {
        $('#reservationHistoryTable').DataTable().clear().destroy();
    }

    const reservationHistory = JSON.parse(localStorage.getItem("reservationHistory")) || [];

    // Función para formatear fechas ISO a un formato más legible
    function formatISODate(isoDate) {
        const date = new Date(isoDate);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Para formato de 24 horas
        };
        return date.toLocaleString('es-CO', options);
    }

    // Inicializar la tabla de DataTables
    const table = $('#reservationHistoryTable').DataTable({
        data: reservationHistory,
        columns: [
            {
                data: 'timestamp',
                render: function (data) {
                    return formatISODate(data);
                }
            },
            {
                data: 'space',
                render: function (data) {
                    return data ? data : 'Espacio no disponible'; // Aquí mostramos el valor de 'space' o un mensaje alternativo
                }
            },
            { data: 'name' },
            { data: 'plate' },
            { data: 'status' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `<button class="btn btn-danger delete-btn" data-index="${meta.row}">Eliminar</button>`;
                }
            }
        ],
        order: [[0, 'desc']],
        responsive: true,
        dom: 'Bfrtip',  // Para incluir los botones
        buttons: ['excel', 'pdf'],  // Botones predeterminados de DataTables
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
        }
    });
    

    // Delegación de eventos para el botón de eliminar
    $('#reservationHistoryTable').on('click', '.delete-btn', function () {
        const rowIndex = $(this).data('index');
        reservationHistory.splice(rowIndex, 1); // Eliminar la reserva de la lista
        localStorage.setItem("reservationHistory", JSON.stringify(reservationHistory)); // Actualizar localStorage
        table.clear().rows.add(reservationHistory).draw(); // Redibujar la tabla
    });
});

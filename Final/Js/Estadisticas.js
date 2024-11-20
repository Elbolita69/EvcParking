
    // Función para obtener el estado de los puestos desde localStorage
    function getParkingStatus() {
      const parkedCars = JSON.parse(localStorage.getItem('parkedCars')) || {}; // Los puestos ocupados
      let occupied = 0;
      let free = 0;
      
      // Lista de puestos disponibles (A1-B4)
      const spots = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];

      // Contamos cuántos están ocupados
      spots.forEach(spot => {
        if (parkedCars[spot]) {
          occupied++;
        } else {
          free++;
        }
      });

      return { occupied, free };
    }

    // Crear la gráfica de estado del estacionamiento
    function createChart() {
        const { occupied, free } = getParkingStatus();
        const ctx = document.getElementById('parkingChart').getContext('2d');
        new Chart(ctx, {
          type: 'pie', // Tipo de gráfico circular
          data: {
            labels: ['Ocupados', 'Libres'],
            datasets: [{
              data: [occupied, free], // Datos de ocupados y libres
              backgroundColor: ['#FF0000', '#0000FF'], // Colores para los puestos ocupados (rojo) y libres (azul)
              borderColor: ['#FF0000', '#0000FF'],
              borderWidth: 1
            }]
          },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw} puestos`;
                }
              }
            }
          }
        }
      });
    }

    // Función para actualizar el gráfico cuando se registre una nueva reserva
    function updateParkingChart() {
      const { occupied, free } = getParkingStatus();
      const chart = Chart.getChart("parkingChart");

      // Si el gráfico ya existe, actualizamos sus datos
      if (chart) {
        chart.data.datasets[0].data = [occupied, free]; // Actualizamos los datos del gráfico
        chart.update(); // Redibujamos el gráfico con los nuevos datos
      } else {
        // Si no hay gráfico, lo creamos
        createChart();
      }
    }

    // Llamamos a la función para crear el gráfico cuando el contenido de la página esté listo
    document.addEventListener("DOMContentLoaded", function () {
      createChart(); // Crear el gráfico al cargar la página
    });

    // Exponer la función para actualizar el gráfico desde el código de reserva
    window.updateParkingChart = updateParkingChart;
 
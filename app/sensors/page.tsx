import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';

export default function SensorsPage() {
  const [history, setHistory] = useState({
    timestamps: [] as string[],
    humidity: [] as number[],
  });

  useEffect(() => {
    // Función para obtener datos de la API y actualizar el gráfico
    async function fetchHumidityData() {
      try {
        const response = await fetch('/api/sensors');
        const data = await response.json();

        // Extrae y transforma los datos para el gráfico
        const timestamps = data.map((entry: any) => new Date(entry.timestamp).toLocaleTimeString());
        const humidityValues = data.map((entry: any) => entry.humidity_value);

        // Actualiza el estado con los nuevos datos
        setHistory({
          timestamps: timestamps.slice(-10), // Últimos 10 valores
          humidity: humidityValues.slice(-10),
        });
      } catch (error) {
        console.error('Error al obtener los datos de humedad:', error);
      }
    }

    // Llama a la función de obtención de datos al montar y cada 10 segundos
    fetchHumidityData();
    const interval = setInterval(fetchHumidityData, 10000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: history.timestamps,
    datasets: [
      {
        label: 'Humedad (%)',
        data: history.humidity,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Mediciones de Humedad en Tiempo Real',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-700 shadow-2xl rounded-2xl p-10 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-semibold mb-4 text-teal-300">Sensor de Humedad</h1>
        <Line data={data} options={options} />
        <div className="mt-8">
          <Link href="/" className="bg-teal-500 text-gray-900 font-medium text-lg px-8 py-3 rounded-lg hover:bg-teal-400 transition duration-200">
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

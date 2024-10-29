'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define un tipo para los datos de la API
type SensorData = {
  id: number;
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function SensorsPage() {
  const [history, setHistory] = useState({
    timestamps: [] as string[],
    humidity: [] as number[],
  });

  // Función para obtener los datos de la base de datos
  const fetchData = async () => {
    try {
      const response = await fetch('/api/sensors', {
        method: 'GET',
      });
      const data: SensorData[] = await response.json();

      // Transformar los datos recibidos en un formato adecuado para el gráfico
      const timestamps = data.map((item) => new Date(item.timestamp).toLocaleTimeString());
      const humidityValues = data.map((item) => item.humidity_value);

      setHistory({
        timestamps: timestamps.slice(-10), // Limita a los últimos 10 datos
        humidity: humidityValues.slice(-10), // Limita a los últimos 10 datos
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    // Llama a fetchData inmediatamente y luego cada 10 segundos
    fetchData();
    const interval = setInterval(fetchData, 10000);

    // Limpia el intervalo cuando el componente se desmonte
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
        font: {
          size: 18,
        },
        color: '#E5E5E5',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        title: {
          display: true,
          text: 'Humedad (%)',
          color: '#E5E5E5',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#E5E5E5',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-700 shadow-2xl rounded-2xl p-10 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-semibold mb-4 text-teal-300">Sensor de Humedad</h1>
        <p className="text-md mb-8 text-gray-300">
          Observa las mediciones en tiempo real de humedad en porcentaje.
        </p>
        <Line data={data} options={options} />
        <div className="mt-8">
          <Link href="/" className="bg-teal-500 text-gray-900 font-medium text-lg px-8 py-3 rounded-lg shadow-md hover:bg-teal-400 transition duration-200">
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

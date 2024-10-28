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
import { useState, useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SensorsPage() {
  const [history, setHistory] = useState({
    timestamps: [] as string[],
    humidity: [] as number[],
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/sensors');
      const data = await response.json();

      const now = new Date(data.timestamp).toLocaleTimeString();
      setHistory(prev => ({
        timestamps: [...prev.timestamps, now].slice(-10),
        humidity: [...prev.humidity, data.humidity].slice(-10),
      }));
    }

    fetchData();
    const interval = setInterval(fetchData, 15000);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="grid grid-cols-3 gap-4 w-full max-w-5xl">
        {/* Panel de información izquierda */}
        <div className="bg-gray-700 shadow-2xl rounded-2xl p-6 text-center text-white">
          <h2 className="text-2xl font-semibold mb-4 text-teal-300">Ubicación</h2>
          <p className="text-lg mb-4">Estadio Principal</p>
          <p className="text-sm text-gray-300">Coordenadas: 40.7128° N, 74.0060° W</p>
        </div>

        {/* Panel central con el gráfico */}
        <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 text-center col-span-1">
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

        {/* Panel de información derecha */}
        <div className="bg-gray-700 shadow-2xl rounded-2xl p-6 text-center text-white">
          <h2 className="text-2xl font-semibold mb-4 text-teal-300">Altura del Césped</h2>
          <p className="text-lg mb-4">7.5 cm</p>
          <p className="text-sm text-gray-300">Ideal para el rendimiento deportivo</p>
        </div>
      </div>
    </div>
  );
}

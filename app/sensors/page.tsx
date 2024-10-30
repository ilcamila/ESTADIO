'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function SensorsPage() {
  const [history, setHistory] = useState<HumidityData[]>([]);
  const [latestReading, setLatestReading] = useState<HumidityData | null>(null);

  useEffect(() => {
    async function fetchHumidityData() {
      const response = await fetch('/api/sensors');
      const data: HumidityData[] = await response.json();

      const sortedData = data.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setHistory(sortedData);
      const latestData = sortedData.filter((item) => item.location === "Ubicacion 1").pop();
      setLatestReading(latestData || null);
    }

    fetchHumidityData();
    const interval = setInterval(fetchHumidityData, 10000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: history.map((item) => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Humedad (%)',
        data: history.map((item) => item.humidity_value),
        borderColor: '#4ADE80',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Mediciones de Humedad en Tiempo Real',
        font: { size: 20 },
        color: '#F3F4F6',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: { display: true, text: 'Humedad (%)', color: '#D1D5DB' },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#D1D5DB' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex flex-col items-center p-8">
      <div className="bg-gray-800 bg-opacity-90 shadow-2xl rounded-2xl p-10 w-full max-w-3xl text-center animate-fadeIn">
        <h1 className="text-4xl font-bold mb-4 text-lime-300">Sensor de Humedad</h1>
        <p className="text-md mb-6 text-gray-300">
          Observa las mediciones de humedad en tiempo real.
        </p>
        <Line data={data} options={options} />

        <h2 className="text-2xl font-semibold mt-8 text-lime-300">Historial de Mediciones</h2>
        <div className="overflow-auto max-h-48 mt-4 rounded-lg bg-gray-700 bg-opacity-50 shadow-inner">
          <table className="min-w-full text-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-300">Hora</th>
                <th className="px-4 py-2 font-medium text-gray-300">Humedad (%)</th>
                <th className="px-4 py-2 font-medium text-gray-300">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index} className="even:bg-gray-600">
                  <td className="px-4 py-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                  <td className="px-4 py-2">{item.humidity_value}</td>
                  <td className="px-4 py-2">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="relative w-full max-w-4xl mt-12">
        <Image
          src="/campo_futbol.png"
          alt="Campo de fútbol"
          layout="responsive"
          width={300}
          height={200}
          className="rounded-lg shadow-lg"
        />

        <div className="absolute top-8 left-1/4 w-1/2 bg-lime-800 bg-opacity-75 rounded-lg p-6 text-center shadow-md">
          <h2 className="text-white text-lg font-semibold">Humedad - Ubicación 1</h2>
          {latestReading ? (
            <p className="text-white text-2xl mt-2 font-bold">
              {latestReading.humidity_value}% (a las {new Date(latestReading.timestamp).toLocaleTimeString()})
            </p>
          ) : (
            <p className="text-white">Cargando...</p>
          )}
        </div>

        <div className="absolute bottom-8 left-1/4 w-1/2 bg-gray-600 bg-opacity-50 rounded-lg p-4 text-center shadow-md">
          <h2 className="text-white text-lg font-semibold">Próxima Ubicación</h2>
          <p className="text-white text-sm">Pendiente de implementación en fase 2.</p>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/" className="bg-lime-500 text-gray-900 font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-lime-400 transition duration-200">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
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
};

export default function HomePage() {
  const [history, setHistory] = useState<HumidityData[]>([]);

  useEffect(() => {
    async function fetchHumidityData() {
      const response = await fetch('/api/sensors');
      const data: HumidityData[] = await response.json();

      const sortedData = data.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setHistory(sortedData);
    }

    fetchHumidityData();
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
        color: '#1F2937',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: { display: true, text: 'Humedad (%)', color: '#1F2937' },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#1F2937' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-white to-green-900 flex flex-col items-center justify-center p-6">
      {/* Encabezado con el título central */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-6xl font-extrabold text-green-600 mb-4">Estadio Universidad de Cundinamarca</h1>
        <p className="text-lg text-gray-800 leading-relaxed italic">
          &quot;Donde el fútbol cobra vida y los sueños se hacen realidad&quot;
        </p>
      </div>

      {/* Contenedor de dos columnas para historial y gráfica */}
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
        
        {/* Historial de Mediciones */}
        <div className="flex-1 bg-white bg-opacity-90 shadow-lg rounded-xl p-6">
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Historial de Humedad</h2>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full text-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-medium text-left">Hora</th>
                  <th className="px-4 py-2 font-medium text-left">Humedad (%)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    <td className="px-4 py-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2">{item.humidity_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfica de Humedad */}
        <div className="flex-1 bg-white bg-opacity-90 shadow-lg rounded-xl p-6">
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Gráfica de Humedad</h2>
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Pie de página con logos adicionales */}
      <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-6xl mt-16">
        <div className="flex items-center justify-center mb-8 sm:mb-0 sm:mr-8">
          <Image
            src="/Logo_Universidad_de_Cundinamarca.png"
            alt="Logo Universidad de Cundinamarca"
            width={100}
            height={100}
            className="rounded-full shadow-lg border-2 border-green-600 transform hover:rotate-6 transition-transform duration-300"
          />
        </div>
        <div className="text-center sm:text-left text-gray-600">
          <p className="text-sm">Universidad de Cundinamarca</p>
          <p className="text-xs italic">Apoyando el desarrollo deportivo y el espíritu competitivo.</p>
        </div>
      </div>
    </div>
  );
}

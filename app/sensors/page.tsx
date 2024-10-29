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

type HumidityData = {
  timestamp: string;
  humidity_value: number;
};

export default function SensorsPage() {
  const [history, setHistory] = useState({
    timestamps: [] as string[],
    humidity: [] as number[],
  });
  const [tableData, setTableData] = useState<HumidityData[]>([]);

  useEffect(() => {
    async function fetchHumidityData() {
      try {
        const response = await fetch('/api/sensors');
        if (!response.ok) {
          console.error('Error en la respuesta de la API:', response.statusText);
          return;
        }

        const data: HumidityData[] = await response.json();

        // Verifica que cada valor de humedad sea un número válido
        const validData = data.filter(
          (item) => typeof item.humidity_value === 'number' && !isNaN(item.humidity_value)
        );

        // Ordena los datos del más viejo al más reciente
        const sortedData = validData.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setHistory({
          timestamps: sortedData.map((item) => new Date(item.timestamp).toLocaleTimeString()),
          humidity: sortedData.map((item) => item.humidity_value),
        });

        setTableData(sortedData);
      } catch (error) {
        console.error('Error al obtener datos de humedad:', error);
      }
    }

    fetchHumidityData();
    const interval = setInterval(fetchHumidityData, 10000); // Actualizar cada 10 segundos

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
        
        {/* Tabla para mostrar los datos de humedad */}
        <div className="mt-10">
          <h2 className="text-2xl text-teal-300 mb-4">Historial de Mediciones</h2>
          <table className="table-auto w-full text-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Humedad (%)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                  <td className="border px-4 py-2">{item.humidity_value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <Link href="/" className="bg-teal-500 text-gray-900 font-medium text-lg px-8 py-3 rounded-lg shadow-md hover:bg-teal-400 transition duration-200">
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

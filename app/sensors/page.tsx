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

export default function SensorsPage() {
  const [history, setHistory] = useState({
    timestamps: [] as string[],
    humidity: [] as number[],
  });
  const [location, setLocation] = useState('Zona Aleatoria');
  const [grassHeight, setGrassHeight] = useState('5 cm');

  useEffect(() => {
    async function sendHumidityData() {
      const humidityValue = Math.random() * 100;

      try {
        const response = await fetch('/api/sensors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            humidity_value: humidityValue.toFixed(2),
            location,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dato de humedad enviado:', data);

          const now = new Date().toLocaleTimeString();
          setHistory(prev => ({
            timestamps: [...prev.timestamps, now].slice(-10),
            humidity: [...prev.humidity, parseFloat(humidityValue.toFixed(2))].slice(-10),
          }));
        } else {
          console.error('Error al enviar el dato de humedad:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }

    sendHumidityData();
    const interval = setInterval(sendHumidityData, 10000);
    return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    const updateData = () => {
      setLocation(`Zona Aleatoria ${Math.floor(Math.random() * 100)}`);
      setGrassHeight(`${Math.floor(Math.random() * 10 + 1)} cm`);
    };

    const interval = setInterval(updateData, 15000); // Cambia cada 15 segundos
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
      <h1 className="text-5xl font-bold mb-10 text-teal-400">Estación de Monitoreo de Humedad</h1>
      <div className="flex flex-col lg:flex-row items-center justify-around w-full max-w-6xl space-y-8 lg:space-y-0">
        
        {/* Panel Izquierdo */}
        <div className="bg-gray-700 rounded-lg p-6 w-full lg:w-1/4 text-center shadow-md">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4">Ubicación</h2>
          <p className="text-lg text-gray-200">{location}</p>
        </div>

        {/* Gráfico de Humedad */}
        <div className="bg-gray-800 shadow-2xl rounded-2xl p-10 w-full lg:w-1/2 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-teal-300">Sensor de Humedad</h2>
          <p className="text-md mb-8 text-gray-400">
            Observa las mediciones en tiempo real de humedad en porcentaje.
          </p>
          <Line data={data} options={options} />
          <Link href="/" className="bg-teal-500 text-gray-900 font-medium text-lg px-8 py-3 mt-6 inline-block rounded-lg shadow-md hover:bg-teal-400 transition duration-200">
            Ir al Inicio
          </Link>
        </div>

        {/* Panel Derecho */}
        <div className="bg-gray-700 rounded-lg p-6 w-full lg:w-1/4 text-center shadow-md">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4">Altura del Césped</h2>
          <p className="text-lg text-gray-200">{grassHeight}</p>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mt-10 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold text-teal-300 mb-4 text-center">Historial de Datos</h2>
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-700">Hora</th>
              <th className="px-4 py-2 border-b border-gray-700">Humedad (%)</th>
              <th className="px-4 py-2 border-b border-gray-700">Ubicación</th>
              <th className="px-4 py-2 border-b border-gray-700">Altura del Césped</th>
            </tr>
          </thead>
          <tbody>
            {history.timestamps.map((timestamp, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b border-gray-700">{timestamp}</td>
                <td className="px-4 py-2 border-b border-gray-700">{history.humidity[index]}%</td>
                <td className="px-4 py-2 border-b border-gray-700">{location}</td>
                <td className="px-4 py-2 border-b border-gray-700">{grassHeight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

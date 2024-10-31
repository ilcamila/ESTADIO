'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import HumidityChart from './components/HumidityChart';

type HumidityData = {
  timestamp: string;
  humidity_value: number;
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
      setLatestReading(sortedData[sortedData.length - 1] || null);
    }

    fetchHumidityData();
    const interval = setInterval(fetchHumidityData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-white to-green-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-6xl font-extrabold text-green-600 mb-4">Estadio Universidad de Cundinamarca</h1>
        <p className="text-lg text-gray-800 leading-relaxed italic">
          &quot;Monitoreo de Humedad del Terreno&quot;
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
        
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
                    <td className="px-4 py-2">{item.humidity_value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-1 bg-green-600 bg-opacity-90 shadow-lg rounded-xl p-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Humedad Actual</h2>
          {latestReading ? (
            <div className="text-center text-white">
              <p className="text-5xl font-bold mb-2">{latestReading.humidity_value}%</p>
              <p className="text-lg">
                Registrado a las {new Date(latestReading.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <p className="text-lg text-white">Cargando...</p>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl mt-10">
        <h2 className="text-3xl font-semibold text-green-700 text-center mb-4">Gráfica de Humedad</h2>
        <HumidityChart history={history} />
      </div>
    </div>
  );
}

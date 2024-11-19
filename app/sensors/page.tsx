'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function HomePage() {
  const [centerHistory, setCenterHistory] = useState<HumidityData[]>([]);
  const [goalRightHistory, setGoalRightHistory] = useState<HumidityData[]>([]);
  const [goalLeftHistory, setGoalLeftHistory] = useState<HumidityData[]>([]);
  const [latestCenterReading, setLatestCenterReading] = useState<HumidityData | null>(null);
  const [latestGoalRightReading, setLatestGoalRightReading] = useState<HumidityData | null>(null);
  const [latestGoalLeftReading, setLatestGoalLeftReading] = useState<HumidityData | null>(null);
  const [averageHumidity, setAverageHumidity] = useState<number | null>(null);

  useEffect(() => {
    async function fetchHumidityData() {
      const response = await fetch('/api/sensors');
      const data: HumidityData[] = await response.json();

      // Filtrar datos por ubicación
      const centerData = data.filter(item => item.location === 'centro');
      const goalRightData = data.filter(item => item.location === 'porteriaderecha');
      const goalLeftData = data.filter(item => item.location === 'porteriaizquierda');

      // Ordenar datos por timestamp
      centerData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      goalRightData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      goalLeftData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Actualizar el historial añadiendo datos nuevos
      setCenterHistory(prev => [...prev, ...centerData]);
      setGoalRightHistory(prev => [...prev, ...goalRightData]);
      setGoalLeftHistory(prev => [...prev, ...goalLeftData]);

      // Últimas lecturas
      const lastCenterReading = centerData[centerData.length - 1] || null;
      const lastGoalRightReading = goalRightData[goalRightData.length - 1] || null;
      const lastGoalLeftReading = goalLeftData[goalLeftData.length - 1] || null;

      setLatestCenterReading(lastCenterReading);
      setLatestGoalRightReading(lastGoalRightReading);
      setLatestGoalLeftReading(lastGoalLeftReading);

      // Calcular promedio
      if (lastCenterReading && lastGoalRightReading && lastGoalLeftReading) {
        setAverageHumidity(
          (lastCenterReading.humidity_value +
            lastGoalRightReading.humidity_value +
            lastGoalLeftReading.humidity_value) /
            3
        );
      }
    }

    // Llamar a la función de obtención de datos por primera vez
    fetchHumidityData();

    // Establecer un intervalo para actualizar automáticamente cada 30 segundos
    const interval = setInterval(fetchHumidityData, 30000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-white to-green-900 flex flex-col items-center justify-center p-6">
      {/* Encabezado con el título central */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-6xl font-extrabold text-green-600 mb-4">Estadio Universidad de Cundinamarca</h1>
        <p className="text-lg text-gray-800 leading-relaxed italic">
          &quot;Donde el fútbol cobra vida y los sueños se hacen realidad&quot;
        </p>
      </div>

      {/* Contenedor de tablas */}
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
        {/* Tabla de Humedad del Centro */}
        <div className="flex-1 bg-white bg-opacity-90 shadow-lg rounded-xl p-6">
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Humedad - Centro</h2>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full text-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-medium text-left">Hora</th>
                  <th className="px-4 py-2 font-medium text-left">Humedad (% HR)</th>
                </tr>
              </thead>
              <tbody>
                {centerHistory.map((item, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    <td className="px-4 py-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2">{item.humidity_value}% HR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de Humedad de la Portería Derecha */}
        <div className="flex-1 bg-white bg-opacity-90 shadow-lg rounded-xl p-6">
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Humedad - Portería Derecha</h2>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full text-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-medium text-left">Hora</th>
                  <th className="px-4 py-2 font-medium text-left">Humedad (% HR)</th>
                </tr>
              </thead>
              <tbody>
                {goalRightHistory.map((item, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    <td className="px-4 py-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2">{item.humidity_value}% HR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de Humedad de la Portería Izquierda */}
        <div className="flex-1 bg-white bg-opacity-90 shadow-lg rounded-xl p-6">
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Humedad - Portería Izquierda</h2>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full text-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-medium text-left">Hora</th>
                  <th className="px-4 py-2 font-medium text-left">Humedad (% HR)</th>
                </tr>
              </thead>
              <tbody>
                {goalLeftHistory.map((item, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    <td className="px-4 py-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2">{item.humidity_value}% HR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Promedio de Humedad */}
      <div className="w-full max-w-lg bg-green-600 bg-opacity-90 shadow-lg rounded-xl p-8 mt-12 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">Promedio de Humedad</h2>
        <div className="text-center text-white">
          <p className="text-5xl font-bold mb-2">
            {averageHumidity !== null ? `${averageHumidity.toFixed(2)}% HR` : 'Cargando...'}
          </p>
          <div className="w-full bg-gray-300 rounded-full h-8 mt-4 relative overflow-hidden shadow-md">
            <div
              className="h-8 rounded-full"
              style={{
                width: `${averageHumidity !== null ? averageHumidity : 0}%`,
                background: 'linear-gradient(90deg, #3b82f6, #22c55e)',
                transition: 'width 0.4s ease',
              }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
              {averageHumidity !== null ? `${averageHumidity.toFixed(2)}% HR` : 'Cargando...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

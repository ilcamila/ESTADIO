'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type HumidityData = {
  timestamp: string;
  humidity_value: number;
};

export default function HomePage() {
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
      setLatestReading(sortedData[sortedData.length - 1] || null); // Guarda el último dato de humedad
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

      {/* Contenedor de dos columnas para historial y última lectura */}
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
        
        {/* Historial de Mediciones */}
        <div className="flex-1 bg-white bg-opacity-90 shadow-lg rounded-xl p-6">
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Historial de Humedad</h2>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full text-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-medium text-left">Hora</th>
                  <th className="px-4 py-2 font-medium text-left">Humedad (% HR)</th> {/* Cambiado a % HR */}
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    <td className="px-4 py-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                    <td className="px-4 py-2">{item.humidity_value}% HR</td> {/* Agregamos % HR */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cuadro de Visualización de Humedad Actual */}
        <div className="flex-1 bg-green-600 bg-opacity-90 shadow-lg rounded-xl p-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Humedad Actual</h2>
          {latestReading ? (
            <div className="text-center text-white">
              <p className="text-5xl font-bold mb-2">{latestReading.humidity_value}% HR</p> {/* Agregamos % HR */}
              <p className="text-lg">
                Registrado a las {new Date(latestReading.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <p className="text-lg text-white">Cargando...</p>
          )}
        </div>
      </div>

      {/* Representación Adicional */}
      <div className="flex flex-col items-center w-full max-w-6xl mt-10">
        {/* Barra de Progreso */}
        <div className="w-full bg-gray-300 rounded-full h-6 mb-8">
          <div
            className="bg-green-600 h-6 rounded-full"
            style={{ width: `${latestReading ? latestReading.humidity_value : 0}%` }}
          ></div>
        </div>
        <p className="text-lg text-gray-700 text-center mb-8">
          Nivel de Humedad en Barra de Progreso
        </p>

        {/* Icono de Gota de Agua */}
        <div className="flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center"
            style={{
              transform: `scale(${latestReading ? latestReading.humidity_value / 100 : 0.5})`, // Escala proporcional a la humedad
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            💧
          </div>
          <p className="text-lg text-gray-700 mt-4">Representación de Humedad en Icono</p>
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

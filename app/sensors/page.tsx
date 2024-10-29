'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function SensorsPage() {
  const [latestReading, setLatestReading] = useState<HumidityData | null>(null);

  useEffect(() => {
    async function fetchLatestHumidityData() {
      try {
        const response = await fetch('/api/sensors');
        const data: HumidityData[] = await response.json();

        // Filtrar solo para la "Ubicacion 1" y obtener la última lectura
        const latestData = data.filter((item) => item.location === "Ubicacion 1").pop();
        setLatestReading(latestData || null);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }

    fetchLatestHumidityData();
    const interval = setInterval(fetchLatestHumidityData, 10000); // Actualizar cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-4xl">
        {/* Imagen de fondo del campo */}
        <Image
          src="/campo_futbol.png" // Asegúrate de que esta imagen esté en tu carpeta 'public/'
          alt="Campo de fútbol"
          layout="responsive"
          width={500}
          height={300}
          className="rounded-lg shadow-md"
        />
        
        {/* Cuadro superior - Última lectura de humedad de Ubicación 1 */}
        <div className="absolute top-8 left-1/4 w-1/2 bg-teal-700 bg-opacity-75 rounded-lg p-4 text-center">
          <h2 className="text-white text-lg font-semibold">Última Lectura de Humedad - Ubicación 1</h2>
          {latestReading ? (
            <p className="text-white text-2xl mt-2">
              {latestReading.humidity_value}% (Registrado a las {new Date(latestReading.timestamp).toLocaleTimeString()})
            </p>
          ) : (
            <p className="text-white">Cargando...</p>
          )}
        </div>

        {/* Cuadro inferior - Preparado para futura ESP */}
        <div className="absolute bottom-8 left-1/4 w-1/2 bg-gray-600 bg-opacity-50 rounded-lg p-4 text-center">
          <h2 className="text-white text-lg font-semibold">Próxima Ubicación</h2>
          <p className="text-white text-sm">Pendiente de implementación...</p>
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="bg-teal-500 text-gray-900 font-medium text-lg px-8 py-3 rounded-lg shadow-md hover:bg-teal-400 transition duration-200">
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
}

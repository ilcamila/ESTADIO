'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';  // Importa el componente Image
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function HomePage() {
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

      // Últimas lecturas
      const lastCenterReading = centerData[centerData.length - 1] || null;
      const lastGoalRightReading = goalRightData[goalRightData.length - 1] || null;
      const lastGoalLeftReading = goalLeftData[goalLeftData.length - 1] || null;

      setLatestCenterReading(lastCenterReading);
      setLatestGoalRightReading(lastGoalRightReading);
      setLatestGoalLeftReading(lastGoalLeftReading);

      // Calcular promedio de humedad
      if (lastCenterReading && lastGoalRightReading && lastGoalLeftReading) {
        setAverageHumidity(
          (lastCenterReading.humidity_value +
            lastGoalRightReading.humidity_value +
            lastGoalLeftReading.humidity_value) / 3
        );
      }
    }

    fetchHumidityData();
    const interval = setInterval(fetchHumidityData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Función para determinar el tipo de guayo basado en la humedad promedio
  const getCleatsType = (humidity: number | null) => {
    if (humidity === null) return 'Cargando...';

    if (humidity < 10) {
      return 'Firm Ground (FG): Taches cortos';
    } else if (humidity >= 10 && humidity <= 30) {
      return 'Firm Ground (FG) o Hybrid Ground';
    } else if (humidity > 30 && humidity <= 60) {
      return 'Soft Ground (SG): Taches largos';
    } else if (humidity > 60) {
      return 'Soft Ground (SG): Taches largos';
    } else {
      return 'Césped sintético: Artificial Ground (AG) con taches cortos';
    }
  };

  const cleatsRecommendation = getCleatsType(averageHumidity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-white to-green-900 flex flex-col items-center justify-center p-6">
      {/* Encabezado */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-6xl font-extrabold text-green-600 mb-4">Estadio Universidad de Cundinamarca</h1>
        <p className="text-lg text-gray-800 leading-relaxed italic">
          &quot;Donde el fútbol cobra vida y los sueños se hacen realidad&quot;
        </p>
      </div>

      {/* Imagen del campo de fútbol */}
      <div className="relative w-full max-w-6xl mb-12">
        <Image
          src="https://media.istockphoto.com/id/1142584719/es/vector/campo-de-f%C3%BAtbol-de-textura-realista-de-un-c%C3%A9sped-verde-antecedentes-de-f%C3%BAtbol.jpg?s=612x612&w=0&k=20&c=bb3rIa7NMNIzlaNt7z2X320gFbPDF8uZwcLc2R1DVFo="
          alt="Cancha de fútbol"
          width={1000}
          height={500}
          className="w-full h-auto rounded-xl shadow-lg"
        />

        {/* Lecturas de humedad encima de la imagen, en las respectivas zonas */}
        <div className="absolute inset-0 flex justify-between p-6">
          <div className="absolute top-10 left-1/4 text-white font-semibold text-xl">
            <p>Centro: {latestCenterReading ? `${latestCenterReading.humidity_value}% HR` : 'Sin datos'}</p>
            <p>{latestCenterReading ? new Date(latestCenterReading.timestamp).toLocaleTimeString() : ''}</p>
          </div>
          <div className="absolute top-10 right-1/4 text-white font-semibold text-xl">
            <p>Portería Derecha: {latestGoalRightReading ? `${latestGoalRightReading.humidity_value}% HR` : 'Sin datos'}</p>
            <p>{latestGoalRightReading ? new Date(latestGoalRightReading.timestamp).toLocaleTimeString() : ''}</p>
          </div>
          <div className="absolute bottom-10 left-1/4 text-white font-semibold text-xl">
            <p>Portería Izquierda: {latestGoalLeftReading ? `${latestGoalLeftReading.humidity_value}% HR` : 'Sin datos'}</p>
            <p>{latestGoalLeftReading ? new Date(latestGoalLeftReading.timestamp).toLocaleTimeString() : ''}</p>
          </div>
        </div>
      </div>

      {/* Promedio de Humedad y Recomendación de Guayos */}
      <div className="w-full max-w-lg bg-green-600 bg-opacity-90 shadow-lg rounded-xl p-8 mt-12 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">Promedio de Humedad y Recomendación de Guayos</h2>
        <div className="text-center text-white">
          <p className="text-5xl font-bold mb-2">
            {averageHumidity !== null ? `${averageHumidity.toFixed(2)}% HR` : 'Cargando...'}
          </p>
          <p className="text-2xl font-semibold mb-4">
            {cleatsRecommendation}
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

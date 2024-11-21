'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useRouter } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function GraphPage() {
  const [humidityHistory, setHumidityHistory] = useState<number[]>([]);
  const [averageHumidity, setAverageHumidity] = useState<number | null>(null);
  const [humidityByLocation, setHumidityByLocation] = useState<{ [key: string]: number }>({
    centro: 0,
    porteriaderecha: 0,
    porteriaizquierda: 0,
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchHumidityData() {
      const response = await fetch('/api/sensors');
      const data: HumidityData[] = await response.json();

      // Ordenar los datos por timestamp
      data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Calcular el promedio de humedad
      const lastHumidity = data[data.length - 1];
      setAverageHumidity(lastHumidity.humidity_value);

      // Actualizar la historia de la humedad
      const newHumidityHistory = [
        ...humidityHistory,
        lastHumidity.humidity_value,
      ];

      if (newHumidityHistory.length > 10) {
        newHumidityHistory.shift(); // Mantener solo los últimos 10 datos
      }

      setHumidityHistory(newHumidityHistory);

      // Actualizar las lecturas actuales de humedad para cada ubicación
      const humidityMap = {
        centro: 0,
        porteriaderecha: 0,
        porteriaizquierda: 0,
      };

      data.forEach(item => {
        if (humidityMap[item.location] !== undefined) {
          humidityMap[item.location] = item.humidity_value;
        }
      });

      setHumidityByLocation(humidityMap);
    }

    // Llamar a la función de obtención de datos por primera vez
    fetchHumidityData();

    // Establecer un intervalo para actualizar automáticamente cada 30 segundos
    const interval = setInterval(fetchHumidityData, 30000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, [humidityHistory]);

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

  const chartData = {
    labels: humidityHistory.map((_, index) => `Lectura ${index + 1}`),
    datasets: [
      {
        label: 'Humedad Promedio',
        data: humidityHistory,
        borderColor: 'rgb(34, 211, 238)',
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-white to-green-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-extrabold text-green-600 mb-6">Gráfica de Humedad Promedio</h1>

      <div className="flex mb-6">
        {/* Mostrar las lecturas actuales junto a la gráfica */}
        <div className="w-full max-w-4xl bg-white bg-opacity-90 shadow-lg rounded-xl p-6 mb-12">
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Humedad Promedio</h2>
          <Line data={chartData} />
        </div>
        
        {/* Panel de Humedad Actual por Ubicación */}
        <div className="flex flex-col ml-12 text-center">
          <h2 className="text-3xl font-semibold text-green-700 mb-6">Humedad Actual</h2>
          <div className="space-y-4">
            <div className="text-xl font-bold text-green-600">Centro: {humidityByLocation.centro}% HR</div>
            <div className="text-xl font-bold text-blue-600">Portería Derecha: {humidityByLocation.porteriaderecha}% HR</div>
            <div className="text-xl font-bold text-red-600">Portería Izquierda: {humidityByLocation.porteriaizquierda}% HR</div>
          </div>
        </div>
      </div>

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

      {/* Botón para redirigir al historial */}
      <div className="mt-12">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-500"
          onClick={() => router.push('/history')} // Redirige a la página de historial
        >
          Ver Historial de Datos
        </button>
      </div>
    </div>
  );
}

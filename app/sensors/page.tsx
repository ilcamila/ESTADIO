'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useRouter } from 'next/navigation'; // Usamos useRouter para la redirección

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function GraphPage() {
  const [humidityHistory, setHumidityHistory] = useState<number[]>([]); // Guardar los últimos 10 datos de humedad
  const [averageHumidity, setAverageHumidity] = useState<number | null>(null);
  const [humidityByLocation, setHumidityByLocation] = useState<{ [key: string]: number }>({}); // Guardar la humedad actual por ubicación
  const [currentTemperature, setCurrentTemperature] = useState<number | null>(null); // Temperatura actual
  const router = useRouter(); // Instanciamos el hook para redirigir

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

      // Inicializa el mapa de humedad
      const humidityMap: { [key: string]: number } = {
        centro: 0,
        porteriaderecha: 0,
        porteriaizquierda: 0,
      };

      // Recorre los datos y actualiza las lecturas de humedad
      data.forEach(item => {
        const locationKey = item.location.toLowerCase(); // Convierte la clave a minúsculas
        // Verifica que la clave existe en el mapa antes de actualizar
        if (humidityMap.hasOwnProperty(locationKey)) {
          humidityMap[locationKey] = item.humidity_value;
        }
      });

      setHumidityByLocation(humidityMap); // Actualiza el estado con los datos por ubicación
    }

    // Llamar a la función de obtención de datos por primera vez
    fetchHumidityData();

    // Establecer un intervalo para actualizar automáticamente cada 30 segundos
    const interval = setInterval(fetchHumidityData, 30000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, [humidityHistory]);

  // Obtener la temperatura actual desde OpenWeatherMap (requiere clave de API)
  useEffect(() => {
    async function fetchTemperature() {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Fusagasugá&appid=db13ad9597a138dfa4da26c00c31b22b&units=metric`);
      const data = await response.json();
      if (data.main) {
        setCurrentTemperature(data.main.temp); // Asignamos la temperatura
      }
    }

    fetchTemperature(); // Llamar a la función para obtener la temperatura

    const interval = setInterval(fetchTemperature, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonta
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

  // Datos para la gráfica
  const chartData = {
    labels: humidityHistory.map((_, index) => `Lectura ${index + 1}`),
    datasets: [
      {
        label: 'Humedad Promedio',
        data: humidityHistory,
        borderColor: 'rgb(34, 211, 238)', // Color de la línea
        backgroundColor: 'rgba(34, 211, 238, 0.2)', // Color del fondo
        fill: true,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-white to-green-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-extrabold text-green-600 mb-6">Gráfica de Humedad Promedio</h1>

      <div className="flex flex-col lg:flex-row items-center gap-6 w-full max-w-4xl bg-white bg-opacity-90 shadow-lg rounded-xl p-6 mb-12">
        <div className="w-full">
          <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Humedad Promedio</h2>
          <Line data={chartData} />
        </div>

        <div className="w-full text-center space-y-4">
          <h2 className="text-2xl font-semibold text-green-700 mb-6">Lecturas Actuales de Humedad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700">Centro</h3>
              <p className="text-3xl font-bold text-blue-500">
                {humidityByLocation.centro !== undefined ? `${humidityByLocation.centro}% HR` : 'Cargando...'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700">Portería Derecha</h3>
              <p className="text-3xl font-bold text-blue-500">
                {humidityByLocation.porteriaderecha !== undefined ? `${humidityByLocation.porteriaderecha}% HR` : 'Cargando...'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700">Portería Izquierda</h3>
              <p className="text-3xl font-bold text-blue-500">
                {humidityByLocation.porteriaizquierda !== undefined ? `${humidityByLocation.porteriaizquierda}% HR` : 'Cargando...'}
              </p>
            </div>
          </div>
          {/* Mostrar la temperatura actual */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-green-700">Temperatura Actual</h3>
            <p className="text-3xl font-bold text-blue-500">
              {currentTemperature !== null ? `${currentTemperature.toFixed(1)}°C` : 'Cargando...'}
            </p>
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
          onClick={() => router.push('/history')} // Ruta correcta para acceder al historial
        >
          Ver Historial de Datos
        </button>
      </div>
    </div>
  );
}

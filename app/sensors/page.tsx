import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function HomePage() {
  const [centerHistory, setCenterHistory] = useState<HumidityData[]>([]);
  const [averageHumidity, setAverageHumidity] = useState<number | null>(null);
  const [humidityHistory, setHumidityHistory] = useState<number[]>([]);

  useEffect(() => {
    async function fetchHumidityData() {
      const response = await fetch('/api/sensors');
      const data: HumidityData[] = await response.json();
      const centerData = data.filter(item => item.location === 'centro');

      centerData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      setCenterHistory(prev => [...prev, ...centerData]);

      const lastCenterReading = centerData[centerData.length - 1] || null;
      if (lastCenterReading) {
        setAverageHumidity(lastCenterReading.humidity_value);
      }

      const newHumidityHistory = [
        ...humidityHistory,
        lastCenterReading ? lastCenterReading.humidity_value : 0,
      ];

      if (newHumidityHistory.length > 10) {
        newHumidityHistory.shift();
      }

      setHumidityHistory(newHumidityHistory);
    }

    fetchHumidityData();
    const interval = setInterval(fetchHumidityData, 30000);

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
    } else {
      return 'Soft Ground (SG): Taches largos';
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
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-6xl font-extrabold text-green-600 mb-4">Estadio Universidad de Cundinamarca</h1>
        <p className="text-lg text-gray-800 leading-relaxed italic">
          &quot;Donde el fútbol cobra vida y los sueños se hacen realidad&quot;
        </p>
      </div>

      {/* Gráfica de la Humedad Promedio */}
      <div className="w-full max-w-4xl bg-white bg-opacity-90 shadow-lg rounded-xl p-6 mb-12">
        <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Gráfica de Humedad Promedio</h2>
        <Line data={chartData} />
      </div>

      {/* Nuevo Botón para visualizar todos los datos */}
      <div className="w-full max-w-4xl text-center mb-12">
        <a
          href="/all-sensors"
          className="bg-green-600 text-white text-lg font-semibold px-10 py-3 rounded-full hover:bg-green-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Ver Todos los Datos
        </a>
      </div>

      {/* Tabla de datos */}
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
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
      </div>

      {/* Promedio de Humedad y Recomendación de Guayos */}
      <div className="w-full max-w-lg bg-green-600 bg-opacity-90 shadow-lg rounded-xl p-8 mt-12 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">Promedio de Humedad y Recomendación de Guayos</h2>
        <div className="text-center text-white">
          <p className="text-5xl font-bold mb-2">
            {averageHumidity !== null ? `${averageHumidity.toFixed(2)}% HR` : 'Cargando...'}
          </p>
          <p className="text-2xl font-semibold mb-4">{cleatsRecommendation}</p>
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

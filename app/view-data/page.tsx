'use client';

import { useState, useEffect } from 'react';

type HumidityData = {
  timestamp: string;
  humidity_value: number;
  location: string;
};

export default function ViewData() {
  const [allData, setAllData] = useState<HumidityData[]>([]);
  const [filteredData, setFilteredData] = useState<HumidityData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/sensors');
      const data: HumidityData[] = await response.json();
      setAllData(data);
      setFilteredData(data); // Inicialmente, mostramos todos los datos
    }

    fetchData();
  }, []);

  const handleFilter = (location: string) => {
    const filtered = allData.filter(item => item.location === location);
    setFilteredData(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-white to-green-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-extrabold text-green-600 mb-6">Filtrar Datos de Humedad</h1>
      <div className="flex space-x-4 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500"
          onClick={() => handleFilter('centro')}
        >
          Centro
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500"
          onClick={() => handleFilter('porteriaderecha')}
        >
          Portería Derecha
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500"
          onClick={() => handleFilter('porteriaizquierda')}
        >
          Portería Izquierda
        </button>
      </div>

      {/* Mostrar datos filtrados */}
      <div className="w-full max-w-4xl bg-white bg-opacity-90 shadow-lg rounded-xl p-6 mb-12">
        <h2 className="text-3xl font-semibold text-green-700 text-center mb-6">Datos Filtrados</h2>
        <div className="overflow-auto max-h-60">
          <table className="min-w-full text-gray-800">
            <thead>
              <tr>
                <th className="px-4 py-2 font-medium text-left">Hora</th>
                <th className="px-4 py-2 font-medium text-left">Humedad (% HR)</th>
                <th className="px-4 py-2 font-medium text-left">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="even:bg-gray-100">
                  <td className="px-4 py-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                  <td className="px-4 py-2">{item.humidity_value}% HR</td>
                  <td className="px-4 py-2">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

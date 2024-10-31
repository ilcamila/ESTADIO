import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function HumidityChart({ history }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Humedad (%)',
        data: [],
        borderColor: 'rgba(34, 197, 94, 1)', // Verde
        backgroundColor: 'rgba(34, 197, 94, 0.2)', // Verde claro con opacidad
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const labels = history.map(item => new Date(item.timestamp).toLocaleTimeString());
    const data = history.map(item => item.humidity_value);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Humedad (%)',
          data,
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    });
  }, [history]);

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tiempo',
          color: '#333',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Humedad (%)',
          color: '#333',
        },
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

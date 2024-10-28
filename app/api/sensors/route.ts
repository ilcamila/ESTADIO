import { useEffect } from 'react';

export default function SendRandomHumidity() {
  useEffect(() => {
    const sendRandomHumidity = async () => {
      const randomHumidity = Math.random() * 100;
      const location = 'Zona Aleatoria';

      try {
        const response = await fetch('/api/sensors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            humidity_value: randomHumidity.toFixed(2),
            location: location,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dato de humedad enviado:', data);
        } else {
          console.error('Error al enviar el dato de humedad:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    sendRandomHumidity();
    const interval = setInterval(sendRandomHumidity, 15000);

    return () => clearInterval(interval);
  }, []);
}

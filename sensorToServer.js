const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const axios = require('axios');

// Configura el puerto serial, asegúrate de usar el puerto correcto
const port = new SerialPort('COM3', { baudRate: 9600 }); // Cambia 'COM3' al puerto correcto
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

// Cuando recibamos datos del Arduino
parser.on('data', async (data) => {
  console.log(`Distancia recibida: ${data} cm`);

  try {
    // Enviar los datos a tu API en Next.js
    await axios.post('https://estadio-dashboard.vercel.app/sensors', {
      distance: parseFloat(data) // Convierte el dato a número
    });
    console.log('Dato enviado al servidor');
  } catch (error) {
    console.error('Error al enviar el dato:', error.message);
  }
});

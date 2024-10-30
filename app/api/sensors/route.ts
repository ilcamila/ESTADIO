import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Configuración y creación del cliente de PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Configuración SSL para conexiones seguras
  },
});

// Variable de estado para asegurar conexión única
let isConnected = false;

// Función para conectar al cliente de PostgreSQL si no está conectado.
async function connectClient() {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log("✅ Conexión establecida con la base de datos");
    } catch (error) {
      console.error("❌ Error al conectar a la base de datos:", error);
    }
  }
}

// Función para generar datos aleatorios de humedad y ubicación
function generateRandomHumidityData() {
  const humidityValue = Math.floor(Math.random() * 101); // Genera un valor entre 0 y 100
  const locations = ["Estadio", "Casa", "Oficina", "Parque"];
  const location = locations[Math.floor(Math.random() * locations.length)]; // Selecciona una ubicación aleatoria

  return { humidity_value: humidityValue, location };
}

// Manejador de solicitudes GET para recuperar datos de humedad de la base de datos
export async function GET() {
  try {
    await connectClient();

    const query = 'SELECT * FROM Humedad ORDER BY timestamp DESC LIMIT 10;';
    const res = await client.query(query);

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('❌ Error al obtener datos de la base de datos:', err);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}

// Manejador de solicitudes POST para insertar datos de humedad en la base de datos
export async function POST(req: Request) {
  try {
    await connectClient();

    // Generar datos aleatorios
    const { humidity_value, location } = generateRandomHumidityData();

    // Consulta SQL para insertar los datos
    const query = `
      INSERT INTO humedad (humidity_value, location)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [humidity_value, location];
    const res = await client.query(query, values);

    console.log("✅ Datos insertados con éxito:", res.rows[0]);
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error('❌ Error al insertar datos en la base de datos:', err);
    return NextResponse.json({ error: 'Error al insertar datos' }, { status: 500 });
  }
}

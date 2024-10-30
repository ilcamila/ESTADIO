import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Manejador de solicitudes GET para recuperar datos de humedad de la base de datos
export async function GET() {
  // Configuración y creación del cliente de PostgreSQL
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Conexión a la base de datos
    await client.connect();

    // Consulta SQL para obtener las últimas 10 entradas de humedad
    const query = 'SELECT * FROM Humedad ORDER BY timestamp DESC LIMIT 10;';
    const res = await client.query(query);

    // Finaliza la conexión
    await client.end();

    // Responde con los datos obtenidos en formato JSON
    return NextResponse.json(res.rows);
  } catch (err) {
    // Manejo de errores y finalización de la conexión
    console.error('❌ Error al obtener datos de la base de datos:', err);
    await client.end();
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Configuración del cliente de PostgreSQL utilizando la variable de entorno `DATABASE_URL`
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Función para manejar las solicitudes `POST`
export async function POST(req: Request) {
  const { humidity_value, location } = await req.json();

  try {
    // Conecta a la base de datos en cada solicitud
    await client.connect();

    // Inserta los datos en la tabla `Humedad`
    const query = `
      INSERT INTO Humedad (humidity_value, location)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [humidity_value, location];
    const res = await client.query(query, values);

    // Responde con los datos insertados
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error('Error al insertar datos:', err);
    return NextResponse.json({ error: 'Error al insertar datos' }, { status: 500 });
  } finally {
    // Cierra la conexión a la base de datos
    await client.end();
  }
}

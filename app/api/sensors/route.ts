import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Configuración del cliente de PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Asegúrate de que esté configurado correctamente para tu entorno
  },
});

// Agrega una propiedad para rastrear el estado de conexión
let isConnected = false;

async function connectClient() {
  if (!isConnected) {
    await client.connect();
    isConnected = true; // Marca como conectado
    console.log("Conexión establecida con la base de datos");
  }
}

export async function POST(req: Request) {
  const { humidity_value, location } = await req.json();

  try {
    // Asegúrate de que el cliente esté conectado antes de ejecutar la consulta
    await connectClient();

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
  }
}

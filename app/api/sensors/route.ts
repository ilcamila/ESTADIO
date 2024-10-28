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

/**
 * Función para conectar al cliente de PostgreSQL si no está conectado.
 * Solo realiza la conexión una vez.
 */
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

/**
 * Manejador de solicitudes POST para insertar datos de humedad en la base de datos.
 * @param req La solicitud HTTP
 * @returns Respuesta JSON con los datos insertados o un mensaje de error
 */
export async function POST(req: Request) {
  const { humidity_value, location } = await req.json();

  try {
    // Asegura que el cliente esté conectado antes de ejecutar la consulta
    await connectClient();

    // Consulta SQL para insertar los datos
    const query = `
      INSERT INTO Humedad (humidity_value, location)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [humidity_value, location];
    const res = await client.query(query, values);

    // Responde con los datos insertados en formato JSON
    console.log("✅ Datos insertados con éxito:", res.rows[0]);
    return NextResponse.json(res.rows[0]);

  } catch (err) {
    console.error('❌ Error al insertar datos en la base de datos:', err);
    return NextResponse.json({ error: 'Error al insertar datos' }, { status: 500 });
  }
}

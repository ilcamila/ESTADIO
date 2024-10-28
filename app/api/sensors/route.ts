import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Configuración del cliente de PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Conéctate a la base de datos solo una vez
(async () => {
  try {
    await client.connect();
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})();

export async function POST(req: Request) {
  const { humidity_value, location } = await req.json();

  try {
    // Inserta los datos en la tabla de humedad
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

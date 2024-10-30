import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración del pool de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const query = 'SELECT * FROM Humedad ORDER BY timestamp DESC LIMIT 10;';
    const res = await pool.query(query); // Ejecuta la consulta directamente en el pool
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('❌ Error al obtener datos de la base de datos:', err);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type debe ser application/json' }, { status: 400 });
    }

    const { humidity_value, location } = await req.json();
    if (humidity_value === undefined || !location) {
      return NextResponse.json({ error: 'Faltan datos: humidity_value o location' }, { status: 400 });
    }

    const query = `
      INSERT INTO humedad (humidity_value, location)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [humidity_value, location];
    const res = await pool.query(query, values); // Ejecuta la inserción directamente en el pool

    console.log("✅ Datos insertados con éxito:", res.rows[0]);
    return NextResponse.json(res.rows[0]);

  } catch (err) {
    console.error('❌ Error al insertar datos en la base de datos:', err);
    return NextResponse.json({ error: 'Error al insertar datos' }, { status: 500 });
  }
}

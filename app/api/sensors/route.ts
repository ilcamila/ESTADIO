import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: Request) {
  const { humidity_value, location } = await req.json();

  try {
    await client.connect();

    const query = `
      INSERT INTO Humedad (humidity_value, location)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [humidity_value, location];
    const res = await client.query(query, values);

    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error('Error al insertar datos:', err);
    return NextResponse.json({ error: 'Error al insertar datos' }, { status: 500 });
  } finally {
    await client.end();
  }
}

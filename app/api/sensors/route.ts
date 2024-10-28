import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Obtener solo id, timestamp y distance de los últimos 10 registros
    const result = await sql`
      SELECT id, timestamp, distance 
      FROM sensors 
      ORDER BY timestamp DESC
      LIMIT 10;
    `;

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al interactuar con la base de datos:', error);
    return NextResponse.json({ error: 'Error al interactuar con la base de datos' });
  }
}

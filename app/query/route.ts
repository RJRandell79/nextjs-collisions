import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function countCollisions() {
 	const data = await sql`SELECT COUNT(*) FROM collisions`;

    return data;
}

export async function GET() {
  try {
  return Response.json(await countCollisions());
  } catch (error) {
  return Response.json({ error }, { status: 500 });
  }
}

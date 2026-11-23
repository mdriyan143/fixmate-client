import { MongoClient } from "mongodb";

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI as string, {
    serverSelectionTimeoutMS: 8000,
  });
  try {
    await client.db(process.env.DB_NAME).command({ ping: 1 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  } finally {
    await client.close();
  }
}
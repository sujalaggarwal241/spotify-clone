import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  let body: { ids?: string[] };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    return Response.json([], { status: 200 });
  }

  const objectIds = body.ids
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));

  const client = await clientPromise;
  const db = client.db();

  const songs = await db
    .collection("songs")
    .find({ _id: { $in: objectIds } })
    .toArray();

  return Response.json(
    songs.map((s) => ({
      ...s,
      _id: s._id.toString(),
    }))
  );
}

// src/app/api/artists/[id]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Next.js 15: params is a Promise
    const { id } = await context.params;

    // ✅ validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid artist id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const artistId = new ObjectId(id);

    const artist = await db.collection("artists").findOne({ _id: artistId });
    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    const albums = await db
      .collection("albums")
      .find({ artistId })
      .sort({ createdAt: 1 })
      .toArray();

    const songs = await db
      .collection("songs")
      .find({ artistId })
      .sort({ streams: -1, createdAt: 1 })
      .toArray();

    return NextResponse.json({ artist, albums, songs }, { status: 200 });
  } catch (err) {
    console.error("GET /api/artists/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

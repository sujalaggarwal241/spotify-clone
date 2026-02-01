// src/app/api/albums/[id]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ unwrap params (REQUIRED in Next 15)
    const { id } = await context.params;

    // ✅ validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid album id" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(); // uses spotify_clone from URI

    const albumId = new ObjectId(id);

    // 🎵 Album
    const album = await db.collection("albums").findOne({ _id: albumId });
    if (!album) {
      return NextResponse.json(
        { error: "Album not found" },
        { status: 404 }
      );
    }

    // 🎤 Artist
    const artist = album.artistId
      ? await db
          .collection("artists")
          .findOne({ _id: album.artistId })
      : null;

    // 🎶 Songs
    const songs = await db
      .collection("songs")
      .find({ albumId })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json(
      { album, artist, songs },
      { status: 200 }
    );
  } catch (err) {
    console.error("Album API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Body:
 * { "songId": "MONGO_SONG_OBJECT_ID" }
 */

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params; // ✅ Next 16: params is Promise
  const playlistId = (id || "").trim();

  if (!ObjectId.isValid(playlistId)) {
    return NextResponse.json({ error: "Invalid playlist id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const songId = body?.songId?.trim?.();

  if (!songId || !ObjectId.isValid(songId)) {
    return NextResponse.json({ error: "Invalid songId" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const ownerId = new ObjectId(session.user.id);

  // ✅ ensure playlist exists AND belongs to current user
  const playlist = await db.collection("playlists").findOne({
    _id: new ObjectId(playlistId),
    ownerId,
  });

  if (!playlist) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
  }

  // ✅ optional: ensure song exists
  const songExists = await db.collection("songs").findOne({ _id: new ObjectId(songId) });
  if (!songExists) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }

  // ✅ add song only if not already present
  await db.collection("playlists").updateOne(
    { _id: new ObjectId(playlistId), ownerId },
    {
      $addToSet: { songs: new ObjectId(songId) }, // prevents duplicates
      $set: { updatedAt: new Date() },
    }
  );

  return NextResponse.json({ ok: true }, { status: 200 });
}

/**
 * Remove a song from playlist
 * Body: { "songId": "MONGO_SONG_OBJECT_ID" }
 */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const playlistId = (id || "").trim();

  if (!ObjectId.isValid(playlistId)) {
    return NextResponse.json({ error: "Invalid playlist id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const songId = body?.songId?.trim?.();

  if (!songId || !ObjectId.isValid(songId)) {
    return NextResponse.json({ error: "Invalid songId" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const ownerId = new ObjectId(session.user.id);

  const res = await db.collection("playlists").updateOne(
    { _id: new ObjectId(playlistId), ownerId },
    {
      $pull: { songs: new ObjectId(songId) },
      $set: { updatedAt: new Date() },
    }
  );

  if (!res.matchedCount) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

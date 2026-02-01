import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

/* =========================
   CREATE PLAYLIST (POST)
========================= */
export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const playlists = db.collection("playlists");

  const count = await playlists.countDocuments({
    ownerId: new ObjectId(session.user.id),
  });

  const now = new Date();

  const doc = {
    name: `My playlist #${count + 1}`,
    description: "",
    coverUrl: "",
    ownerId: new ObjectId(session.user.id),
    songs: [], // song ObjectIds
    isPublic: false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await playlists.insertOne(doc);

  return NextResponse.json(
    { playlistId: result.insertedId.toString() },
    { status: 201 }
  );
}

/* =========================
   GET USER PLAYLISTS
========================= */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  const playlists = await db
    .collection("playlists")
    .find({
      ownerId: new ObjectId(session.user.id),
    })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    playlists: playlists.map((p) => ({
      ...p,
      _id: p._id.toString(),
      ownerId: p.ownerId.toString(),
    })),
  });
}

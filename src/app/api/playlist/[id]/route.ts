import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Params = {
  params: Promise<{ id: string }>;
};

type PatchBody = {
  name?: string;
  description?: string;
  isPublic?: boolean;
  coverUrl?: string;
};


export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid playlist id" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const playlist = await db.collection("playlists").findOne({
    _id: new ObjectId(id),
  });
  
  if (!playlist) {
    return Response.json({ error: "Playlist not found" }, { status: 404 });
  }

  // ✅ If public, return to anyone
  if (playlist.isPublic === true) {
    return Response.json(playlist, { status: 200 });
  }

  // 🔒 Private: must be logged in + owner
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isOwner =
    playlist.ownerId &&
    new ObjectId(userId).equals(playlist.ownerId as ObjectId);

  if (!isOwner) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json(playlist, { status: 200 });
}



export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid playlist id" }, { status: 400 });
  }

  let body: PatchBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Only allow these fields
  const update: Record<string, any> = {};
  if (typeof body.name === "string") update.name = body.name.trim();
  if (typeof body.description === "string") update.description = body.description.trim();
  if (typeof body.isPublic === "boolean") update.isPublic = body.isPublic;
  if (typeof body.coverUrl === "string") update.coverUrl = body.coverUrl.trim();

  if (Object.keys(update).length === 0) {
    return Response.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // Basic validation
  if ("name" in update && update.name.length === 0) {
    return Response.json({ error: "Name cannot be empty" }, { status: 400 });
  }
  if ("name" in update && update.name.length > 100) {
    return Response.json({ error: "Name too long (max 100)" }, { status: 400 });
  }
  if ("description" in update && update.description.length > 500) {
    return Response.json({ error: "Description too long (max 500)" }, { status: 400 });
  }

  update.updatedAt = new Date();

  const client = await clientPromise;
  const db = client.db();
  const playlists = db.collection("playlists");

  // Owner-only update
  const result = await playlists.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      ownerId: new ObjectId(session.user.id),
    },
    { $set: update },
    { returnDocument: "after" }
  );

  if (!result?.value) {
    return Response.json({ error: "Playlist not found or forbidden" }, { status: 404 });
  }

  return Response.json(result.value, { status: 200 });
}


export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid playlist id" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const playlists = db.collection("playlists");

  // ✅ Owner-only delete
  const result = await playlists.deleteOne({
    _id: new ObjectId(id),
    ownerId: new ObjectId(session.user.id),
  });

  if (result.deletedCount === 0) {
    return Response.json(
      { error: "Playlist not found or forbidden" },
      { status: 404 }
    );
  }

  return Response.json({ ok: true }, { status: 200 });
}

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient, ObjectId } from "mongodb";
import { songs } from "../src/types/songs.js";
import { artists } from "../src/types/artists.js";
import { albums } from "../src/types/albums.js";

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI missing. Check .env.local");
}

const client = new MongoClient(process.env.MONGODB_URI);

async function seed() {
  await client.connect();
  const db = client.db();

  // ✅ Clear collections (fresh seed every time)
  await Promise.all([
    db.collection("artists").deleteMany({}),
    db.collection("albums").deleteMany({}),
    db.collection("songs").deleteMany({}),
  ]);

  // Maps: local numeric id -> Mongo ObjectId
  const artistMap = new Map<number, ObjectId>();
  const albumMap = new Map<number, ObjectId>();
  const songMap = new Map<number, ObjectId>();

  // 1) Seed artists
  for (const artist of artists) {
    const res = await db.collection("artists").insertOne({
      name: artist.name,
      imageUrl: artist.imageUrl,
      monthlyListeners: artist.monthlyListeners,
      createdAt: new Date(),
    });
    artistMap.set(artist.id, res.insertedId);
  }

  // 2) Seed albums (without songIds for now)
  for (const album of albums) {
    const artistObjectId = artistMap.get(album.artistId);
    if (!artistObjectId) {
      throw new Error(`❌ Album ${album.id} references missing artistId ${album.artistId}`);
    }

    const res = await db.collection("albums").insertOne({
      title: album.title,
      artistId: artistObjectId,
      coverUrl: album.coverUrl,
      year: album.year,
      createdAt: new Date(),
    });

    albumMap.set(album.id, res.insertedId);
  }

  // 3) Seed songs
  for (const song of songs) {
    const artistObjectId = artistMap.get(song.artistId);
    const albumObjectId = albumMap.get(song.albumId);

    if (!artistObjectId) {
      throw new Error(`❌ Song ${song.id} references missing artistId ${song.artistId}`);
    }
    if (!albumObjectId) {
      throw new Error(`❌ Song ${song.id} references missing albumId ${song.albumId}`);
    }

    const res = await db.collection("songs").insertOne({
      title: song.title,
      duration: song.duration,
      audioUrl: song.audioUrl,   // should be like "/audio/1.mp3"
      coverUrl: song.coverUrl,
      streams: song.streams,
      artistId: artistObjectId,
      albumId: albumObjectId,
      createdAt: new Date(),
    });

    songMap.set(song.id, res.insertedId);
  }

  // 4) OPTIONAL: store trackIds in albums from your local album.songIds
  // (If you don't need it, you can delete this whole section.)
  for (const album of albums) {
    const albumObjectId = albumMap.get(album.id)!;

    const trackIds = album.songIds
      .map((sid) => songMap.get(sid))
      .filter(Boolean) as ObjectId[];

    await db.collection("albums").updateOne(
      { _id: albumObjectId },
      { $set: { trackIds } }
    );
  }

  console.log("✅ Seed complete");
}

seed()
  .then(async () => {
    await client.close();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("❌ Seed failed:", err);
    await client.close();
    process.exit(1);
  });

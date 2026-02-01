import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const songs = await db
    .collection("songs")
    .find({})
    .toArray();

  return NextResponse.json(songs);
}

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const albums = await db
    .collection("albums")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
    
  return NextResponse.json(albums);
}

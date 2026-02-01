import { ObjectId } from "mongodb";

export type Song = {
  id: number;
  title: string;
  duration: number;
  audioUrl: string;
  coverUrl: string;
  streams: number;
  artistId: string | ObjectId | undefined;
  albumId: string | ObjectId | undefined;
  _id : ObjectId
};